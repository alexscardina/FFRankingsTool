const fs = require('fs');
const csv = require('csv-parser');
const addPositionRanks = require('./utilities/addPositionRanks');
const fixBadNames = require('./utilities/fixBadNames');

const playersFile = './raw-players.json';
const yahooCsv = './rankings/player_adps_yahoo.csv';

const players = JSON.parse(fs.readFileSync(playersFile, 'utf-8'));

const nameToPlayerMap = new Map();
for (const player of players) {
  nameToPlayerMap.set(player.name, player);
}
const updatedPlayers = new Set();

// Now pipe into the parser
fs.createReadStream(yahooCsv)
  .pipe(csv({
    mapHeaders: ({ header }) => header.trim()
  }))
  .on('data', (row) => {
    const tempName = row['Player Name'];
    const adp = row['Yahoo: Redraft 0.5 PPR ADP'];
    const [roundStr, pickStr] = adp.split('.');
    const round = Number(roundStr);
    const pick = Number(pickStr);
    const overallRank = pick + ((round - 1) * 12);

    if (!tempName || isNaN(overallRank)) return;
    const name = fixBadNames(tempName);

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

