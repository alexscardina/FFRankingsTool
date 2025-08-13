import React from 'react';
import PlayerList from './components/PlayerList';
import data from './data/players.json';
import './styling/App.css';

export default function App() {
  const players = JSON.parse(JSON.stringify(data));
  const [sortBy, setSortBy] = React.useState('espn');
  const [positionFilter, setPositionFilter] = React.useState(null);
  const handlePositionFilterChange = (event) => {
    const value = event.target.value;
    value === "null" ? setPositionFilter(null) : setPositionFilter(value);
  }
  return (
    <div>
      <p className="header-text">2025 Fantasy Football Platform Rankings</p>
      <div style={{display: "flex", marginBottom: "1rem"}}>
        <p className="filter-label">Sort by rankings:</p>
        <select
          name="sortBy"
          onChange={() => setSortBy(event.target.value)}
          className="filter-select"
        >
          <option value="espn">ESPN</option>
          <option value="nfc">Rotowire NFC</option>
          <option value="fantasypros">FantasyPros</option>
          <option value="draftsharks">DraftSharks</option>
          <option value="sleeper">Sleeper</option>
          <option value="yahoo">Yahoo</option>
        </select>
        <p className="filter-label" style={{marginLeft: "5rem"}}>Filter by position:</p>
        <div style={{display: "flex"}}>
          <select
            name="positionFilter"
            value={positionFilter || "null"}
            onChange={handlePositionFilterChange}
            className="filter-select"
          >
            <option value="null" default></option>
            <option value="QB">QB</option>
            <option value="RB">RB</option>
            <option value="WR">WR</option>
            <option value="TE">TE</option>
          </select>
          <button
            onClick={() => setPositionFilter(null)}
            className="clear-button"
          >
            Clear
          </button>
        </div>
      </div>
      <PlayerList
        players={players}
        sortBy={sortBy}
        positionFilter={positionFilter}
      />
    </div>
  );
};
