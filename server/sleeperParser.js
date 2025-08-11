const fs = require('fs');
const csv = require('csv-parser');
const addPositionRanks = require('./utilities/addPositionRanks');
const fixBadNames = require('./utilities/fixBadNames');

const playersFile = './raw-players.json';
const sleeperCsv = './rankings/player_adps.csv';

const players = JSON.parse(fs.readFileSync(playersFile, 'utf-8'));

const nameToPlayerMap = new Map();
for (const player of players) {
  nameToPlayerMap.set(player.name, player);
}
const updatedPlayers = new Set();

// Now pipe into the parser
fs.createReadStream(sleeperCsv)
  .pipe(csv({
    mapHeaders: ({ header }) => header.trim()
  }))
  .on('data', (row) => {
    const tempName = row['Player Name'];
    const adp = row['Sleeper: Redraft 0.5 PPR ADP'];
    const [roundStr, pickStr] = adp.split('.');
    const round = Number(roundStr);
    const pick = Number(pickStr);
    const overallRank = pick + ((round - 1) * 12);

    if (!tempName || isNaN(overallRank)) return;
    const name = fixBadNames(tempName);

    const player = nameToPlayerMap.get(name);
    if (player) {
      player.rankings = player.rankings || {};
      player.rankings.sleeper = player.rankings.sleeper || {};
      player.rankings.sleeper.overall = overallRank;
      if (player.rankings.sleeper.overall) updatedPlayers.add(player.name);
    }
  })
  .on('end', () => {
    const playersWithPosRank = addPositionRanks(players, 'sleeper');
    const newPlayers = playersWithPosRank.filter(x => x.rankings.sleeper.overall);
    fs.writeFileSync(playersFile, JSON.stringify(newPlayers, null, 2));
    console.log(`✅ Sleeper ranks added for ${updatedPlayers.size} players`);
  });

