const fs = require('fs')

const port = process.env.PORT || 3000

const admin = require('./firebase.js')

const firestore = admin.firestore()

const docRef = firestore.doc('files/test')

docRef.onSnapshot((doc) => {
  if (doc.exists) {
    const data = doc.data()
    console.log(doc.data())
    console.log(`Document data: ${JSON.stringify(data)}`)

    // Path to the file in the Nuxt project
    const filePath = data.path

    // Write the data to the file
    fs.writeFileSync('app/' + filePath, `${data.value}`)
  } else {
    console.log('Document not found')
  }
})
