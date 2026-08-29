import React from 'react';
import PlayerCard from './PlayerCard';
import PlayerModal from './PlayerModal';

export default function PlayerList({
  players,
  sortBy,
  isDraftMode,
  onDraft,
  isYourTurn,
  isRosterFilled,
}) {
  const [selectedPlayer, setSelectedPlayer] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleClick = (player) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };
  const handleClose = () => {
    setSelectedPlayer(null);
    setIsModalOpen(false);
  };

  return (
    <>
      {players.map((player) => (
        <div key={player.id} className="player-row">
          <PlayerCard
            player={player}
            onClick={() => handleClick(player)}
            platform={sortBy}
            isDraftMode={isDraftMode}
            onDraft={onDraft}
            isYourTurn={isYourTurn}
            isRosterFilled={isRosterFilled}
          />
        </div>
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
}
