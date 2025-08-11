import React from 'react';
import PlayerCard from './PlayerCard';
import PlayerModal from './PlayerModal';

export default function PlayerList({ players, sortBy, positionFilter }) {
  const [selectedPlayer, setSelectedPlayer] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  // filters players by position if selected
  const playersByPosition = positionFilter ? [...players].filter(p => p.position === positionFilter) : players;
  
  // sorts players by chosen platform
  const sortedPlayers = [...playersByPosition].sort((a, b) => {
    return a.rankings[sortBy].overall - b.rankings[sortBy].overall;
  });
  const handleClick = (id) => {
    setSelectedPlayer(id);
    setIsModalOpen(true);
  }
  const handleClose = () => {
    setSelectedPlayer(null);
    setIsModalOpen(false);
  }
  return (
    <>
      {sortedPlayers.map(player => (
        <PlayerCard
          key={player.id}
          player={player}
          onClick={() => handleClick(player)}
          platform={sortBy}
        />
      ))}
      {selectedPlayer && (
        <PlayerModal
          isOpen={isModalOpen}
          player={selectedPlayer}
          onClose={handleClose}
          platform={sortBy}
        />
      )}
    </>
  );
};