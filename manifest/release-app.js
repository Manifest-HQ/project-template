// get version from package.json
import fs from 'fs'
import { exec } from 'child_process'
import archiver from 'archiver'
import { supabase, supabaseManifestDB } from '../supabase.js'
import path from 'path'
const startTime = Date.now()

const packageJSON = JSON.parse(fs.readFileSync('./package.json'))
const capacitorJSON = JSON.parse(fs.readFileSync('./app/capacitor.config.json'))

const releaseDataPath = './manifest/releaseData.json'
let releaseData = {
  ios: true,
  android: true,
  web: true
}
if (fs.existsSync(releaseDataPath)) {
  try {
    const releaseDataContent = fs.readFileSync(releaseDataPath, 'utf-8')
    releaseData = JSON.parse(releaseDataContent)
  } catch (error) {
    console.error('Error reading releaseData.json:', error.message)
  }
}

console.log('releaseData', releaseData)

const { data, error } = await supabaseManifestDB
  .from('app_updates')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(1)

let latest_version = data?.[0]?.version || '1.0.0'

// Compare versions and use the higher one
const currentVersionSegments = packageJSON.version.split('.').map(Number)
const latestVersionSegments = latest_version.split('.').map(Number)

console.log(currentVersionSegments, latestVersionSegments)

let updated = false
for (let i = 0; i < currentVersionSegments.length; i++) {
  if (currentVersionSegments[i] > latestVersionSegments[i]) {
    latest_version = packageJSON.version // Current version is higher, use it
    updated = true
    break
  }
}
if (!updated) {
  const lastDigitVersion =
    latestVersionSegments[latestVersionSegments.length - 1] + 1
  latest_version =
    latestVersionSegments.slice(0, -1).join('.') + '.' + lastDigitVersion
}

if (latest_version !== packageJSON.version) {
  packageJSON.version = latest_version
  fs.writeFileSync('./package.json', JSON.stringify(packageJSON, null, 2))
}

console.log('Version number increased to ' + packageJSON.version)
// run bun run generate
const execPromise = new Promise((resolve, reject) => {
  exec('cd app && bun i && bun run generate', (err, stdout, stderr) => {
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
  setTimeout(resolve, 20000, 'timeout')
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

try {
  await createBucket()
  console.log('Created bucket')
} catch (error) {
  console.error('Failed to create bucket:', error.message)
  process.exit(1)
}

await uploadToSupabaseStorage()
await updateSupabaseDB()

console.log(`Time taken: ${Date.now() - startTime} ms`)
process.exit(0)

function compress() {
  return new Promise((resolve, reject) => {
    // compress .output/public folder
    const outputPath = path.join('app/.output', `${packageJSON.version}.zip`)
    const output = fs.createWriteStream(outputPath)
    const archive = archiver('zip', {
      zlib: { level: 9 }
    })
    console.log(output)
    archive.pipe(output)
    archive.directory(path.join('app/.output/public/'), false)
    archive.finalize()

    output.on('close', function () {
      console.log(`Size of file: ${parseInt(archive.pointer() / 1024)} kb`)
      console.log(
        'archiver has been finalized and the output file descriptor has closed.'
      )
      resolve()
    })

    output.on('error', function (err) {
      reject(err)
    })
  })
}

async function uploadToSupabaseStorage() {
  // upload the .zip to supabase storage
  try {
    const filePath = path.join(
      process.cwd(),
      `./app/.output/${packageJSON.version}.zip`
    )
    const file = await fs.promises.readFile(filePath)

    const { data, error } = await supabase.storage
      .from('app_updates/')
      .upload(`${packageJSON.version}.zip`, file)

    if (error) {
      throw error
    }

    console.log('Uploaded to Supabase Storage')
  } catch (e) {
    console.error(`Failed to upload file: ${e.message}`)
  }
}

async function createBucket() {
  const { data, error } = await supabase.storage.createBucket('app_updates', {
    public: true
  })

  if (error) {
    console.error('Error creating bucket:', error.message)
    if (error.message.includes('already exists')) {
      console.log('Bucket already exists, does not need to be created')
    } else {
      throw new Error(error.message)
    }
  } else {
    console.log('create bucket result:', data)
  }
}

async function updateSupabaseDB() {
  console.log('Updating Supabase DB', packageJSON.version, true, true)
  console.log('packageJSON.name', latest_version)

  const { data: projectData, error: projectError } = await supabaseManifestDB
    .from('projects')
    .select('*')
    .eq('id', packageJSON.name)
  if (projectError) {
    console.error('Error getting project:', projectError.message)
    throw new Error(projectError.message)
  }
  console.log('projectData', projectData[0].supabase_url)
  const { data, error } = await supabaseManifestDB.from('app_updates').insert([
    {
      project_id: packageJSON.name,
      app_id: capacitorJSON.appId,
      version: latest_version,
      web: releaseData.web,
      ios: releaseData.ios,
      android: releaseData.android,
      zip_url: `${projectData[0].supabase_url}/storage/v1/object/public/app_updates/${latest_version}.zip`
    }
  ])

  console.log('data', data)
  if (error) {
    console.log(error.message)
  } else {
    console.log('Updated Supabase DB')
  }
}
