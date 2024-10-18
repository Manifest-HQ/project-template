import { defineStore } from 'pinia'
import supabase from '../supabase'
import { Network } from '@capacitor/network'
import { Preferences } from '@capacitor/preferences'

function areTablesEqual(table1, table2) {
  const sortedTable1 = JSON.stringify(sortObjectKeys(table1))
  const sortedTable2 = JSON.stringify(sortObjectKeys(table2))
  return sortedTable1 === sortedTable2
}

function sortObjectKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys)
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .reduce((result, key) => {
        result[key] = sortObjectKeys(obj[key])
        return result
      }, {})
  }
  return obj
}

export const useStoreDB = defineStore('DB', () => {
  const tables = ref({})
  const oldTables = ref({})
  const network = ref(true)
  const syncingTables = ref(false)

  const pendingChanges = ref([])

  watch(
    tables,
    async (newTables) => {
      if (syncingTables.value) {
        return
      }
      if (areTablesEqual(newTables, oldTables.value)) {
        return
      }

      syncingTables.value = true
      const clonedOldTables = JSON.parse(JSON.stringify(oldTables.value))
      for (const tableName in newTables) {
        const newRecords = newTables[tableName]
        const oldRecords = clonedOldTables[tableName] || []

        const oldRecordsMap = new Map(
          oldRecords.map((record) => [record.id, record])
        )
        console.log(oldRecordsMap)
        // Detect changes
        for (const newRecord of newRecords) {
          const oldRecord = oldRecordsMap.get(newRecord.id)
          if (!oldRecord) {
            await handleInsert(tableName, newRecord)
          } else if (JSON.stringify(newRecord) !== JSON.stringify(oldRecord)) {
            await handleUpdate(tableName, newRecord)
          }
          oldRecordsMap.delete(newRecord.id)
        }
        console.log(oldRecordsMap)
        await Promise.all(
          [...oldRecordsMap.values()].map((oldRecord) =>
            handleDelete(tableName, oldRecord)
          )
        )
      }

      oldTables.value = JSON.parse(JSON.stringify(newTables))
      syncingTables.value = false
    },
    { deep: true }
  )

  async function handleInsert(tableName, record) {
    if (network.value) {
      await supabase.from(tableName).insert(record)
    } else {
      pendingChanges.value.push({ type: 'INSERT', tableName, record })
      saveTableToPreferences(tableName, tables.value[tableName])
    }
  }

  async function handleUpdate(tableName, record) {
    if (network.value) {
      await supabase.from(tableName).update(record).eq('id', record.id)
    } else {
      pendingChanges.value.push({ type: 'UPDATE', tableName, record })
      saveTableToPreferences(tableName, tables.value[tableName])
    }
  }

  async function handleDelete(tableName, record) {
    if (network.value) {
      await supabase.from(tableName).delete().eq('id', record.id)
    } else {
      pendingChanges.value.push({ type: 'DELETE', tableName, record })
      saveTableToPreferences(tableName, tables.value[tableName])
    }
  }

  async function syncPendingChanges() {
    syncingTables.value = true
    for (const change of pendingChanges.value) {
      switch (change.type) {
        case 'INSERT':
          await supabase.from(change.tableName).insert(change.record)
          break
        case 'UPDATE':
          await supabase
            .from(change.tableName)
            .update(change.record)
            .eq('id', change.record.id)
          break
        case 'DELETE':
          await supabase
            .from(change.tableName)
            .delete()
            .eq('id', change.record.id)
          break
      }
    }
    syncingTables.value = false
    pendingChanges.value = []
  }

  Network.addListener('networkStatusChange', (status) => {
    network.value = status.connected
    if (!network.value) {
      alert(
        'You have no internet connection. If you continue, the data will not be saved.'
      )
      loadTablesFromPreferences()
    } else {
      syncPendingChanges()
        .then(() => {
          loadTables()
        })
        .catch((error) => {
          console.error('Error syncing pending changes:', error)
        })
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
    try {
      syncingTables.value = true

      const { data: public_tables, error } = await supabase
        .from('public_tables')
        .select('*')

      if (error) {
        console.error('Error fetching tables:', error)
      } else {
        for (let record of public_tables) {
          const info = await loadTableInfo(record.table_name)
          tables.value[record.table_name] = info
          await saveTableToPreferences(record.table_name, info)
        }
        oldTables.value = JSON.parse(JSON.stringify(tables.value))

        // console.log(tables)
      }
    } finally {
      syncingTables.value = false
    }
  }

  loadTables()

  supabase
    .channel('custom-all-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: '*' },
      (payload) => {
        if (syncingTables.value) {
          return
        }

        try {
          switch (payload.eventType) {
            case 'INSERT':
              const existingRecordIndex = tables.value[payload.table].findIndex(
                (record) => record.id === payload.new.id
              )
              if (existingRecordIndex === -1) {
                tables.value[payload.table].push(payload.new)
              }
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
