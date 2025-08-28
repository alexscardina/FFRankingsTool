const fs = require('fs');
const csv = require('csv-parser');
const addPositionRanks = require('./utilities/addPositionRanks');
const fixBadNames = require('./utilities/fixBadNames');

const playersFile = './raw-players.json';
const dsCsv = './rankings/rankings-half-ppr.csv';

const players = JSON.parse(fs.readFileSync(playersFile, 'utf-8'));

const nameToPlayerMap = new Map();
for (const player of players) {
  let tempName = JSON.parse(JSON.stringify(player.name));
  nameToPlayerMap.set(tempName, player);
}
const updatedPlayers = new Set();

let badPositionCount = 0;

// Now pipe into the parser
fs.createReadStream(dsCsv)
  .pipe(csv())
  .on('data', (row) => {
    const tempName = row['Player'];
    const overallRank = parseInt(row['Rank'], 10);
    const position = row['Fantasy Position'];
    const matchPositions = ['QB', 'RB', 'WR', 'TE', 'DEF', 'K'];
    const isNotIDP = matchPositions.includes(position);
    if (!isNotIDP) badPositionCount += 1;
    const finalRank = overallRank - badPositionCount;

    if (!tempName || isNaN(overallRank)) return;
    const name = fixBadNames(tempName);

    const player = nameToPlayerMap.get(name);
    if (player) {
      player.rankings = player.rankings || {};
      player.rankings.draftsharks = player.rankings.draftsharks || {};
      player.rankings.draftsharks.overall = finalRank;
      if (player.rankings.draftsharks.overall) updatedPlayers.add(player.name);
    }
  })
  .on('end', () => {
    const playersWithPosRank = addPositionRanks(players, 'draftsharks');
    const newPlayers = playersWithPosRank.filter(x => x.rankings.draftsharks.overall);
    fs.writeFileSync(playersFile, JSON.stringify(newPlayers, null, 2));
    console.log(`✅ DraftSharks ranks added for ${updatedPlayers.size} players`);
  });

