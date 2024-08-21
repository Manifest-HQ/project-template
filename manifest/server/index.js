import express from 'express'
import cors from 'cors'
import { preLaunchProject } from './functions/pre-launch/index.js'
import listenChanges from './functions/listen-file-changes.js'
// import startServer from './functions/install.js'
import verifyFileChanges from './functions/verify-file-changes.js'
import { commitToGithub } from './functions/launch/index.js'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
const port = 3000

//startServer()
listenChanges()

app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.send(`working`)
})

app.post('/pre-launch', async (req, res) => {
  await verifyFileChanges()
  const preLaunchReponse = await preLaunchProject()
  res.send(preLaunchReponse)
})

app.post('/launch', async (req, res) => {
  const { releaseData } = req.body
  try {
    await verifyFileChanges()
  } catch (error) {
    console.error('Error verifying file changes:', error)
    return res.send({
      success: false,
      message: 'Failed to verify file changes'
    })
  }

  try {
    await commitToGithub(releaseData.web)
  } catch (error) {
    console.error('Error pushing changes to GitHub:', error)
    return res.send({
      success: false,
      message: 'Failed to push changes to GitHub'
    })
  }

  res.send({ success: true, message: 'Project launched successfully' })
})

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`)
})
