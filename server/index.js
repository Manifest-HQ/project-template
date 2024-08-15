import express from 'express'
import { preLaunchProject } from './functions/pre-launch/index.js'
import handleDocumentUpdates from './functions/listen-file-changes.js';
import stopServer from './functions/install.js'
const app = express();
const port = 3005;

app.use(express.json())

app.get('/', async (req, res) => {
  res.send('working')
})
// Endpoint para "Verify file changes"
app.post('/pre-launch', async (req, res) => {
  //   await verifyFileCHanges()
  const preLaunchReponse = await preLaunchProject()
  res.send(preLaunchReponse)
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

// Endpoint para "commit to github"
app.post('/launch', async (req, res) => {
  const { web } = req.body
  await verifyFileCHanges()

  await Promise.all([createCommitToGithub('my commit'), DeployToVercel(web)])
  res.send('Hacer commit a GitHub')
})

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`)
})
