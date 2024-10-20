import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import os from 'os'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces()
  for (const interfaceName of Object.keys(interfaces)) {
    for (const iface of interfaces[interfaceName]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address
      }
    }
  }
  return '127.0.0.1' // Fallback to localhost if no suitable IP is found
}

function updateCapacitorConfig(enableLiveReload) {
  const configPath = path.join(__dirname, 'capacitor.config.json')

  // Read the current config
  let config = JSON.parse(fs.readFileSync(configPath, 'utf8'))

  if (enableLiveReload) {
    const localIp = getLocalIpAddress()
    // Add the live reload URL with the dynamically determined IP
    config.server = {
      ...config.server,
      url: `http://${localIp}:9001`,
      cleartext: true
    }
  } else {
    // Remove the live reload URL and cleartext
    if (config.server) {
      delete config.server.url
      delete config.server.cleartext

      // If server object is empty, remove it
      if (Object.keys(config.server).length === 0) {
        delete config.server
      }
    }
  }

  // Write the updated config back to the file
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))

  console.log(
    `Capacitor config updated. Live reload ${
      enableLiveReload ? 'enabled' : 'disabled'
    }.`
  )
}

// Check if the script is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = process.argv[2]
  if (arg === 'enable' || arg === 'disable') {
    updateCapacitorConfig(arg === 'enable')
  } else {
    console.error('Usage: node switch-live-app-dev.js <enable|disable>')
    process.exit(1)
  }
}

export default updateCapacitorConfig
