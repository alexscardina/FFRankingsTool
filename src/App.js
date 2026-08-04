import React from 'react';
import PlayerList from './components/PlayerList';
import YourPlayersModal from './components/YourPlayersModal';
import DraftBoardModal from './components/DraftBoardModal';
import data from './data/players.json';
import updatedText from './data/lastUpdated';

import './styling/App.css';

export default function App() {
  const players = JSON.parse(JSON.stringify(data));
  const [sortBy, setSortBy] = React.useState('espn');
  const [positionFilter, setPositionFilter] = React.useState(undefined);
  const [isDraftMode, setDraftMode] = React.useState(false);
  const [theirTeam, setTheirTeam] = React.useState(new Set());
  const [yourTeam, setYourTeam] = React.useState(new Set());
  const [drafted, setDrafted] = React.useState([]);
  const [openYourPlayers, setOpenYourPlayers] = React.useState(false);
  const [openDraftBoard, setOpenDraftBoard] = React.useState(false);

  const isRosterFilled = yourTeam.size === 13;

  const handlePositionFilterChange = (event) => {
    const value = event.target.value;
    value === "null" ? setPositionFilter(null) : setPositionFilter(value);
  }
  if (isDraftMode) document.body.style.backgroundColor = '#4d6e50';
  else document.body.style.backgroundColor = '#555d68';
  const handleTheirTeam = id => {
    setTheirTeam((prev) => new Set(prev).add(id));
    setDrafted((prev) => [...prev, id]);
  };
  const handleYourTeam = id => {
    setYourTeam((prev) => new Set(prev).add(id));
    setDrafted((prev) => [...prev, id]);
  };
  const handleDraftMode = () => {
    setDraftMode(!isDraftMode);
  }

  const displayedPlayers = React.useMemo(() => {
    let list = players;

    if (isDraftMode) {
      list = players.filter((p) => !theirTeam.has(p.id) && !yourTeam.has(p.id));
    }

    // filters players by position if selected
    if (positionFilter) list = list.filter((p) => p.position === positionFilter);

    // sorts players by chosen platform
    list.sort((a, b) => a.rankings[sortBy].overall - b.rankings[sortBy].overall);

    return list;
  }, [players, theirTeam, yourTeam, positionFilter, sortBy, isDraftMode]);
  
  return (
    <div>
      <p className="header-text">2026 Fantasy Football Platform Rankings</p>
      <h3 style={{textAlign: "center", marginTop: "-3%"}}>by Alex Scardina</h3>
      {isDraftMode && (
        <p className="header-text-red" style={{marginTop: "-5px"}}>DRAFT MODE</p>
      )}
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
        <div style={{display: "flex", marginLeft: "5rem"}}>
          <button
            onClick={handleDraftMode}
            className={isDraftMode ? 'back-to-list-button' : 'draft-mode-button'}
          >
            {isDraftMode ? 'Back to List' : 'DRAFT MODE'}
          </button>
          <div style={{marginLeft: "5rem"}}/>
          {isDraftMode && (
            <>
              <button
                onClick={() => setOpenYourPlayers(true)}
                className="draft-mode-button"
              >
                View Your Team
              </button>
              <button
                onClick={() => setOpenDraftBoard(true)}
                className="draft-mode-button"
              >
                View Draft Board
              </button>
            </>
          )}
        </div>
        <div style={{display: 'flex', flexGrow: 1}} />
        <div className="filter-label" style={{justifyContent: "flex-end", marginTop: '25px'}}>Updated: {updatedText}</div>
      </div>
      <PlayerList
        players={displayedPlayers}
        sortBy={sortBy}
        isDraftMode={isDraftMode}
        onTheirTeam={handleTheirTeam}
        onYourTeam={handleYourTeam}
        isRosterFilled={isRosterFilled}
      />
      {openYourPlayers && (
        <YourPlayersModal
          isOpen={openYourPlayers}
          yourTeam={yourTeam}
          onClose={() => setOpenYourPlayers(false)}
        />
      )}
      {openDraftBoard && (
        <DraftBoardModal
          isOpen={openDraftBoard}
          onClose={() => setOpenDraftBoard(false)}
          drafted={drafted}
          yourTeam={yourTeam}
          leagueSize={12}
          rosterSize={13}
        />
      )}
    </div>
  );
};
