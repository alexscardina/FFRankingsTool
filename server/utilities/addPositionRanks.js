function addPositionRanks(players, platform) {
  // Group players by position
  const grouped = {};

  for (const player of players) {
    const pos = player.position;
    if (!grouped[pos]) grouped[pos] = [];
    if (player.rankings[platform].overall) grouped[pos].push(player);
  }

  // Sort each group and assign position rank
  for (const pos in grouped) {
    grouped[pos]
      .sort((a, b) => (a.rankings[platform].overall) - (b.rankings[platform].overall))
      .forEach((player, index) => {
        player.rankings[platform].position = index + 1;
      });
  }

  return players;
}

module.exports = addPositionRanks;