const admin = require('firebase-admin')
const serviceAccount = require('./manifest-hq-firebase-adminsdk-5um2c-5e3221afd0.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

module.exports = admin
