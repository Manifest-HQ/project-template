import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { supabaseManifestDB } from '../supabase.js'

const dirpath = './'
const packageJsonPath = path.join(dirpath, 'package.json')
const capacitorJsonPath = path.join(dirpath+'app/', 'capacitor.config.json')


const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
const capacitorJson = JSON.parse(fs.readFileSync(capacitorJsonPath, 'utf-8'))

const packageVersion = packageJson.version
const packageName = packageJson.name
const capacitorAppId = capacitorJson.appId
console.log('version: ', packageVersion)
console.log('name: ', packageName)
console.log('appID: ', capacitorAppId)

const url = 'http://localhost:3005/'

async function preReleaseTasks() {
  try {
    // Enviar petición POST a localhost:3004/pre-launch
    const preLaunch = () => {
      const response = fetch(url+'pre-launch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`Error in POST pre-launch: ${response.message}`)
        }
        return response
      })
    }

    const deployVercel = () => {
        const response = fetch(url+'deploy-vercel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then((response) => {
          if (!response.ok) {
            throw new Error(`Error in POST pre-launch: ${response.message}`)
          }
          return response
        })
      }
    // Crear o actualizar una fila en Supabase
    const supabaseRequest = async () => {
        const { data, error } = await supabaseManifestDB
          .from('app_updates')
          .upsert({
            project_id: packageName,
            version: packageVersion,
            app_id: capacitorAppId,
            built: false,
            android: true,
            ios: true,
            web: true
          },
          { onConflict: ['project_id', 'version'] }
        );

        if (error) {
            console.log('err',error)
          throw new Error(`Error in Supabase upsert: ${error}`);
        }
        return data
      
    }
    // Ejecutar ambas tareas en paralelo
    const [postData, supabaseData] = await Promise.allSettled([preLaunch(), supabaseRequest(), deployVercel()]);

    console.log('end pre release')
  } catch (error) {
    console.error('Error in preReleaseTasks:', error.message)
  }
}

preReleaseTasks()
