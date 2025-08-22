import React from 'react';
import Modal from 'react-modal';
import './../styling/Modal.css';

export default function YourPlayersModal({ isOpen, onClose, yourPlayers }) {
  console.log(yourPlayers);
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
      <div>Your Team:</div>
      <div className="modal=section">
        {yourPlayers.map(player => {
          return (
            <div>
              <li>{player.name}</li>
            </div>
          );
        })}
      </div>
    </Modal>
  )
}