import React from 'react';
import Modal from 'react-modal';
import data from './../data/players.json';
import { getPlayerHeadshot, getBoardIndex } from './../utilities';
import './../styling/Modal.css';

export default function DraftBoardModal({
  isOpen,
  onClose,
  drafted,
  yourTeam,
  leagueSize = 12,
  rosterSize = 13,
  draftPosition = 1,
}) {
  const playersById = React.useMemo(() => {
    const map = new Map();
    for (const player of data) map.set(player.id, player);
    return map;
  }, []);

  const totalSlots = leagueSize * rosterSize;
  const board = React.useMemo(() => {
    const cells = Array.from({ length: rosterSize }, () =>
      Array.from({ length: leagueSize }, () => null)
    );

    drafted.forEach((id, overallPick) => {
      if (overallPick >= totalSlots) return;
      const { round, teamIndex } = getBoardIndex(overallPick, leagueSize);
      cells[round][teamIndex] = {
        player: playersById.get(id),
        pickNumber: overallPick + 1,
        isYours: yourTeam.has(id),
      };
    });

    return cells;
  }, [drafted, leagueSize, rosterSize, totalSlots, playersById, yourTeam]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Draft board"
      className="app-modal draft-board-modal"
      overlayClassName="app-modal-overlay"
    >
      <div className="modal-header-row">
        <div className="selected-header draft-board-title">Draft Board</div>
        <button
          type="button"
          className="modal-close-button"
          onClick={onClose}
          aria-label="Close draft board"
        >
          Close
        </button>
      </div>
      <div
        className="draft-board-grid"
        style={{
          gridTemplateColumns: `40px repeat(${leagueSize}, minmax(0, 1fr))`,
        }}
      >
        <div className="draft-board-corner" />
        {Array.from({ length: leagueSize }, (_, teamIndex) => (
          <div
            key={`team-${teamIndex}`}
            className={`draft-board-team-header${teamIndex + 1 === draftPosition ? ' draft-board-team-yours' : ''}`}
          >
            {teamIndex + 1}
          </div>
        ))}

        {board.map((round, roundIndex) => (
          <React.Fragment key={`round-${roundIndex}`}>
            <div className="draft-board-round-label">R{roundIndex + 1}</div>
            {round.map((cell, teamIndex) => {
              if (!cell || !cell.player) {
                return (
                  <div
                    key={`empty-${roundIndex}-${teamIndex}`}
                    className="draft-board-card draft-board-card-empty"
                  />
                );
              }

              const { player, pickNumber, isYours } = cell;
              const positionClass = `draft-board-pos-${player.position.toLowerCase()}`;
              const headshotUrl = getPlayerHeadshot(player.name);
              return (
                <div
                  key={`pick-${pickNumber}`}
                  className={`draft-board-card draft-board-card-filled ${positionClass}${isYours ? ' draft-board-card-yours' : ''}`}
                >
                  <div className="draft-board-pick-num">{pickNumber}</div>
                  <div className="draft-board-player-name">{player.name}</div>
                  <div className="draft-board-player-meta">
                    {player.position} · {player.team}
                  </div>
                  <img
                    className="draft-board-headshot"
                    src={headshotUrl}
                    alt=""
                    loading="lazy"
                  />
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </Modal>
  );
}
