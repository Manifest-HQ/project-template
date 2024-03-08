import fs from 'fs'
import path from 'path'
import supabase from '@/supabase.js'

const getFiles = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      filelist = getFiles(filePath, filelist)
    } else {
      filelist.push(filePath)
    }
  })
  return filelist
}

const syncFileToSupabase = async (filePath) => {
  const contents = fs.readFileSync(filePath, 'utf8')
  const file_info = {
    // updated_at: new Date().toISOString(),
    project: 'P-123',
    file_path: filePath,
    contents,
    branch: 'main' // You might want to dynamically get this
  }

  console.log(`Syncing ${filePath} to Supabase...`)
  const { data, error } = await supabase
    .from('files')
    .upsert(
      file_info, {
        onConflict: 'project, file_path, branch'
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
  gitignore.push('.git/', '.lockb')
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
