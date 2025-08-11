const fs = require('fs');
const path = require('path');
const axios = require('axios');
const csv = require('csv-parser');
const fixBadNames = require('./fixBadNames');

const rawPlayersPath = path.resolve("./raw-players.json");
const rawPlayers = JSON.parse(fs.readFileSync(rawPlayersPath, "utf-8"));

const validNames = rawPlayers.map(p => p.name.toLowerCase());

// Path to your CSV file
const csvFilePath = path.join(__dirname, 'ff_player_ids.csv');

// Output directory for player headshots
const outputDir = path.join(__dirname, 'player-headshots');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// Base URL for FantasyPros headshots
const baseUrl = 'https://images.fantasypros.com/images/players/nfl';

// Read CSV and store player IDs & names
const players = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    if (row["fantasypros_id"] && row.name) {
      players.push({
        id: row.fantasypros_id.trim(),
        name: row.name.trim().replace(/[/\\?%*:|"<>]/g, '_'), // sanitize filename
      });
    }
  })
  .on('end', async () => {
    console.log(`Found ${players.length} players. Starting downloads...`);
    
    for (const player of players) {
      const fixedName = fixBadNames(player.name);
      if (!validNames.includes(fixedName.toLowerCase())) continue;
      const url = `${baseUrl}/${player.id}/headshot/70x70.png`;
      const formattedName = fixedName.toLowerCase().replace(/\s/g, '');
      const filePath = path.join(outputDir, `${formattedName}.png`);

      try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        fs.writeFileSync(filePath, response.data);
        console.log(`✅ Saved ${formattedName}.png`);
      } catch (err) {
        console.error(`❌ Failed to download ${player.name} (${player.id}): ${err.message}`);
      }
    }

    console.log('🎯 All downloads attempted.');
  });
