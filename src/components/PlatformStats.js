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
    <>
      <div className="wrapper">
        <div>{stylizedPlatform}</div>
        <div style={{display: 'flex'}}>
          Rank: {player.rankings[platform].overall}
          <div style={{display: 'flex', flexGrow: 1}} />
          <div class={differenceClassName}>{difference}</div>
        </div>
        <div style={{display: 'flex', flexGrow: 1}} />
        <div style={{display: 'flex'}}>
          {`${player.position}${player.rankings[platform].position}`} 
          <div style={{display: 'flex', flexGrow: 1}} />
          <div class={posDiffClassName}>{posDifference}</div>
        </div>
      </div>
    </>
  )
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
        <div class={differenceClassName}>{difference}</div>
      </div>
      <div className="platform-stats">
        <div>{`${player.position}${player.rankings[platform].position}`}</div>
        <div style={{flexGrow: 1}} />
        <div class={posDiffClassName}>{posDifference}</div>
      </div>
    </>
  )
}

export default function PlatformStats({ player, platform, rank, posRank, type }) {
  if (type === 'modal') return <PlatformStatsModal player={player} platform={platform} rank={rank} posRank={posRank} />;
  else return <PlatformStatsCard player={player} platform={platform} rank={rank} posRank={posRank} />;
}
