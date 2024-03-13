import { createClient } from '@supabase/supabase-js'

// SUPABASE instance of the project
const supabaseUrl = 'https://dxusbfemztqipqvlneat.supabase.co'
// this is the PUBLIC KEY, so it is safe to have it hard coded here
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4dXNiZmVtenRxaXBxdmxuZWF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU4NjUyMDgsImV4cCI6MjAxMTQ0MTIwOH0.xlpgbon7iolkJa6YB-E1hXHQFyDdN4FDVZBg6To0sos'

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
