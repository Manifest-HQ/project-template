import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = '{{SUPABASE_URL}}'
// const supabaseKey = '{{SUPABASE_KEY}}'

// SUPABASE instance of the project
const supabaseUrl = 'https://qvpgximhadpefbykykgl.supabase.co'
// PUBLIC KEY, it is safe to have it hard coded here, it is not secret
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2cGd4aW1oYWRwZWZieWt5a2dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczODE4NjcsImV4cCI6MjA0Mjk1Nzg2N30.B9xjjY1vZWxhxkLOd3xQflL2vrRuNihLTQ20xplV4_I'

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
