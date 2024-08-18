import express from 'express'
import cors from 'cors'
import { preLaunchProject } from './functions/pre-launch/index.js'
import listenChanges from './functions/listen-file-changes.js'
import startServer from './functions/install.js'
import verifyFileChanges from './functions/verify-file-changes.js'
import { commitToGithub } from './functions/launch/index.js'
const app = express()
const port = 3005
startServer()
listenChanges()

app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.send('working')
})

app.post('/pre-launch', async (req, res) => {
  await verifyFileChanges()
  const preLaunchReponse = await preLaunchProject()
  res.send(preLaunchReponse)
})

app.post('/launch', async (req, res) => {
  const { releaseData, web } = req.body
  await verifyFileChanges()
  await commitToGithub()
  if (web || releaseData.web) {
    //TODO vercel deploy with releaseData
    // await deployToVercel(releaseData)
    console.log('Deploying to Vercel')
  }
  res.send('Hacer commit a GitHub')
})

// Endpoint para "listen file changes"
app.post('/listen-file-changes', (req, res) => {
  // Lógica para escuchar cambios en archivos
  res.send('Escuchar cambios en archivos')
})

// Endpoint para "install"
app.post('/install', (req, res) => {
  // Lógica para instalar
  res.send('Instalar')
})

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`)
})
