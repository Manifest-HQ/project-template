import { defineStore } from 'pinia'
import supabase from '../supabase'

export const useStoreDB = defineStore('DB', () => {
  const tables = ref({})

  async function handleInsert(tableName, record) {
    await supabase.from(tableName).insert(record)
  }

  async function handleUpdate(tableName, record) {
    await supabase.from(tableName).update(record).eq('id', record.id)
  }

  async function handleDelete(tableName, record) {
    await supabase.from(tableName).delete().eq('id', record.id)
  }

  async function loadTables() {
    const { data: public_tables, error } = await supabase
      .from('public_tables')
      .select('*')

    if (error) {
      console.error('Error fetching tables:', error)
    } else {
      for (let record of public_tables) {
        tables.value[record.table_name] = info
        loadTableInfo(record.table_name)
      }
    }
  }

  loadTables()

  supabase
    .channel('custom-all-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: '*' },
      (payload) => {
        try {
          const existingRecordIndex = tables.value[payload.table].findIndex(
            (record) => record.id === payload.new.id
          )

          switch (payload.eventType) {
            case 'INSERT':
              if (existingRecordIndex !== -1) {
                return
              }
              tables.value[payload.table].push(payload.new)
              break

            case 'UPDATE':
              tables.value[payload.table][existingRecordIndex] = payload.new
              break

            case 'DELETE':
              if (existingRecordIndex !== -1) {
                tables.value[payload.table].splice(existingRecordIndex, 1)
              }
              break
          }
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
    .limit(1000)

  return table_info
}
