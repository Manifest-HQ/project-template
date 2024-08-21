import fs from 'fs'
import { exec } from 'child_process'

const packageJsonPath = '../../app/package.json'
const dir = '../../app'
let packageJsonContent = ''
let serverProcess = null

function startServer() {
  serverProcess = exec(
    'npm run dev:server',
    { cwd: dir },
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting the server: ${error.message}`)
        return
      }
      if (stderr) {
        console.error(`Server error: ${stderr}`)
        return
      }
      console.log(`Server started: ${stdout}`)
    }
  )
}

export function stopServer(port = '3004') {
  exec(`fuser -k ${port}/tcp`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error stopping the server on port ${port}: ${error}`)
      return
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`)
      return
    }
    console.log(`Server stopped on port ${port}`)
  })
}

packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8')

fs.watchFile(packageJsonPath, (curr, prev) => {
  console.log('Change detected in package.json')

  const prevPackageJson = JSON.parse(packageJsonContent)
  const currPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

  const prevDependencies = prevPackageJson.dependencies || {}
  const currDependencies = currPackageJson.dependencies || {}
  const prevDevDependencies = prevPackageJson.devDependencies || {}
  const currDevDependencies = currPackageJson.devDependencies || {}

  const newDependencies = Object.keys(currDependencies).filter(
    (dep) => !(dep in prevDependencies)
  )
  const newDevDependencies = Object.keys(currDevDependencies).filter(
    (dep) => !(dep in prevDevDependencies)
  )

  if (newDependencies.length > 0 || newDevDependencies.length > 0) {
    console.log(
      'New dependencies detected:',
      newDependencies.concat(newDevDependencies)
    )
    stopServer()

    const dependenciesToInstall = newDependencies.map(
      (dep) => `${dep}@${currDependencies[dep]}`
    )
    const devDependenciesToInstall = newDevDependencies.map(
      (dep) => `${dep}@${currDevDependencies[dep]}`
    )

    const allDependenciesToInstall = dependenciesToInstall
      .concat(devDependenciesToInstall)
      .join(' ')
    console.log(`toinstall: ${allDependenciesToInstall}`)
    exec(
      `npm i ${allDependenciesToInstall}`,
      { cwd: dir },
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error installing new dependencies: ${error}`)
          return
        }
        console.log('start server')
        startServer()
      }
    )
  } else {
    console.log('No new dependencies. The server continues running.')
  }

  packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8')
})

console.log('Init server')

export default startServer
