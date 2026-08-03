const fs = require('fs');
const path = require('path');

const sourceFile = path.join(__dirname, 'raw-players.json');
const destinationFile = path.join(__dirname, '..', 'src', 'data', 'players.json');
const lastUpdatedFile = path.join(__dirname, '..', 'src', 'data', 'lastUpdated.js');

function formatTimestamp(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  }).formatToParts(date);

  const get = (type) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('weekday')}. ${get('month')}. ${get('day')}, ${get('year')} ${get('hour')}:${get('minute')} ${get('dayPeriod')} ${get('timeZoneName')}`;
}

// Ensure destination folder exists
fs.mkdirSync(path.dirname(destinationFile), { recursive: true });

fs.copyFile(sourceFile, destinationFile, (err) => {
  if (err) {
    console.error('Error copying file:', err);
    process.exit(1);
  }
  console.log(`✅ File copied from ${sourceFile} to ${destinationFile}`);

  const updatedText = formatTimestamp();
  fs.writeFileSync(lastUpdatedFile, `export default '${updatedText}';\n`);
  console.log(`✅ Updated timestamp: ${updatedText}`);
});
