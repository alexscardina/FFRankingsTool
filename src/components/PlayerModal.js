import React from 'react';
import Modal from 'react-modal';
import PlatformStats from './PlatformStats';
import './../styling/Modal.css';
import { getTeamLogo, getPlayerHeadshot, getStylizedPlatformName } from '../utilities';

export default function PlayerModal({ isOpen, player, onClose, platform }) {
  // Styling TODO:
  // 4) include tabs to switch between rankings, stats, game log (?)
  const { rankings, team, name, position, bye } = player;
  const teamLogo = getTeamLogo(team);
  const headshotImgUrl = getPlayerHeadshot(name);
  const platformName = getStylizedPlatformName(platform);
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={`${name} Info`}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '800px',
          padding: '20px',
          borderRadius: '10px',
          backgroundColor: '#D5DAE6',
        },
      }}
    >
      <div className="modal-section">
        <div style={{display: "flex"}}>
          <div>
            <div className="selected-header">{name}</div>
            <div>{position} · {team} · Bye: {bye}</div>
          </div>
          <img className="modal-team-logo" src={teamLogo} />
        </div>
        <div style={{display: "flex"}}>
          <img src={headshotImgUrl} width="100"/>
          <div className="selected-rank">#{player.rankings[platform].overall} · {`${position}${player.rankings[platform].position}`} ({platformName})</div>
        </div>
      </div>
      <div className="modal-section">
        <div className="modal-section-header">Rankings by Platform</div>
        {Object.keys(rankings).map(plat => (
          <PlatformStats
            player={player}
            platform={plat}
            rank={rankings[platform].overall}
            posRank={rankings[platform].position}
            type="modal"
          />
        ))}
      </div>
    </Modal>
  );
}