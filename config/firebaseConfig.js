const { Firestore } = require('@google-cloud/firestore');

const path = require('path');

const serviceAccountPath = path.join(__dirname, '..', 'config', 'serviceAccountKey.json');

const firestore = new Firestore({
    projectId: 'capstone-maigen',
    databaseId: 'maigendb',
    keyFilename: serviceAccountPath
});

module.exports = firestore;