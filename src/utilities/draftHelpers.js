export function getBoardIndex(overallPick, leagueSize) {
  const round = Math.floor(overallPick / leagueSize);
  const pickInRound = overallPick % leagueSize;
  const isSnakeRound = round % 2 === 1;
  const teamIndex = isSnakeRound ? leagueSize - 1 - pickInRound : pickInRound;
  return { round, teamIndex };
}

export function isYourPick(overallPick, leagueSize, draftPosition) {
  const { teamIndex } = getBoardIndex(overallPick, leagueSize);
  return teamIndex === draftPosition - 1;
}

export function getTeamIndexForPick(overallPick, leagueSize) {
  return getBoardIndex(overallPick, leagueSize).teamIndex;
}
