import { defineStore } from 'pinia'
// import supabase from '@/supabase'

export const useStoreInfo = defineStore('Info', () => {
  const tables = ref(['a', 'b', 'c'])

  return { tables }
})
