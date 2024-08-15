import fs from 'fs'
import path from 'path';
import { supabaseManifestDB } from '../../supabase.js'

// on update from supabase
// fs.writeFileSync('app/' + filePath, `${data.value}`)

const dirpath = '../'
const packageJsonPath = path.join(dirpath, 'package.json');
let packageName = '';

const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
const packageJson = JSON.parse(packageJsonContent);
packageName = packageJson.name;
console.log(`Init listen files in: '${packageName}'`);


supabaseManifestDB
  .channel('document_updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'files',
    filter: `github_repo_name=eq.${packageName}`
  }, handleDocumentUpdates)
  .subscribe()

async function handleDocumentUpdates(payload) {
  try {
    console.log('received update')
    const row = payload.new
    if (row.branch !== 'main') return;
    console.log(row)
    console.log(row.file_path)
    fs.writeFileSync(`${dirpath}${row.file_path}`, row.content)
    console.log(`File ${row.file_path} updated successfully`)
  } catch (error) {
    console.error('Error updating file:', error)
  }
}

export default handleDocumentUpdates;
