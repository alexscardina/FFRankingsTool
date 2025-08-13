import React from 'react';
import { getTeamLogo, getPlayerHeadshot } from './../utilities';
import './../styling/PlayerCard.css';
import PlatformStats from './PlatformStats';

export default function PlayerCard({ player, onClick, platform }) {
  const { name, position, team, bye } = player;
  const rank = player.rankings[platform].overall;
  const posRank = player.rankings[platform].position;
  const teamLogo = getTeamLogo(team);
  const headshotImgUrl = getPlayerHeadshot(name);
  const positionString = `${position}${posRank}`;
  return (
    <div className="player-card" onClick={onClick}>
      <div className="player-rank">#{rank}</div>
      <img className="player-headshot" alt={`${name} headshot`} src={headshotImgUrl}/>
      <div style={{display: "flex"}}>
        <div className="player-info">
          <div className="player-name">{name}</div>
          <div className="player-meta">
            {positionString} · {team} · Bye: {bye}
          </div>
        </div>
        <img
          src={teamLogo}
          alt={`${team} logo`}
          className="team-logo"
        />
      </div>
      <div style={{display: "flex", flexGrow: 1}}/>
      <div className="player-stats">
        <div>Rotowire NFC:</div>
        <PlatformStats
          player={player}
          platform="nfc"
          rank={rank}
          posRank={posRank}
        />
      </div>
      <div className="player-stats">
        <div>ESPN:</div>
        <PlatformStats
          player={player}
          platform="espn"
          rank={rank}
          posRank={posRank}
        />
      </div>
      <div className="player-stats">
        <div>FantasyPros:</div>
        <PlatformStats
          player={player}
          platform="fantasypros"
          rank={rank}
          posRank={posRank}
        />
      </div>
      <div className="player-stats">
        <div>DraftSharks:</div>
        <PlatformStats
          player={player}
          platform="draftsharks"
          rank={rank}
          posRank={posRank}
        />
      </div>
      <div className="player-stats">
        <div>Sleeper:</div>
        <PlatformStats
          player={player}
          platform="sleeper"
          rank={rank}
          posRank={posRank}
        />
      </div>
      <div className="player-stats">
        <div>Yahoo:</div>
        <PlatformStats
          player={player}
          platform="yahoo"
          rank={rank}
          posRank={posRank}
        />
      </div>
    </div>
  );
}
