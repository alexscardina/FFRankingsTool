export const getPlayerHeadshot = name => {
  const formattedName = name.toLowerCase().replace(/\s/g, '');
  return `/player-headshots/${formattedName}.png`;
};