const fs = require('fs')
const admin = require('./firebase.js')

const firestore = admin.firestore()

// Query the Firestore collection
const filesRef = firestore.collection('files')
const filesQuery = filesRef.where('project', '!=', 'CA')

filesQuery.onSnapshot((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    const data = doc.data()
    console.log(`Document data: ${JSON.stringify(data)}`)

    const filePath = data.path
    fs.writeFileSync('app/' + filePath, `${data.value}`)
  })
}, (error) => {
  console.error(`Error fetching documents: ${error}`)
})

console.log('started')
