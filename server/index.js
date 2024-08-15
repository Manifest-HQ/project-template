import express from 'express'
import cors from 'cors'
import { preLaunchProject } from './functions/pre-launch/index.js'
import listenChanges from './functions/listen-file-changes.js'
import startServer from './functions/install.js'
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
  await verifyFileCHanges()
  const preLaunchReponse = await preLaunchProject()
  res.send(preLaunchReponse)
})

app.post('/launch', async (req, res) => {
  const { releaseData, web } = req.body
  await verifyFileCHanges()
  await commitToGithub()
  //TODO vercel deploy with releaseData
  res.send('Hacer commit a GitHub')
})

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`)
})
