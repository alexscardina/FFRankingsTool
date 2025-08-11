const fs = require('fs');
const csv = require('csv-parser');
const addPositionRanks = require('./utilities/addPositionRanks');

const playersFile = './raw-players.json';
const espnCsv = './rankings/espn-rankings.csv';

const players = JSON.parse(fs.readFileSync(playersFile, 'utf-8'));

const nameToPlayerMap = new Map();
for (const player of players) {
  nameToPlayerMap.set(player.name, player);
}
const updatedPlayers = new Set();

// Now pipe into the parser
fs.createReadStream(espnCsv)
  .pipe(csv())
  .on('data', (row) => {
    const name = row['Name'];
    const overallRank = parseInt(row['Rank'], 10);

    if (!name || isNaN(overallRank)) return;

    const player = nameToPlayerMap.get(name);
    if (player) {
      player.rankings = player.rankings || {};
      player.rankings.espn = player.rankings.espn || {};
      player.rankings.espn.overall = overallRank;
      if (player.rankings.espn.overall) updatedPlayers.add(player.name);
    }
  })
  .on('end', () => {
    const playersWithPosRank = addPositionRanks(players, 'espn');
    const newPlayers = playersWithPosRank.filter(x => x.rankings.espn.overall);
    fs.writeFileSync(playersFile, JSON.stringify(newPlayers, null, 2));
    console.log(`✅ ESPN ranks added for ${updatedPlayers.size} players`);
  });

