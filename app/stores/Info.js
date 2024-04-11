import { defineStore } from 'pinia'
import supabase from '@/supabase'

export const useStoreInfo = defineStore('Info', async () => {
  const tables = ref([])

  const { data: tablesData, error } = await supabase
    .from('public_tables')
    .select('*')

  if (error) {
    console.error('Error fetching tables:', error)
  } else {
    tables.value = tablesData
  }

  supabase.channel('custom-all-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'mouse_pointers' },
      (payload) => {
        console.log(payload)
      }
    )
    .subscribe()

  return { tables }
})
