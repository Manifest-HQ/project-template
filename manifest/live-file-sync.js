import fs from 'fs'
import { supabaseManifestDB } from '../supabase.js'

// on update from supabase
// fs.writeFileSync('app/' + filePath, `${data.value}`)

console.log('started')

supabaseManifestDB
  .channel('document_updates')
  .on('postgres_changes',{
    event: 'UPDATE',
    schema: 'public',
    table: 'files'
  }, handleDocumentUpdates)
  .subscribe()

async function handleDocumentUpdates(payload) {
  console.log('received update')
  const row = payload.new
  console.log(row)
  console.log(row.file_path)
  fs.writeFileSync(row.file_path, row.contents)
}