const express = require('express');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

const admin = require('./firebase.js');

const firestore = admin.firestore();

const docRef = firestore.doc('files/test');

docRef.onSnapshot((doc) => {
  if (doc.exists) {
    const data = doc.data();
    console.log(`Document data: ${JSON.stringify(data)}`)

    // Path to the file in the Nuxt project
    const filePath = 'mynuxt/app.vue';

    // Write the data to the file
    fs.writeFileSync(filePath, `<template><div>${data.value}</div></template>`);
  } else {
    console.log('Document not found');
  }
});

// Health check endpoint
app.get('/status', (req, res) => {
  res.send('Server is running!');
});

app.listen(port, () => {
  console.log(`Express server started on http://localhost:${port}`);
});
