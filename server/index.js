import express from 'express'
import { preLaunchProject } from './functions/pre-launch/index.js'
import { commitToGithub } from './functions/launch/index.js'
const app = express()
const port = 3005

app.use(express.json())

app.get('/', async (req, res) => {
  res.send('working')
})

app.post('/pre-launch', async (req, res) => {
  //   await verifyFileCHanges()
  const preLaunchReponse = await preLaunchProject()
  res.send(preLaunchReponse)
})

app.post('/launch', async (req, res) => {
  const { releaseData, web } = req.body
  // await verifyFileCHanges()
  await commitToGithub()
  //TODO vercel deploy with releaseData
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
