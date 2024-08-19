// get version from package.json
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default async function commitToGithub(deployToVercel = false) {
  const packageJSONPath = path.resolve(__dirname, '../../../../package.json')
  const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, 'utf-8'))
  const repo = packageJSON.name
  const branch = 'main'

  try {
    const response = await fetch(
      'https://api.manifest-hq.com/push-changes-to-github',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          repo,
          branch,
          deployWeb: deployToVercel
        })
      }
    )

    const data = await response.json()

    if (data.success) {
      console.log('Changes pushed to GitHub successfully')
    } else {
      console.error('Failed to push changes to GitHub:', data.message)
    }
  } catch (error) {
    console.error('Error pushing changes to GitHub:', error)
  }
}
