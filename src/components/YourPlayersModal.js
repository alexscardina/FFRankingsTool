import React from 'react';
import Modal from 'react-modal';
import data from './../data/players.json';
import './../styling/Modal.css';

export default function YourPlayersModal({ isOpen, onClose, yourTeam }) {
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
      if (rbCount >= 2 && flexCount >= 2) {
        yourBench.push(player);
      }
      if (rbCount >= 2 && flexCount < 2) {
        flexCount = flexCount + 1;
        yourFLEXs.push(player);
      } else rbCount = rbCount + 1;
    }
    if (player.position === 'WR') {
      if (wrCount >= 2 && flexCount >= 2) {
        yourBench.push(player);
      }
      if (wrCount >= 2 && flexCount < 2) {
        flexCount = flexCount + 1;
        yourFLEXs.push(player);
      } else wrCount = wrCount + 1;
    }
    if (player.position === 'TE') {
      if (teCount >= 1 && flexCount >= 2) {
        yourBench.push(player);
      }
      if (teCount >= 1 && flexCount < 2) {
        flexCount = flexCount + 1;
        yourFLEXs.push(player);
      } else teCount = teCount + 1;
    }
  });
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel='Your team'
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '500px',
          padding: '20px',
          borderRadius: '10px',
        },
      }}
    >
      <div style={{display: "flex"}}>
        <div className="qb-box">QB</div>
        <div className="your-player">{yourQBs.length > 0 ? yourQBs[0].name : ''}</div>
      </div>
      <div style={{display: "flex"}}>
        <div className="rb-box">RB</div>
        <div className="your-player">{yourRBs.length > 0 ? yourRBs[0].name : ''}</div>
      </div>
      <div style={{display: "flex"}}>
        <div className="rb-box">RB</div>
        <div className="your-player">{yourRBs.length > 1 ? yourRBs[1].name : ''}</div>
      </div>
      <div style={{display: "flex"}}>
        <div className="wr-box">WR</div>
        <div className="your-player">{yourWRs.length > 0 ? yourWRs[0].name : ''}</div>
      </div>
      <div style={{display: "flex"}}>
        <div className="wr-box">WR</div>
        <div className="your-player">{yourWRs.length > 1 ? yourWRs[1].name : ''}</div>
      </div>
      <div style={{display: "flex"}}>
        <div className="te-box">TE</div>
        <div className="your-player">{yourTEs.length > 0 ? yourTEs[0].name : ''}</div>
      </div>
      <div style={{display: "flex"}}>
        <div className="flx-box">FLEX</div>
        <div className="your-player">{yourFLEXs.length > 0 ? yourFLEXs[0].name : ''}</div>
      </div>
      <div style={{display: "flex"}}>
        <div className="flx-box">FLEX</div>
        <div className="your-player">{yourFLEXs.length > 1 ? yourFLEXs[1].name : ''}</div>
      </div>
      <div style={{display: "flex"}}>
        <div className="bench-box">BN</div>
        <div className="your-player">{yourBench.length > 0 ? yourBench[0].name : ''}</div>
      </div>
      <div style={{display: "flex"}}>
        <div className="bench-box">BN</div>
        <div className="your-player">{yourBench.length > 1 ? yourBench[1].name : ''}</div>
      </div>
      <div style={{display: "flex"}}>
        <div className="bench-box">BN</div>
        <div className="your-player">{yourBench.length > 2 ? yourBench[2].name : ''}</div>
      </div>
      <div style={{display: "flex"}}>
        <div className="bench-box">BN</div>
        <div className="your-player">{yourBench.length > 3 ? yourBench[3].name : ''}</div>
      </div>
      <div style={{display: "flex"}}>
        <div className="bench-box">BN</div>
        <div className="your-player">{yourBench.length > 4 ? yourBench[4].name : ''}</div>
      </div>
    </Modal>
  )
}