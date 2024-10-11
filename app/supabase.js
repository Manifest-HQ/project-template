import { createClient } from '@supabase/supabase-js'

// SUPABASE instance of the project
const supabaseUrl = '{{SUPABASE_URL}}'
// this is the PUBLIC KEY, so it is safe to have it hard coded here
const supabaseKey = '{{SUPABASE_KEY}}'

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
