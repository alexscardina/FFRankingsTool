import React from 'react';
import Modal from 'react-modal';
import data from './../data/players.json';
import { getPlayerHeadshot } from './../utilities';
import { useAppContext } from '../Context';
import './../styling/Modal.css';

function RosterSlot({ label, boxClass, player }) {
  return (
    <div className={`roster-slot${player ? '' : ' roster-slot-empty'}`}>
      <div className={`roster-slot-label ${boxClass}`}>{label}</div>
      {player ? (
        <div className="roster-slot-player">
          <div className="roster-slot-name">{player.name}</div>
          <div className="roster-slot-meta">
            {player.position} · {player.team}
          </div>
          <img
            className="roster-slot-headshot"
            src={getPlayerHeadshot(player.name)}
            alt=""
            loading="lazy"
          />
        </div>
      ) : (
        <div className="roster-slot-player roster-slot-player-empty">—</div>
      )}
    </div>
  );
}

export default function YourPlayersModal({ isOpen, onClose, yourTeam }) {
  const { startingWRs, flexSpots, benchSpots } = useAppContext();
  const players = JSON.parse(JSON.stringify(data));
  const yourPlayers = players.filter(player => yourTeam.has(player.id));
  const yourQBs = yourPlayers.filter(y => y.position === 'QB');
  const yourRBs = yourPlayers.filter(y => y.position === 'RB');
  const yourWRs = yourPlayers.filter(y => y.position === 'WR');
  const yourTEs = yourPlayers.filter(y => y.position === 'TE');
  let yourFLEXs = [];
  let yourBench = [];
  let qbCount = 0, rbCount = 0, wrCount = 0, teCount = 0, flexCount = 0;
  yourPlayers.forEach(player => {
    if (player.position === 'QB') {
      if (qbCount === 0) qbCount = 1;
      else if (qbCount >= 1) yourBench.push(player);
    }
    if (player.position === 'RB') {
      if (rbCount >= 2 && flexCount >= flexSpots) {
        yourBench.push(player);
      } else if (rbCount >= 2 && flexCount < flexSpots) {
        flexCount = flexCount + 1;
        yourFLEXs.push(player);
      } else rbCount = rbCount + 1;
    }
    if (player.position === 'WR') {
      if (wrCount >= startingWRs && flexCount >= flexSpots) {
        yourBench.push(player);
      } else if (wrCount >= startingWRs && flexCount < flexSpots) {
        flexCount = flexCount + 1;
        yourFLEXs.push(player);
      } else wrCount = wrCount + 1;
    }
    if (player.position === 'TE') {
      if (teCount >= 1 && flexCount >= flexSpots) {
        yourBench.push(player);
      } else if (teCount >= 1 && flexCount < flexSpots) {
        flexCount = flexCount + 1;
        yourFLEXs.push(player);
      } else teCount = teCount + 1;
    }
  });

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Your team"
      className="app-modal your-players-modal"
      overlayClassName="app-modal-overlay"
    >
      <div className="selected-header your-players-header">Your Team</div>
      <div className="roster-list">
        <RosterSlot label="QB" boxClass="qb-box" player={yourQBs[0]} />
        <RosterSlot label="RB" boxClass="rb-box" player={yourRBs[0]} />
        <RosterSlot label="RB" boxClass="rb-box" player={yourRBs[1]} />
        {Array.from({ length: startingWRs }, (_, i) => (
          <RosterSlot key={`wr-${i}`} label="WR" boxClass="wr-box" player={yourWRs[i]} />
        ))}
        <RosterSlot label="TE" boxClass="te-box" player={yourTEs[0]} />
        {Array.from({ length: flexSpots }, (_, i) => (
          <RosterSlot key={`flex-${i}`} label="FLEX" boxClass="flx-box" player={yourFLEXs[i]} />
        ))}
        {Array.from({ length: benchSpots }, (_, i) => (
          <RosterSlot key={`bn-${i}`} label="BN" boxClass="bench-box" player={yourBench[i]} />
        ))}
      </div>
    </Modal>
  );
}
