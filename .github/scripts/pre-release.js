import fs from 'fs'
import path from 'path'
import { supabaseManifestDB } from '../supabase.js'

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

const branchName = process.argv[2] || 'main'
// const url = `https://api.manifest-hq.com/`

async function preReleaseTasks() {
  try {
    const response = await fetch(url + 'pre-launch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        projectID: packageName,
        branch: branchName,
        version: packageVersion,
        appID: capacitorAppId
      })
    })
    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.error('Error in preReleaseTasks:', error.message)
  }
}

preReleaseTasks()
