import fs from 'fs'
import path from 'path'

const dirpath = './'
const vercelJsonPath = path.join(dirpath, 'vercel.json')

const vercelJson = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf-8'))

async function updateVercel() {
  if (!vercelJson.git) {
    vercelJson.git = {}
  }
  if (!vercelJson.git.deploymentEnabled) {
    vercelJson.git.deploymentEnabled = {}
  }
  if (vercelJson.git.deploymentEnabled.main) {
    return
  }

  vercelJson.git.deploymentEnabled.main = true

  fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelJson, null, 2))
}

updateVercel()
