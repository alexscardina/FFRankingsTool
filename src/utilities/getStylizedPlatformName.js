export const getStylizedPlatformName = platform => {
  const mapping = {
    espn: 'ESPN',
    fantasypros: 'FantasyPros',
    yahoo: 'Yahoo',
    sleeper: 'Sleeper',
    draftsharks: 'DraftSharks',
    nfc: 'Rotowire NFC',
  };

  return mapping[platform] || platform;
}