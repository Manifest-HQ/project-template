import { createClient } from '@supabase/supabase-js'

// SUPABASE instance of the project
const supabaseUrl = 'https://skbnbqtnvlcinawabvbl.supabase.co'
// Service Role Key, should be in env variables TODO
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrYm5icXRudmxjaW5hd2FidmJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwOTg5Nzk0MiwiZXhwIjoyMDI1NDczOTQyfQ.FmtttXFzGCy3iZdP4Dhg3qO8wlGMhU_uL_oKz5Mx_RU'

const supabase = createClient(supabaseUrl, supabaseKey)
const supabaseManifestSchema = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'manifest'
  }
})

const supabaseManifestDB = createClient(
  // Manifest HQ Main Supabase URL
  'https://dxusbfemztqipqvlneat.supabase.co',
  // Manifest HQ Main Supabase PUBLIC Key
  // TODO change this to point to a backend using a key designed for the project and that backend will
  // authenticate the request and make the updates to supabase 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4dXNiZmVtenRxaXBxdmxuZWF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU4NjUyMDgsImV4cCI6MjAxMTQ0MTIwOH0.xlpgbon7iolkJa6YB-E1hXHQFyDdN4FDVZBg6To0sos'
)

export { supabase, supabaseManifestSchema, supabaseManifestDB }
