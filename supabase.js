import { createClient } from '@supabase/supabase-js'

// SUPABASE instance of the project
const supabaseUrl = 'https://skbnbqtnvlcinawabvbl.supabase.co'
// Public Key, can be hard coded, safety depends on RLS 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrYm5icXRudmxjaW5hd2FidmJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwOTg5Nzk0MiwiZXhwIjoyMDI1NDczOTQyfQ.FmtttXFzGCy3iZdP4Dhg3qO8wlGMhU_uL_oKz5Mx_RU'

const supabase = createClient(supabaseUrl, supabaseKey)
const supabaseManifestSchema = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'manifest'
  }
})

export { supabase, supabaseManifestSchema }
