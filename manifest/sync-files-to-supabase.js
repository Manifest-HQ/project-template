import fs from 'fs'
import path from 'path'
import { supabaseManifestDB } from '../supabase.js'

const getFiles = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    try {
      const filePath = path.join(dir, file)
      if (fs.statSync(filePath).isDirectory()) {
        filelist = getFiles(filePath, filelist)
      } else {
        filelist.push(filePath)
      }
    } catch {
      // TODO
    }
  })
  return filelist
}

if (process.env.GITHUB_REPO_NAME === null || process.env.GITHUB_REPO_NAME === undefined) {
  console.log('Please set the GITHUB_REPO_NAME environment variable')
  process.exit(1)
}

const syncFileToSupabase = async (filePath) => {
  const contents = fs.readFileSync(filePath, 'utf8')
  const fileInfo = {
    github_repo_name: process.env.GITHUB_REPO_NAME.split('/')[1],
    file_path: filePath,
    contents,
    branch: 'main' // We might want to dynamically get this
  }

  console.log(`Syncing ${filePath} to Supabase...`)
  const { data, error } = await supabaseManifestDB
    .from('files')
    .upsert(
      fileInfo, {
        onConflict: 'github_repo_name, file_path, branch'
      })

  if (error) {
    console.log(filePath)
    console.log(error)
  }
}

const main = () => {
  // console.log('start')
  let gitignore = fs.readFileSync('.gitignore', 'utf8').split('\n')
  gitignore = gitignore.filter(ignore => ignore.trim() !== '') // filter out empty strings
  gitignore.push('.git/', '.lockb', 'app/.nuxt/', '.nuxt/', 'app/.output', '.output')
  gitignore.push('.jpg', '.jpeg', '.png', '.ico')
  const allFiles = getFiles('.').filter(file => {
    return !gitignore.some(ignore => file.includes(ignore))
  })
  // console.log(allFiles.length)
  allFiles.forEach(file => {
    // console.log(file)
    syncFileToSupabase(file)
  })
}

main()
