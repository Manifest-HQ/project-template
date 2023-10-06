## Explanation

This repo contains a NodeJS project which in turn, contains a nuxt project used for live developing the front end of a Manifest Project.

It is supposed to be hosted on heroku and run the nuxt app in dev mode.
Connected to firestore it would update files of the nuxt app and reload things.

## Update build
`tar czvf heroku.tgz package.json mynuxt/ manifest-hq-firebase-adminsdk-5um2c-5e3221afd0.json index.js firebase.js .gitignore app.json`