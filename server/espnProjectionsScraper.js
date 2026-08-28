const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl';
const PAGE_SIZE = 50;

const PRO_TEAMS = {
  1: 'ATL', 2: 'BUF', 3: 'CHI', 4: 'CIN', 5: 'CLE', 6: 'DAL', 7: 'DEN', 8: 'DET',
  9: 'GB', 10: 'TEN', 11: 'IND', 12: 'KC', 13: 'LV', 14: 'LAR', 15: 'MIA', 16: 'MIN',
  17: 'NE', 18: 'NO', 19: 'NYG', 20: 'NYJ', 21: 'PHI', 22: 'ARI', 23: 'PIT', 24: 'LAC',
  25: 'SF', 26: 'SEA', 27: 'TB', 28: 'WSH', 29: 'CAR', 30: 'JAX', 33: 'BAL', 34: 'HOU',
};

const POSITIONS = {
  1: 'QB', 2: 'RB', 3: 'WR', 4: 'TE', 5: 'K', 16: 'DST',
};

// ESPN stat IDs for projected counting stats shown on the projections page.
const STAT_COLUMNS = {
  3: 'Pass Yds',
  4: 'Pass TD',
  19: 'INT',
  20: 'Sacks',
  24: 'Rush Yds',
  25: 'Rush TD',
  27: 'Rush Att',
  42: 'Rec Yds',
  43: 'Rec TD',
  53: 'Rec',
  72: 'Fum Lost',
  74: '2PT',
  86: 'FG Made',
  88: 'XP Made',
};

const DEFAULT_LINEUP_SLOTS = [
  0, 2, 3, 4, 5, 6, 7, 17, 20, 21, 23,
];

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    leagueFormatId: 3,
    seasonId: 2026,
    output: path.join(__dirname, 'rankings', 'espn-projections.csv'),
    format: 'csv',
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--league-format-id' && args[i + 1]) {
      options.leagueFormatId = parseInt(args[i + 1], 10);
      i += 1;
    } else if (arg === '--season' && args[i + 1]) {
      options.seasonId = parseInt(args[i + 1], 10);
      i += 1;
    } else if (arg === '--output' && args[i + 1]) {
      options.output = args[i + 1];
      i += 1;
    } else if (arg === '--format' && args[i + 1]) {
      options.format = args[i + 1].toLowerCase();
      i += 1;
    }
  }

  return options;
}

function buildFilter({ offset, seasonId, rankType }) {
  const projectedStatKey = `1${0}${seasonId}${0}`;

  return {
    players: {
      limit: PAGE_SIZE,
      offset,
      sortDraftRanks: { sortPriority: 2, sortAsc: true, value: rankType },
      sortAppliedStatTotal: {
        sortAsc: false,
        sortPriority: 3,
        value: projectedStatKey,
      },
      sortPercOwned: { sortPriority: 4, sortAsc: false },
      filterSlotIds: { value: DEFAULT_LINEUP_SLOTS },
      filterStatsForSourceIds: { value: [0, 1] },
      filterStatsForExternalIds: { value: [seasonId] },
      useFullProjectionTable: { value: true },
    },
  };
}

async function fetchLeagueSettings(seasonId, leagueFormatId) {
  const url = `${BASE_URL}/seasons/${seasonId}/segments/0/leaguedefaults/${leagueFormatId}`;
  const { data } = await axios.get(url, {
    params: { view: 'mSettings' },
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });

  return {
    name: data.settings?.name || `Format ${leagueFormatId}`,
    rankType: data.settings?.scoringSettings?.playerRankType || 'PPR',
  };
}

async function fetchPlayersPage({ seasonId, leagueFormatId, offset, rankType }) {
  const url = `${BASE_URL}/seasons/${seasonId}/segments/0/leaguedefaults/${leagueFormatId}`;
  const filter = buildFilter({ offset, seasonId, rankType });

  const response = await axios.get(url, {
    params: {
      scoringPeriodId: 0,
      view: 'kona_player_info',
    },
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'X-Fantasy-Filter': JSON.stringify(filter),
    },
    validateStatus: (status) => status < 500,
  });

  if (response.status !== 200) {
    throw new Error(`ESPN API returned ${response.status}: ${JSON.stringify(response.data)}`);
  }

  const totalCount = parseInt(response.headers['x-fantasy-filter-player-count'], 10)
    || response.data.players?.length
    || 0;

  return {
    players: response.data.players || [],
    totalCount,
  };
}

