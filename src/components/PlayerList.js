import React from 'react';
import PlayerCard from './PlayerCard';
import PlayerModal from './PlayerModal';

export default function PlayerList({ players, sortBy, isDraftMode , onTheirTeam, onYourTeam, isRosterFilled }) {
  const [selectedPlayer, setSelectedPlayer] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleClick = (id) => {
    setSelectedPlayer(id);
    setIsModalOpen(true);
  }
  const handleClose = () => {
    setSelectedPlayer(null);
    setIsModalOpen(false);
  }
  
  const displayStyle = isDraftMode ? 'flex' : '';
  return (
    <>
      {players.map(player => {
        return (
          <div style={{display: displayStyle}}>
            <PlayerCard
              key={player.id}
              player={player}
              onClick={() => handleClick(player)}
              platform={sortBy}
              isDraftMode={isDraftMode}
              onTheirTeam={onTheirTeam}
              onYourTeam={onYourTeam}
              isRosterFilled={isRosterFilled}
            />
          </div>
      )})}
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