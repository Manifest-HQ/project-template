// get version from package.json
import fs from 'fs'
import { exec } from 'child_process'
import archiver from 'archiver'
import supabase from '../supabase.js'
import path from 'path'
const startTime = Date.now()

const packageJSON = JSON.parse(fs.readFileSync('./package.json'))
const id = 'P-123'
// increase version number in package.json
packageJSON.version = packageJSON.version.toString()
fs.writeFileSync('./package.json', JSON.stringify(packageJSON, null, 2))

console.log('Version number increased to ' + packageJSON.version)
// run npm run generate
const execPromise = new Promise((resolve, reject) => {
  exec('npm run generate', (err, stdout, stderr) => {
    if (err) {
      console.error(err)
      reject(err)
    } else {
      console.log(stdout)
      resolve(stdout)
    }
  })
})

const timeoutPromise = new Promise((resolve) => {
  setTimeout(resolve, 5000, 'timeout')
})
const raceResult = await Promise.race([execPromise, timeoutPromise])
if (raceResult === 'timeout') {
  console.log('Timeout promise won the race condition')
} else {
  console.log('Exec promise won the race condition')
}
console.log('Generated')
await compress()
console.log('Compressed')
await uploadToSupabaseStorage()
console.log('Uploaded to Supabase Storage')
await updateSupabaseDB()
console.log('Updated Supabase DB')
console.log(`Time taken: ${Date.now() - startTime} ms`)
process.exit(0)

function compress() {
  return new Promise((resolve, reject) => {
    // compress .output/public folder
    const output = fs.createWriteStream(`./.output/${packageJSON.version}.zip`)
    const archive = archiver('zip', {
      zlib: { level: 9 }
    })
    archive.pipe(output)
    archive.directory('./.output/public/', false)
    archive.finalize()

    output.on('close', function() {
      console.log(`Size of file: ${parseInt(archive.pointer() / 1024)} kb`)
      console.log('archiver has been finalized and the output file descriptor has closed.')
      resolve()
    })

    output.on('error', function(err) {
      reject(err)
    })
  })
}

async function uploadToSupabaseStorage() {
  // upload the .zip to supabase storage
  try {
    const filePath = path.join(process.cwd(), `.output/${packageJSON.version}.zip`)
    const file = await fs.promises.readFile(filePath)

    const { data, error } = await supabase
      .storage
      .from(`app-updates/${id}/`)
      .upload(`${packageJSON.version}.zip`, file)

    if (error) {
      throw error
    }

    console.log('File uploaded')
  } catch (e) {
    console.error(`Failed to upload file: ${e.message}`)
  }
}

async function updateSupabaseDB() {
  await supabase
    .from('projects')
    .update({ ios_version_latest: packageJSON.version })
    .eq('id', id)
}
