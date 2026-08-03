const fs = require('fs');
const csv = require('csv-parser');
const addPositionRanks = require('./utilities/addPositionRanks');
const fixBadNames = require('./utilities/fixBadNames');

const playersFile = './raw-players.json';
const nfcTsv = './rankings/ADP.tsv';

const players = JSON.parse(fs.readFileSync(playersFile, 'utf-8'));

const nameToPlayerMap = new Map();
for (const player of players) {
  let tempName = JSON.parse(JSON.stringify(player.name));
  nameToPlayerMap.set(tempName, player);
}
const updatedPlayers = new Set();

let badPositionCount = 0;

// ADP.tsv uses "Last, First" (e.g. "Robinson, Bijan" or "Cook III, James")
const formatLastFirstName = (rawName) => {
  if (!rawName || !rawName.includes(',')) return rawName;
  const [last, first] = rawName.split(',').map((part) => part.trim());
  return `${first} ${last}`;
};

fs.createReadStream(nfcTsv)
  .pipe(csv({
    separator: '\t',
    mapHeaders: ({ header }) => header.trim(),
  }))
  .on('data', (row) => {
    const tempName = formatLastFirstName(row['Player']);
    const overallRank = parseInt(row['Rank'], 10);
    const position = row['Position(s)'];
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
    // const newPlayers = playersWithPosRank.filter(x => x.rankings.nfc.overall);
    const newPlayers = playersWithPosRank;
    fs.writeFileSync(playersFile, JSON.stringify(newPlayers, null, 2));
    console.log(`✅ Rotowire NFC ranks added for ${updatedPlayers.size} players`);
  });
