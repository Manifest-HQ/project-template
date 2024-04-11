import { defineStore } from 'pinia'
import supabase from '../supabase'

export const useStoreInfo = defineStore('Info', () => {
  const tables = ref({})

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
      }

      console.log(tables)
    }
  }

  loadTables()

  supabase.channel('custom-all-channel')
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
              const updatedRecordIndex = tableRecords.findIndex(record => record.id === payload.new.id)
              if (updatedRecordIndex !== -1) {
                tables.value[payload.table][updatedRecordIndex] = payload.new;
              }
              break
            
            case 'DELETE':
              const deleteRecordIndex = tables.value[payload.table].findIndex(record => record.id === payload.old.id);
              if (deleteRecordIndex !== -1) {
                tables.value[payload.table].splice(deleteRecordIndex, 1);
              }
              break
          }
        } catch (error) {
          console.error('Error processing change:', error)
        }
    })
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
