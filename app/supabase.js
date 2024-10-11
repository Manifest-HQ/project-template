import { createClient } from '@supabase/supabase-js'

// SUPABASE instance of the project
const supabaseUrl = 'https://cgddvgeeeacyxhewhdyz.supabase.co'
// this is the PUBLIC KEY, so it is safe to have it hard coded here
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnZGR2Z2VlZWFjeXhoZXdoZHl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDcwNjQ2MywiZXhwIjoyMDQwMjgyNDYzfQ.HXlRZhxEo2xDcehAvazD0bSpFACiMHKIjx6U26tsdsU'

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
