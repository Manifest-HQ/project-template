// get version from package.json
import fs from 'fs'
import { exec } from 'child_process'
import archiver from 'archiver'
import { supabase, supabaseManifestDB } from '../../../supabase.js'
import path from 'path'
import { fileURLToPath } from 'url'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default async function preLaunchProject() {
  const startTime = Date.now()

  const packageJSONPath = path.resolve(__dirname, '../../../package.json')
  const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, 'utf-8'))
  const appPackageJSONPath = path.resolve(
    path.resolve(__dirname, '../../../app/package.json')
  )
  const appPackageJSON = JSON.parse(
    fs.readFileSync(appPackageJSONPath, 'utf-8')
  )

  const capacitorJSON = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, '../../../app/capacitor.config.json')
    )
  )

  const { data, error } = await supabaseManifestDB
    .from('app_updates')
    .select('*')
    .eq('project_id', packageJSON.name)
    .order('created_at', { ascending: false })
    .limit(1)

  let latestVersion = data?.[0]?.version || '1.0.0'

  // Compare versions and use the higher one
  const currentVersionSegments = packageJSON.version.split('.').map(Number)
  const latestVersionSegments = latestVersion.split('.').map(Number)

  console.log(currentVersionSegments, latestVersionSegments)

  let updated = false
  for (let i = 0; i < currentVersionSegments.length; i++) {
    if (currentVersionSegments[i] > latestVersionSegments[i]) {
      latestVersion = packageJSON.version // Current version is higher, use it
      updated = true
      break
    }
  }
  if (!updated) {
    const lastDigitVersion =
      latestVersionSegments[latestVersionSegments.length - 1] + 1
    latestVersion =
      latestVersionSegments.slice(0, -1).join('.') + '.' + lastDigitVersion
  }

  if (latestVersion !== packageJSON.version) {
    packageJSON.version = latestVersion
    appPackageJSON.version = latestVersion
    fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 2))
    fs.writeFileSync(
      appPackageJSONPath,
      JSON.stringify(appPackageJSON, null, 2)
    )
  }

  console.log('Version number increased to ' + packageJSON.version)
  const { data: upsertData, error: upsertError } = await supabaseManifestDB
    .from('app_updates')
    .upsert(
      [
        {
          project_id: packageJSON.name,
          app_id: capacitorJSON.appId,
          version: packageJSON.version,
          web: false,
          ios: false,
          android: false,
          zip_url: undefined,
          built: false
        }
      ],
      { onConflict: ['project_id', 'app_id', 'version'] }
    )

  if (upsertError) {
    console.error('Error inserting data:', upsertError.message)
    return { success: false, message: 'Error inserting data' }
  }

  // run bun run generate
  const execPromise = new Promise((resolve, reject) => {
    exec(
      `cd ${__dirname} && cd ../../../app && bun i && bun run generate`,
      (err, stdout, stderr) => {
        if (err) {
          console.error(err)
          reject(err)
        } else {
          console.log(stdout)
          resolve(stdout)
        }
      }
    )
  })

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(resolve, 10000, 'timeout')
  })
  const raceResult = await Promise.race([execPromise, timeoutPromise])
  if (raceResult === 'timeout') {
    console.log('Timeout promise won the race condition')
  } else {
    console.log('Exec promise won the race condition')
  }

  console.log('Generated')
  await compress(packageJSON.version)
  console.log('Compressed')

  try {
    await createBucket()
    console.log('Created bucket')
  } catch (error) {
    console.error('Failed to create bucket:', error.message)
    return { success: false, message: 'Failed to create bucket' }
  }

  await uploadToSupabaseStorage(packageJSON.version)
  await updateSupabaseDB(
    packageJSON.version,
    packageJSON.name,
    capacitorJSON.appId
  )

  console.log(`Time taken: ${Date.now() - startTime} ms`)
  return { success: true, message: 'Successfully pre launched' }
}

function compress(packageJSONVersion) {
  return new Promise((resolve, reject) => {
    // compress .output/public folder
    const outputPath = path.join(
      path.resolve(__dirname, '../../../app/.output'),
      `${packageJSONVersion}.zip`
    )
    console.log(outputPath)
    const output = fs.createWriteStream(outputPath)
    const archive = archiver('zip', {
      zlib: { level: 9 }
    })
    console.log(output)
    archive.pipe(output)
    archive.directory(
      path.join(path.resolve(__dirname, '../../../app/.output/public/')),
      false
    )
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

async function uploadToSupabaseStorage(packageJSONVersion) {
  // upload the .zip to supabase storage
  try {
    const filePath = path.join(
      path.resolve(__dirname, '../../../app/.output'),
      `${packageJSONVersion}.zip`
    )
    const file = await fs.promises.readFile(filePath)

    const { data, error } = await supabase.storage
      .from('app_updates/')
      .upload(`${packageJSONVersion}.zip`, file)

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

async function updateSupabaseDB(latestVersion, project_id, app_id) {
  console.log('Updating Supabase DB with version', latestVersion)

  const { data: projectData, error: projectError } = await supabaseManifestDB
    .from('projects')
    .select('*')
    .eq('id', project_id)
  if (projectError) {
    console.error('Error getting project:', projectError.message)
    throw new Error(projectError.message)
  }
  console.log('projectData', projectData[0].supabase_url)
  const { data, error } = await supabaseManifestDB
    .from('app_updates')
    .update({
      zip_url: `${projectData[0].supabase_url}/storage/v1/object/public/app_updates/${latestVersion}.zip`,
      built: true
    })
    .eq('project_id', project_id)
    .eq('app_id', app_id)
    .eq('version', latestVersion)

  console.log('data', data)
  if (error) {
    console.log(error.message)
  } else {
    console.log('Updated Supabase DB')
  }
}
