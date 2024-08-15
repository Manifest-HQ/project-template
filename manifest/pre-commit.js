import { supabaseManifestDB } from '../supabase.js'
import fs from 'fs'
import path from 'path'

const dirpath = './'
const packageJsonPath = path.join(dirpath, 'package.json')
const appPackageJsonPath = path.join(dirpath, 'app', 'package.json')

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
const appPackageJson = JSON.parse(fs.readFileSync(appPackageJsonPath, 'utf-8'))

const packageVersion = packageJson.version
const packageName = packageJson.name

console.log('version: ', packageVersion)
console.log('name: ', packageName)

async function updateVersion() {
  const versionSupabase = await getVersion()
  const versionPackageJson = packageVersion

  const higherVersion =
    compareVersions(versionSupabase, versionPackageJson) > 0
      ? versionSupabase
      : versionPackageJson
  const higherVersionParts = higherVersion.split('.').map(Number)
  higherVersionParts[higherVersionParts.length - 1] += 1
  const newVersion = higherVersionParts.join('.')

  appPackageJson.version = newVersion
  packageJson.version = newVersion

  fs.writeFileSync(appPackageJsonPath, JSON.stringify(appPackageJson, null, 2))
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

}

async function getVersion() {
  let { data: data, error } = await supabaseManifestDB
    .from('app_updates')
    .select('version,updated_at')
    .eq('project_id', packageName)
    .order('updated_at', { ascending: false })

  if (data && data.length > 0) {
    data.sort((a, b) => compareVersions(b.version, a.version))
    const latestVersion = data[0]
    return latestVersion.version
  } else {
    throw new Error('No version data found.')
  }
}

function compareVersions(v1, v2) {
  const v1Parts = v1.split('.').map(Number)
  const v2Parts = v2.split('.').map(Number)

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1Part = v1Parts[i] || 0
    const v2Part = v2Parts[i] || 0

    if (v1Part > v2Part) return 1
    if (v1Part < v2Part) return -1
  }

  return 0
}
updateVersion()
