import fs from 'fs'
import path from 'path'
import { supabaseManifestDB } from '../../supabase.js'

const dirpath = './'
const packageJsonPath = path.join(dirpath, 'package.json')
const capacitorJsonPath = path.join(dirpath + 'app/', 'capacitor.config.json')

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
const capacitorJson = JSON.parse(fs.readFileSync(capacitorJsonPath, 'utf-8'))

const packageVersion = packageJson.version
const packageName = packageJson.name
const capacitorAppId = capacitorJson.appId
console.log('version: ', packageVersion)
console.log('name: ', packageName)
console.log('appID: ', capacitorAppId)

const ip = await (async () => {
  let { data: projects, error } = await supabaseManifestDB
    .from('projects')
    .select('server_ip')
    .eq('id', packageName)
    .single()
  if (error) console.log(error)
  return projects.server_ip
})()

const url = `http://${ip}:9000/`

async function preReleaseTasks() {
  try {
    const preLaunch = () => {
      const branch = 'main'
      const response = fetch(url + 'pre-launch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ projectID: packageName, branch })
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`Error in POST pre-launch: ${response.message}`)
        }
        return response
      })
    }

    const supabaseRequest = async () => {
      const { data, error } = await supabaseManifestDB
        .from('app_updates')
        .upsert(
          {
            project_id: packageName,
            version: packageVersion,
            app_id: capacitorAppId,
            built: false,
            android: true,
            ios: true,
            web: true
          },
          { onConflict: ['project_id', 'version'] }
        )

      if (error) {
        console.log('err', error)
        throw new Error(`Error in Supabase upsert: ${error}`)
      }
      return data
    }
    const [postData, supabaseData] = await Promise.allSettled([
      preLaunch(),
      supabaseRequest()
    ])

    console.log('end pre release')
  } catch (error) {
    console.error('Error in preReleaseTasks:', error.message)
  }
}

preReleaseTasks()
