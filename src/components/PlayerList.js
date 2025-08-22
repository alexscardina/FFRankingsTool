import React from 'react';
import PlayerCard from './PlayerCard';
import PlayerModal from './PlayerModal';
import YourPlayersModal from './YourPlayersModal';

export default function PlayerList({ players, sortBy, isDraftMode }) {
  const [selectedPlayer, setSelectedPlayer] = React.useState(null);
  const [openYourPlayers, setOpenYourPlayers] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const notDraftedPlayers = players.filter(p => !p.isOnYourTeam && !p.isDrafted);
  const [availablePlayers, setAvailablePlayers] = React.useState(notDraftedPlayers);
  const [yourPlayers, setYourPlayers] = React.useState([]);
  const [draftedCount, setDraftedCount] = React.useState(0);
  
  const draftedByUserPlayers = players.filter(p => p.isOnYourTeam === true);

  React.useEffect(() => {
    setYourPlayers(draftedByUserPlayers);
    setAvailablePlayers(notDraftedPlayers);
  }, [draftedCount, sortBy]);

  const handleClick = (id) => {
    setSelectedPlayer(id);
    setIsModalOpen(true);
  }
  const handleClose = () => {
    setSelectedPlayer(null);
    setIsModalOpen(false);
  }
  const handleTheirTeamClick = (p) => {
    const modPlayers = JSON.parse(JSON.stringify(availablePlayers));
    setDraftedCount(draftedCount + 1);
    const findPlayer = player => player.id === p.id;
    const draftedIndex = modPlayers.findIndex(findPlayer);
    modPlayers.splice(draftedIndex, 1);
    console.log('their team');
    setAvailablePlayers(modPlayers);
  }
  const handleYourTeamClick = (p) => {
    p.isOnYourTeam = true;
    setDraftedCount(draftedCount + 1);
  }
  const displayStyle = isDraftMode ? 'flex' : '';
  return (
    <>
      {isDraftMode && (
        <button
          onClick={() => setOpenYourPlayers(true)}
        >
          View Your Team
        </button>
      )}
      {availablePlayers.map(player => {
        return (
          <div style={{display: displayStyle}}>
            {isDraftMode && (
              <div>
                <button
                  onClick={() => handleTheirTeamClick(player)}
                >
                  Their Team
                </button>
                <button
                  onClick={() => handleYourTeamClick(player)}
                >
                  Your Team
                </button>
              </div>
            )}
            <PlayerCard
              key={player.id}
              player={player}
              onClick={() => handleClick(player)}
              platform={sortBy}
              isDraftMode={isDraftMode}
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
      {openYourPlayers && (
        <YourPlayersModal
          isOpen={openYourPlayers}
          yourPlayers={yourPlayers}
          onClose={() => setOpenYourPlayers(false)}
        />
      )}
    </>
  );
};