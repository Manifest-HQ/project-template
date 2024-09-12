import { defineStore } from 'pinia'
import { supabase } from '../supabase'
import { Network } from '@capacitor/network'
import { Preferences } from '@capacitor/preferences'

export const useStoreDB = defineStore('DB', () => {
  const tables = ref({})
  const network = ref(true)

  Network.addListener('networkStatusChange', (status) => {
    network.value = status.connected
    if (!network.value) {
      alert(
        'You have no internet connection. If you continue, the data will not be saved.'
      )
      loadTablesFromPreferences()
      console.log('test loadTablesFromPreferences', tables.value)
    } else {
      loadTables()
    }
  })

  async function saveTableToPreferences(tableName, data) {
    const jsonData = JSON.stringify(data)
    await Preferences.set({
      key: tableName,
      value: jsonData
    })
  }

  async function loadTablesFromPreferences() {
    const { keys } = await Preferences.keys()
    for (let key of keys) {
      const { value } = await Preferences.get({ key })
      if (value) {
        tables.value[key] = JSON.parse(value)
      }
    }
  }

  async function loadTables() {
    const { data: public_tables, error } = await supabase
      .from('public_tables')
      .select('*')

    if (error) {
      console.error('Error fetching tables:', error)
    } else {
      console.log(public_tables)
      for (let record of public_tables) {
        const info = await loadTableInfo(record.table_name)
        console.log('record', record)
        tables.value[record.table_name] = info
        await saveTableToPreferences(record.table_name, info)
      }

      console.log(tables)
    }
  }

  loadTables()

  supabase
    .channel('custom-all-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: '*' },
      (payload) => {
        console.log('change received')
        console.log(payload)

        try {
          switch (payload.eventType) {
            case 'INSERT':
              tables.value[payload.table].push(payload.new)
              break

            case 'UPDATE':
              const tableRecords = tables.value[payload.table]
              const updatedRecordIndex = tableRecords.findIndex(
                (record) => record.id === payload.new.id
              )
              if (updatedRecordIndex !== -1) {
                tables.value[payload.table][updatedRecordIndex] = payload.new
              }
              break

            case 'DELETE':
              const deleteRecordIndex = tables.value[payload.table].findIndex(
                (record) => record.id === payload.old.id
              )
              if (deleteRecordIndex !== -1) {
                tables.value[payload.table].splice(deleteRecordIndex, 1)
              }
              break
          }
          saveTableToPreferences(payload.table, tables.value[payload.table])
        } catch (error) {
          console.error('Error processing change:', error)
        }
      }
    )
    .subscribe()

  return { tables }
})

async function loadTableInfo(table) {
  const { data: table_info, error } = await supabase
    .from(table)
    .select('*')
    .limit(100)

  return table_info
}
