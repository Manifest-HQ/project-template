import { defineStore } from 'pinia'
import supabase from '../supabase'

export const useStoreInfo = defineStore('Info', async () => {
  const tables = ref([])

  const { data, error } = await supabase
    .from('users')
    .select('*')

  if (error) {
    console.error('Error fetching tables:', error)
  } else {
    tables.value = data
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
