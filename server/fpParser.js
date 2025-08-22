const fs = require('fs');
const csv = require('csv-parser');
const addPositionRanks = require('./utilities/addPositionRanks');
const fixBadNames = require('./utilities/fixBadNames');

const results = [];

// fantasyPros
fs.createReadStream('./rankings/FantasyPros_2025_Draft_ALL_Rankings.csv')
  .pipe(csv())
  .on('data', (data) => {
    const fpRank = data.RK ? parseInt(data.RK) : null;
    const rawName = data['PLAYER NAME'] || '';
    const team = data.TEAM || '';
    const posRaw = data.POS || '';
    const position = posRaw.slice(0, 2); // QB58 -> QB
    const bye = data['BYE WEEK'] || '';
    const name = fixBadNames(rawName);
    const formattedName = name.toLowerCase().replace(/\s/g, '');
    const id = `${team.toLowerCase()}${position.toLowerCase()}${formattedName}`;
    const matchPositions = ['QB', 'RB', 'WR', 'TE'];
    const isNotKorDST = matchPositions.includes(position);
    

    if (isNotKorDST) {
      results.push({
        id,
        name,
        team,
        position,
        bye,
        isDrafted: false,
        isOnYourTeam: false,
        rankings: {
          nfc: { overall: null, position: null },
          espn: { overall: null, position: null },
          fantasypros: { overall: fpRank, position: null },
          draftsharks: { overall: null, position: null },
          yahoo: { overall: null, position: null },
          sleeper: { overall: null, position: null },
        }
      });
    }
  })
  .on('end', () => {
    const newResults = addPositionRanks(results, 'fantasypros');
    fs.writeFileSync('raw-players.json', JSON.stringify(newResults, null, 2));
    console.log(`✅ Parsed ${newResults.length} players from CSV.`);
  });
