const fs = require('fs');
const csv = require('csv-parser');
const addPositionRanks = require('./utilities/addPositionRanks');

const playersFile = './raw-players.json';
const yahooCsv = './rankings/FantasyPros-consensus-rankings.csv';

const players = JSON.parse(fs.readFileSync(playersFile, 'utf-8'));

const raw = fs.readFileSync(yahooCsv, 'utf-8');
// Only keep lines after the 2nd newline (skips header text)
const lines = raw.split('\n').slice(4).join('\n');

// Write to a temp file to parse cleanly
fs.writeFileSync('temp_yahoo.csv', lines);

const nameToPlayerMap = new Map();
for (const player of players) {
  nameToPlayerMap.set(player.name, player);
}
const updatedPlayers = new Set();

// Now pipe into the parser
fs.createReadStream('temp_yahoo.csv')
  .pipe(csv())
  .on('data', (row) => {
    const rawName = row['Player Name'];
    const overallRank = parseInt(row['Rank'], 10);

    const name = rawName.startsWith('Kyle Pitts') ? 'Kyle Pitts' : rawName;
    if (!name || isNaN(overallRank)) return;
    

    const player = nameToPlayerMap.get(name);
    if (player) {
      player.rankings = player.rankings || {};
      player.rankings.yahoo = player.rankings.yahoo || {};
      player.rankings.yahoo.overall = overallRank;
      if (player.rankings.yahoo.overall) updatedPlayers.add(player.name);
    }
  })
  .on('end', () => {
    const playersWithPosRank = addPositionRanks(players, 'yahoo');
    const newPlayers = playersWithPosRank.filter(x => x.rankings.yahoo.overall);
    fs.writeFileSync(playersFile, JSON.stringify(newPlayers, null, 2));
    console.log(`✅ Yahoo ranks added for ${updatedPlayers.size} players`);
  });

