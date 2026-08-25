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

  const rowClassName = isDraftMode ? 'player-row player-row-draft' : 'player-row';
  return (
    <>
      {players.map((player) => (
        <div key={player.id} className={rowClassName}>
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
