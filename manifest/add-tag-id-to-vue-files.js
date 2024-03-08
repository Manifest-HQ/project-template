import fs from 'fs'
import path from 'path'
import cheerio from 'cheerio'

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

const main = () => {
  let gitignore = fs.readFileSync('.gitignore', 'utf8').split('\n')
  gitignore = gitignore.filter(ignore => ignore.trim() !== '') // filter out empty strings

  const allVueFiles = getFiles('.').filter(file => {
    return !gitignore.some(ignore => file.includes(ignore)) && file.endsWith('.vue')
  })

  allVueFiles.forEach(file => {
    console.log(file)
    addMissingTagsToVueFile(file)
  })
}

function addMissingTagsToVueFile(file) {
  const fileContent = fs.readFileSync(file, 'utf8')

  // Extracting the <template> content
  const templateMatch = fileContent.match(/<template[^>]*>([\s\S]*?)<\/template>/)
  if (!templateMatch) return // If there's no <template> tag, exit the function

  const templateContent = templateMatch[1]
  const $ = cheerio.load(templateContent, { xmlMode: true })

  $('*').each(function addTagId() {
    if (!$(this).attr('tag-id')) {
      $(this).attr('tag-id', `tag-${generateRandomString(8)}`)
    }
    // No need to manually traverse children, '*' selector gets all descendants
  })

  // Reconstructing the <template> content with modifications
  const modifiedTemplateContent = `<template>${$.html()}</template>`

  // Replacing the old <template> content with the modified one in the file content
  const modifiedFileContent = fileContent.replace(/<template[^>]*>([\s\S]*?)<\/template>/, modifiedTemplateContent)

  fs.writeFileSync(file, modifiedFileContent)
}

function generateRandomString(len) {
  const characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz123456789'
  let result = ''
  for (let i = 0; i < len; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

main()
