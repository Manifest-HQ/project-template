import { createClient } from '@supabase/supabase-js'

// SUPABASE instance of the project
const supabaseUrl = 'https://qrofpkndepgbhcdgalpc.supabase.co'
// this is the PUBLIC KEY, so it is safe to have it hard coded here
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyb2Zwa25kZXBnYmhjZGdhbHBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI4NzExNzcsImV4cCI6MjAyODQ0NzE3N30.zXAHy9OttCEh4x4D1_OhWQfqP_TCqovvftkXLWz8qKA'

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
