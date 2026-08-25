import React from 'react';
import { getTeamLogo, getPlayerHeadshot } from './../utilities';
import './../styling/PlayerCard.css';
import PlatformStats from './PlatformStats';

export default function PlayerCard({
  player,
  onClick,
  platform,
  isDraftMode,
  onDraft,
  isYourTurn,
  isRosterFilled,
}) {
  const { id, name, position, team, bye } = player;
  const rank = player.rankings[platform].overall;
  const posRank = player.rankings[platform].position;
  const teamLogo = getTeamLogo(team);
  const headshotImgUrl = getPlayerHeadshot(name);
  const positionString = `${position}${posRank}`;
  const playerCardClass = isDraftMode ? 'player-card-draft' : 'player-card';
  const positionCircleClass = `${position.toLowerCase()}-circle`;
  const draftDisabled = isYourTurn && isRosterFilled;

  return (
    <>
      {isDraftMode && (
        <div className="draft-actions">
          <button
            type="button"
            onClick={() => onDraft(id)}
            className={`draft-pick-button${isYourTurn ? ' draft-pick-button-yours' : ''}`}
            disabled={draftDisabled}
          >
            Draft
          </button>
        </div>
      )}
      <div
        className={`${playerCardClass} player-card-pos-${position.toLowerCase()}`}
        onClick={onClick}
      >
        <div className="player-rank">#{rank}</div>
        <div className="player-identity">
          <img className="player-headshot" alt={`${name} headshot`} src={headshotImgUrl} />
          <div className="player-info">
            <div className="player-name-row">
              <div className="player-name">{name}</div>
              <img
                src={teamLogo}
                alt={`${team} logo`}
                className="team-logo"
              />
            </div>
            <div className="player-meta">
              <span className={`player-pos-badge ${positionCircleClass}`}>{positionString}</span>
              <span className="player-meta-sep">{team}</span>
              <span className="player-meta-sep">Bye {bye}</span>
            </div>
          </div>
        </div>
        <div className="player-stats-grid">
          <div className="player-stats">
            <div className="player-stats-label">Rotowire NFC</div>
            <PlatformStats
              player={player}
              platform="nfc"
              rank={rank}
              posRank={posRank}
            />
          </div>
          <div className="player-stats">
            <div className="player-stats-label">ESPN</div>
            <PlatformStats
              player={player}
              platform="espn"
              rank={rank}
              posRank={posRank}
            />
          </div>
          <div className="player-stats">
            <div className="player-stats-label">FantasyPros</div>
            <PlatformStats
              player={player}
              platform="fantasypros"
              rank={rank}
              posRank={posRank}
            />
          </div>
          <div className="player-stats">
            <div className="player-stats-label">DraftSharks</div>
            <PlatformStats
              player={player}
              platform="draftsharks"
              rank={rank}
              posRank={posRank}
            />
          </div>
          <div className="player-stats">
            <div className="player-stats-label">Sleeper</div>
            <PlatformStats
              player={player}
              platform="sleeper"
              rank={rank}
              posRank={posRank}
            />
          </div>
          <div className="player-stats">
            <div className="player-stats-label">Yahoo</div>
            <PlatformStats
              player={player}
              platform="yahoo"
              rank={rank}
              posRank={posRank}
            />
          </div>
        </div>
      </div>
    </>
  );
}
