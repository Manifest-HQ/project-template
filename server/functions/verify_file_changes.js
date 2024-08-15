import fs from 'fs'
import path from 'path'
import { supabaseManifestDB } from '../../supabase.js'

const dirpath = '../'

const packageJsonPath = path.join(dirpath, 'package.json')
let packageName = ''

const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8')
const packageJson = JSON.parse(packageJsonContent)
packageName = packageJson.name
console.log(`Package name: ${packageName}`)

async function getFilesFromSupabase() {
  const { data, error } = await supabaseManifestDB
    .from('files')
    .select('file_path, content')
    .eq('branch', 'main')
    .eq('github_repo_name', packageName)

  if (error) {
    console.error('Error fetching files from Supabase:', error)
    return []
  }

  return data
}

// Función para leer el contenido de un archivo local
function readLocalFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8')
  } catch (error) {
    console.error(`Error reading local file ${filePath}:`, error)
    return null
  }
}

// Función para comparar los archivos
async function verifyFileChanges() {
  const supabaseFiles = await getFilesFromSupabase()
  let allFilesMatch = true

  supabaseFiles.forEach((file) => {
    const localFilePath = path.join(dirpath, file.file_path)
    const localContent = readLocalFile(localFilePath)

    if (localContent === null) {
      console.log(`Local file not found: ${localFilePath}`)
      allFilesMatch = false
    } else if (localContent !== file.content) {
      console.log(`File content mismatch: ${localFilePath}`)
      allFilesMatch = false
    }
  })

  if (allFilesMatch) {
    console.log('All files are synchronized.')
    return true
  } else {
    console.log('Some files are not synchronized.')
    return false
  }
}
verifyFileChanges()
export default verifyFileChanges
