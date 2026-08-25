import React from 'react';
import { getStylizedPlatformName } from './../utilities';

const findClassName = difference => {
  return difference > 0 ? "stats-difference-pos" : 
  difference < 0 ? "stats-difference-neg" : "stats-difference";
}

function PlatformStatsModal({ player, platform, rank, posRank }) {
  const difference = rank - player.rankings[platform].overall;
  const posDifference = posRank - player.rankings[platform].position;
  const differenceClassName = findClassName(difference);
  const posDiffClassName = findClassName(posDifference);
  const stylizedPlatform = getStylizedPlatformName(platform);
  return (
    <div className="modal-platform-row">
      <div className="modal-platform-name">{stylizedPlatform}</div>
      <div className="modal-platform-stat">
        <span>Rank {player.rankings[platform].overall}</span>
        <div className={differenceClassName}>{difference}</div>
      </div>
      <div className="modal-platform-stat">
        <span>{`${player.position}${player.rankings[platform].position}`}</span>
        <div className={posDiffClassName}>{posDifference}</div>
      </div>
    </div>
  );
}

function PlatformStatsCard({ player, platform, rank, posRank }) {
  const difference = rank - player.rankings[platform].overall;
  const posDifference = posRank - player.rankings[platform].position;
  const differenceClassName = findClassName(difference);
  const posDiffClassName = findClassName(posDifference);
  return (
    <>
      <div className="platform-stats">
        <div>Rank: {player.rankings[platform].overall}</div>
        <div style={{flexGrow: 1}} />
        <div className={differenceClassName}>{difference}</div>
      </div>
      <div className="platform-stats">
        <div>{`${player.position}${player.rankings[platform].position}`}</div>
        <div style={{flexGrow: 1}} />
        <div className={posDiffClassName}>{posDifference}</div>
      </div>
    </>
  )
}

export default function PlatformStats({ player, platform, rank, posRank, type }) {
  if (type === 'modal') return <PlatformStatsModal player={player} platform={platform} rank={rank} posRank={posRank} />;
  else return <PlatformStatsCard player={player} platform={platform} rank={rank} posRank={posRank} />;
}
