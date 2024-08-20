import express from 'express'
import cors from 'cors'
import { preLaunchProject } from './functions/pre-launch/index.js'
import listenChanges from './functions/listen-file-changes.js'
import startServer from './functions/install.js'
import verifyFileChanges from './functions/verify-file-changes.js'
import { commitToGithub } from './functions/launch/index.js'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
const port = process.env.PORT || 3005
startServer()
listenChanges()

app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Página Interna</title>
      <style>
        body, html {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
      </style>
    </head>
    <body>
      <iframe src="http://localhost:3004"></iframe>
    </body>
    </html>
  `)
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