async function fetchAllPlayers({ seasonId, leagueFormatId, rankType }) {
  const allPlayers = [];
  let offset = 0;
  let totalCount = Infinity;

  while (offset < totalCount) {
    const page = await fetchPlayersPage({ seasonId, leagueFormatId, offset, rankType });
    totalCount = page.totalCount;
    allPlayers.push(...page.players);
    offset += PAGE_SIZE;

    process.stdout.write(`\rFetched ${Math.min(offset, totalCount)}/${totalCount} players`);

    if (page.players.length === 0) break;
  }

  process.stdout.write('\n');
  return allPlayers;
}

function getProjectedStats(playerEntry, seasonId) {
  const stats = playerEntry.player?.stats || [];
  return stats.find(
    (stat) => stat.statSourceId === 1
      && stat.seasonId === seasonId
      && stat.scoringPeriodId === 0
      && stat.statSplitTypeId === 0,
  );
}

function playerToRow(playerEntry, seasonId, rank) {
  const player = playerEntry.player;
  const ownership = player.ownership || {};
  const projection = getProjectedStats(playerEntry, seasonId);
  const projectedStats = projection?.stats || {};

  const row = {
    Rank: rank,
    Name: player.fullName,
    Team: PRO_TEAMS[player.proTeamId] || player.proTeamId,
    Position: POSITIONS[player.defaultPositionId] || player.defaultPositionId,
    'Proj Points': projection?.appliedTotal != null
      ? Number(projection.appliedTotal.toFixed(2))
      : '',
    ADP: ownership.averageDraftPosition != null
      ? Number(ownership.averageDraftPosition.toFixed(2))
      : '',
    '% Owned': ownership.percentOwned != null
      ? Number(ownership.percentOwned.toFixed(2))
      : '',
    '% Started': ownership.percentStarted != null
      ? Number(ownership.percentStarted.toFixed(2))
      : '',
    'Injury Status': player.injuryStatus || '',
  };

  for (const [statId, label] of Object.entries(STAT_COLUMNS)) {
    const value = projectedStats[statId];
    row[label] = value != null ? Number(Number(value).toFixed(2)) : '';
  }

  return row;
}

function escapeCsvValue(value) {
  const str = String(value ?? '');
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function writeDelimitedFile(rows, outputPath, delimiter) {
  if (rows.length === 0) {
    throw new Error('No player rows to write');
  }

  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(delimiter),
    ...rows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(delimiter)),
  ];

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${lines.join('\n')}\n`, 'utf-8');
}

async function main() {
  const options = parseArgs();
  const delimiter = options.format === 'tsv' ? '\t' : ',';

  if (options.format === 'tsv' && options.output.endsWith('.csv')) {
    options.output = options.output.replace(/\.csv$/, '.tsv');
  }

  console.log(`Scraping ESPN projections (${options.seasonId}, format ${options.leagueFormatId})`);

  const leagueSettings = await fetchLeagueSettings(options.seasonId, options.leagueFormatId);
  console.log(`League format: ${leagueSettings.name} (${leagueSettings.rankType})`);

  const players = await fetchAllPlayers({
    seasonId: options.seasonId,
    leagueFormatId: options.leagueFormatId,
    rankType: leagueSettings.rankType,
  });

  const seenNames = new Set();
  const rows = players
    .filter((entry) => {
      const name = entry.player?.fullName;
      if (!name || seenNames.has(name)) return false;
      seenNames.add(name);
      return true;
    })
    .map((entry, index) => playerToRow(entry, options.seasonId, index + 1));

  writeDelimitedFile(rows, options.output, delimiter);
  console.log(`✅ Wrote ${rows.length} players to ${options.output}`);
}

main().catch((error) => {
  console.error('Scraper failed:', error.message);
  process.exit(1);
});
