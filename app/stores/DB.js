import { defineStore } from 'pinia'
import supabase from '../supabase'

export const useStoreDB = defineStore('DB', () => {
  const tables = ref({})
  const pendingInserts = ref(new Set()) // Add this line to track pending inserts

  async function insertRecord(tableName, record) {
    const { data, error } = await supabase
      .from(tableName)
      .insert(record)
      .select()
    if (error) {
      console.error('Error inserting record:', error)
      return
    }
    const newRecord = data[0]
    // Don't add the record here, let the subscription handle it
    pendingInserts.value.add(newRecord.id) // Track the new record's ID
    return newRecord // Return the new record for immediate use if needed
  }

  async function updateRecord(tableName, record) {
    await supabase.from(tableName).update(record).eq('id', record.id)
    const index = tables.value[tableName].findIndex((r) => r.id === record.id)
    tables.value[tableName][index] = record
  }

  async function deleteRecord(tableName, record) {
    await supabase.from(tableName).delete().eq('id', record.id)
    tables.value[tableName].splice(record.id, 1)
  }

  async function loadTables() {
    const { data: public_tables, error } = await supabase
      .from('public_tables')
      .select('*')

    if (error) {
      console.error('Error fetching tables:', error)
    } else {
      for (let record of public_tables) {
        const info = await loadTableInfo(record.table_name)
        tables.value[record.table_name] = info
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
          let existingRecordIndex

          switch (payload.eventType) {
            case 'UPDATE':
              existingRecordIndex = tables.value[payload.table].findIndex(
                (record) => record.id === payload.old.id
              )
              tables.value[payload.table][existingRecordIndex] = payload.new
              break

            case 'INSERT':
              existingRecordIndex = tables.value[payload.table].findIndex(
                (record) => record.id === payload.new.id
              )
              if (existingRecordIndex === -1) {
                tables.value[payload.table].push(payload.new)
              }
              // Always remove from pending inserts, whether it was added or not
              pendingInserts.value.delete(payload.new.id)
              break

            case 'DELETE':
              existingRecordIndex = tables.value[payload.table].findIndex(
                (record) => record.id === payload.old.id
              )
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

  return { tables, insertRecord, updateRecord, deleteRecord }
})

async function loadTableInfo(table) {
  const { data: table_info, error } = await supabase
    .from(table)
    .select('*')
    .limit(1000)
    .order('id', { ascending: true })

  return table_info
}
