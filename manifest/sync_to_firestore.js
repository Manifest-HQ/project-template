const admin = require('firebase-admin')
const fs = require('fs')
const path = require('path')
const ignore = require('ignore')

// Initialize Firebase Admin
const serviceAccount = require('./service_account.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

// Get repository name from environment variable set by GitHub Actions
const repoName = process.env.GITHUB_REPOSITORY.split('/').pop()

const ig = ignore()
if (fs.existsSync('.gitignore')) {
  ig.add(fs.readFileSync('.gitignore').toString())
}

const branchName = process.env.GITHUB_REF.split('/').pop()

const uploadToFirestore = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf8')

  // Create the document data
  const data = {
    projectID: repoName,
    branch: branchName,
    path: filePath,
    value: fileContent,
    updated_at: admin.firestore.Timestamp.now()
  }

  // Check if the file already exists in Firestore
  const filesRef = db.collection('files')
  filesRef.where('projectID', '==', repoName).where('path', '==', filePath).limit(1).get()
    .then(snapshot => {
      if (!snapshot.empty) {
        // Update the existing document
        const docRef = filesRef.doc(snapshot.docs[0].id)
        return docRef.update(data)
      } else {
        // Add creation time for new documents
        data.created_at = admin.firestore.Timestamp.now()
        // Create a new document
        return filesRef.add(data)
      }
    })
    .catch(err => {
      console.error('Error syncing file:', filePath, err)
    })
}

// Go through each file in the repo and upload/update in Firestore
const walkSync = (dir) => {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (filePath.includes('.git/') || filePath.includes('.github/') || ig.ignores(filePath)) {
      return
    }

    if (stat.isDirectory()) {
      walkSync(filePath)
    } else if (!filePath.endsWith('.git') && filePath !== './service_account.json') {
      uploadToFirestore(filePath)
    }
  })
}

walkSync('.')
