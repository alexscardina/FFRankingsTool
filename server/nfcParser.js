const fs = require('fs');
const csv = require('csv-parser');
const addPositionRanks = require('./utilities/addPositionRanks');
const fixBadNames = require('./utilities/fixBadNames');

const playersFile = './raw-players.json';
const nfcCsv = './rankings/nfc-matrix.csv';

const players = JSON.parse(fs.readFileSync(playersFile, 'utf-8'));

const nameToPlayerMap = new Map();
for (const player of players) {
  let tempName = JSON.parse(JSON.stringify(player.name));
  nameToPlayerMap.set(tempName, player);
}
const updatedPlayers = new Set();

let badPositionCount = 0;

// Now pipe into the parser
fs.createReadStream(nfcCsv)
  .pipe(csv())
  .on('data', (row) => {
    const tempName = row['Player'];
    const overallRank = parseInt(row['Rank'], 10);
    const position = row['Pos'];
    const matchPositions = ['QB', 'RB', 'WR', 'TE'];
    const isNotKorDST = matchPositions.includes(position);
    if (!isNotKorDST) badPositionCount += 1;
    const finalRank = overallRank - badPositionCount;
    const name = fixBadNames(tempName);

    if (!name || isNaN(overallRank)) return;

    const player = nameToPlayerMap.get(name);
    if (player) {
      player.rankings = player.rankings || {};
      player.rankings.nfc = player.rankings.nfc || {};
      player.rankings.nfc.overall = finalRank;
      if (player.rankings.nfc.overall) updatedPlayers.add(player.name);
    }
  })
  .on('end', () => {
    const playersWithPosRank = addPositionRanks(players, 'nfc');
    const newPlayers = playersWithPosRank.filter(x => x.rankings.nfc.overall);
    fs.writeFileSync(playersFile, JSON.stringify(newPlayers, null, 2));
    console.log(`✅ Rotowire NFC ranks added for ${updatedPlayers.size} players`);
  });

