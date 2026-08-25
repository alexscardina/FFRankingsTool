import React from 'react';
import Modal from 'react-modal';
import PlatformStats from './PlatformStats';
import './../styling/Modal.css';
import { getTeamLogo, getPlayerHeadshot, getStylizedPlatformName } from '../utilities';

export default function PlayerModal({ isOpen, player, onClose, platform }) {
  const { rankings, team, name, position, bye } = player;
  const teamLogo = getTeamLogo(team);
  const headshotImgUrl = getPlayerHeadshot(name);
  const platformName = getStylizedPlatformName(platform);
  const posClass = `player-modal-pos-${position.toLowerCase()}`;
  const posRank = `${position}${player.rankings[platform].position}`;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={`${name} Info`}
      className="app-modal player-detail-modal"
      overlayClassName="app-modal-overlay"
    >
      <div className={`modal-section player-modal-hero ${posClass}`}>
        <div className="player-modal-hero-top">
          <div className="player-modal-identity">
            <div className="selected-header">{name}</div>
            <div className="player-modal-meta">
              <span className={`player-pos-badge ${position.toLowerCase()}-circle`}>{posRank}</span>
              <span className="player-meta-sep">{team}</span>
              <span className="player-meta-sep">Bye {bye}</span>
            </div>
          </div>
          <img className="modal-team-logo" src={teamLogo} alt={`${team} logo`} />
        </div>
        <div className="player-modal-hero-bottom">
          <img
            className="player-modal-headshot"
            src={headshotImgUrl}
            alt={`${name} headshot`}
          />
          <div className="selected-rank">
            <span className="selected-rank-num">#{player.rankings[platform].overall}</span>
            <span className="selected-rank-detail">{posRank}</span>
            <span className="selected-rank-platform">{platformName}</span>
          </div>
        </div>
      </div>
      <div className="modal-section">
        <div className="modal-section-header">Rankings by Platform</div>
        <div className="player-modal-rankings">
          {Object.keys(rankings).map(plat => (
            <PlatformStats
              key={plat}
              player={player}
              platform={plat}
              rank={rankings[platform].overall}
              posRank={rankings[platform].position}
              type="modal"
            />
          ))}
        </div>
      </div>
    </Modal>
  );
}
