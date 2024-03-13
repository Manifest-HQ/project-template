import { createClient } from '@supabase/supabase-js'

// SUPABASE instance of the project
const supabaseUrl = 'https://dxusbfemztqipqvlneat.supabase.co'
// using service role, this should be saved in github secrets
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrYm5icXRudmxjaW5hd2FidmJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4OTc5NDIsImV4cCI6MjAyNTQ3Mzk0Mn0.Ra7uR2C7G6A3YVtQvWjN21PisQmEazy0VnobDmBtuiU' // process.env.SUPABASE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
