const fs = require('fs');
const path = require('path');

const sourceFile = path.join(__dirname, 'raw-players.json');
const destinationFile = path.join(__dirname, '..', 'src', 'data', 'players.json');

// Ensure destination folder exists
fs.mkdirSync(path.dirname(destinationFile), { recursive: true });

fs.copyFile(sourceFile, destinationFile, (err) => {
  if (err) {
    console.error('Error copying file:', err);
    process.exit(1);
  }
  console.log(`✅ File copied from ${sourceFile} to ${destinationFile}`);
});
