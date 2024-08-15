// get version from package.json
import fs from 'fs'
import path from 'path'
import ignore from 'ignore'
import { fileURLToPath } from 'url'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const appPath = path.resolve(__dirname, '../../../app/')

export default async function commitToGithub() {
  const username = 'Manifest-HQ'

  const packageJSONPath = path.resolve(__dirname, '../../../package.json')
  const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, 'utf-8'))

  const repo = packageJSON.name // 'manifest-project-NUQ42K' // TODO, this should be dynamic
  const branch = 'main'

  //TODO: this should be a secret
  const token = {{GITHUB_TOKEN}}

  const latestCommitSha = await getLatestCommitSha(
    username,
    repo,
    branch,
    token
  )

  const baseTreeSha = await getBaseTreeSha(
    username,
    repo,
    latestCommitSha,
    token
  )

  const appGitIgnorePath = path.resolve(appPath, '.gitignore')
  const gitIgnore = fs.existsSync(appGitIgnorePath)
    ? fs.readFileSync(appGitIgnorePath, 'utf-8').split('\n').filter(Boolean)
    : []

  const appAndroidGitIgnorePath = path.resolve(appPath, 'android/.gitignore')
  const androidGitIgnore = fs.existsSync(appAndroidGitIgnorePath)
    ? fs
        .readFileSync(appAndroidGitIgnorePath, 'utf-8')
        .split('\n')
        .filter(Boolean)
    : []

  const prefixedAndroidGitIgnore = androidGitIgnore.map((line) => {
    if (line.startsWith('/')) {
      line = line.substring(1)
    }
    return line
  })
  gitIgnore.push(...prefixedAndroidGitIgnore)

  const appAndroidAppGitIgnorePath = path.resolve(
    appPath,
    'android/app/.gitignore'
  )
  const androidAppGitIgnore = fs.existsSync(appAndroidAppGitIgnorePath)
    ? fs
        .readFileSync(appAndroidAppGitIgnorePath, 'utf-8')
        .split('\n')
        .filter(Boolean)
    : []

  const prefixedAndroidAppGitIgnore = androidAppGitIgnore.map((line) => {
    if (line.startsWith('/')) {
      line = line.substring(1)
    }
    return line
  })
  gitIgnore.push(...prefixedAndroidAppGitIgnore)

  const appIosGitIgnorePath = path.resolve(appPath, 'ios/.gitignore')
  const iosGitIgnore = fs.existsSync(appIosGitIgnorePath)
    ? fs.readFileSync(appIosGitIgnorePath, 'utf-8').split('\n').filter(Boolean)
    : []

  const prefixedIosGitIgnore = iosGitIgnore.map((line) => {
    if (line.startsWith('/')) {
      line = line.substring(1)
    }
    return line
  })
  gitIgnore.push(...prefixedIosGitIgnore)

  console.log(gitIgnore)

  // TODO: working but pngs or assets are incorrect
  // const files = getAllFiles(appPath, [], gitIgnore).map((file) => ({
  //   path: `app/${path.relative(appPath, file)}`,
  //   content: fs.readFileSync(file, 'utf-8')
  // }))

  const files = [{ path: 'app/test.txt', content: 'text' }]

  // Create a new tree with the files
  const newTreeSha = await createNewTree(
    username,
    repo,
    files,
    baseTreeSha,
    token
  )

  // TODO: the ignore actions cant ignore the supabase sync because that action will add the tags
  const commitMessage =
    'Automated commit of all files in the app directory IGNORE_ACTIONS'
  const newCommitSha = await createCommit(
    username,
    repo,
    commitMessage,
    newTreeSha,
    latestCommitSha,
    token
  )

  // Update the branch to point to the new commit
  await updateBranch(username, repo, branch, newCommitSha, token)
}

function getAllFiles(dirPath, arrayOfFiles = [], gitIgnore = []) {
  const ig = ignore().add(gitIgnore)
  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    const filePath = path.join(dirPath, file)
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles, gitIgnore)
    } else {
      if (!ig.ignores(path.relative(appPath, filePath))) {
        arrayOfFiles.push(filePath)
      }
    }
  })

  return arrayOfFiles
}

async function getLatestCommitSha(username, repo, branch, token) {
  const response = await fetch(
    `https://api.github.com/repos/${username}/${repo}/commits/${branch}`,
    {
      headers: {
        Authorization: `token ${token}`
      }
    }
  )
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to get the latest commit SHA')
  }

  return data.sha
}

async function getBaseTreeSha(username, repo, commitSha, token) {
  const response = await fetch(
    `https://api.github.com/repos/${username}/${repo}/commits/${commitSha}`,
    {
      headers: {
        Authorization: `token ${token}`
      }
    }
  )
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to get the commit details')
  }

  // console.log('getBaseTreeSha', data)
  return data.sha
}

async function createNewTree(
  username,
  repo,
  filesToUpdate,
  baseTreeSha,
  token
) {
  // Create a blob for each file and store the SHA values
  const blobs = await Promise.all(
    filesToUpdate.map(async (file) => {
      const blob = await createBlob(username, repo, file.content, token)
      return {
        path: file.path,
        mode: '100644', // mode for a file (blob)
        type: 'blob',
        sha: blob.sha
      }
    })
  )

  // Create a new tree with the blobs and the existing files
  const newTree = await createTree(username, repo, blobs, baseTreeSha, token)

  return newTree.sha
}

async function createBlob(username, repo, content, token) {
  const response = await fetch(
    `https://api.github.com/repos/${username}/${repo}/git/blobs`,
    {
      method: 'POST',
      headers: {
        Authorization: `token ${token}`
      },
      body: JSON.stringify({
        content,
        encoding: 'utf-8'
      })
    }
  )
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create a blob')
  }

  return data
}

async function createTree(username, repo, blobs, baseTreeSha, token) {
  const tree = {
    base_tree: baseTreeSha,
    tree: blobs
  }

  const response = await fetch(
    `https://api.github.com/repos/${username}/${repo}/git/trees`,
    {
      method: 'POST',
      headers: {
        Authorization: `token ${token}`
      },
      body: JSON.stringify(tree)
    }
  )
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create a tree')
  }

  return data
}

async function createCommit(
  username,
  repo,
  message,
  treeSha,
  parentCommitSha,
  token
) {
  const commit = {
    message,
    tree: treeSha,
    parents: [parentCommitSha]
  }

  const response = await fetch(
    `https://api.github.com/repos/${username}/${repo}/git/commits`,
    {
      method: 'POST',
      headers: {
        Authorization: `token ${token}`
      },
      body: JSON.stringify(commit)
    }
  )
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create a commit')
  }

  return data.sha
}

async function updateBranch(username, repo, branch, newCommitSha, token) {
  // Fetch the latest commit SHA for the branch again to ensure it's up to date
  // const latestCommitSha = await getLatestCommitSha(username, repo, branch, token)

  const response = await fetch(
    `https://api.github.com/repos/${username}/${repo}/git/refs/heads/${branch}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `token ${token}`
      },
      body: JSON.stringify({
        sha: newCommitSha,
        force: true // Consider using force push cautiously
      })
    }
  )
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update the branch')
  }

  return data.object.sha
}
