import React from 'react';
import PlayerList from './components/PlayerList';
import YourPlayersModal from './components/YourPlayersModal';
import DraftBoardModal from './components/DraftBoardModal';
import data from './data/players.json';
import updatedText from './data/lastUpdated';
import { isYourPick, getTeamIndexForPick } from './utilities';

import './styling/App.css';

const LEAGUE_SIZE = 12;
const ROSTER_SIZE = 13;

export default function App() {
  const players = JSON.parse(JSON.stringify(data));
  const [sortBy, setSortBy] = React.useState('espn');
  const [positionFilter, setPositionFilter] = React.useState(undefined);
  const [isDraftMode, setDraftMode] = React.useState(false);
  const [theirTeam, setTheirTeam] = React.useState(new Set());
  const [yourTeam, setYourTeam] = React.useState(new Set());
  const [drafted, setDrafted] = React.useState([]);
  const [draftPosition, setDraftPosition] = React.useState(1);
  const [openYourPlayers, setOpenYourPlayers] = React.useState(false);
  const [openDraftBoard, setOpenDraftBoard] = React.useState(false);

  const isRosterFilled = yourTeam.size >= ROSTER_SIZE;
  const currentPickIndex = drafted.length;
  const onTheClockTeam = getTeamIndexForPick(currentPickIndex, LEAGUE_SIZE) + 1;
  const isYourTurn = isYourPick(currentPickIndex, LEAGUE_SIZE, draftPosition);

  if (isDraftMode) document.body.style.backgroundColor = '#4d6e50';
  else document.body.style.backgroundColor = '#555d68';

  const handlePositionFilterChange = (event) => {
    const value = event.target.value;
    value === 'null' ? setPositionFilter(null) : setPositionFilter(value);
  };

  const rebuildTeamsFromDraft = React.useCallback((draftedIds, position) => {
    const yours = new Set();
    const theirs = new Set();
    draftedIds.forEach((id, overallPick) => {
      if (isYourPick(overallPick, LEAGUE_SIZE, position)) yours.add(id);
      else theirs.add(id);
    });
    setYourTeam(yours);
    setTheirTeam(theirs);
  }, []);

  const handleDraftPositionChange = (event) => {
    const position = Number(event.target.value);
    setDraftPosition(position);
    rebuildTeamsFromDraft(drafted, position);
  };

  const handleDraft = (id) => {
    if (isYourTurn && isRosterFilled) return;
    const next = [...drafted, id];
    setDrafted(next);
    rebuildTeamsFromDraft(next, draftPosition);
  };

  const handleDraftMode = () => {
    setDraftMode(!isDraftMode);
  };

  const displayedPlayers = React.useMemo(() => {
    let list = players;

    if (isDraftMode) {
      list = players.filter((p) => !theirTeam.has(p.id) && !yourTeam.has(p.id));
    }

    if (positionFilter) list = list.filter((p) => p.position === positionFilter);

    list.sort((a, b) => a.rankings[sortBy].overall - b.rankings[sortBy].overall);

    return list;
  }, [players, theirTeam, yourTeam, positionFilter, sortBy, isDraftMode]);

  return (
    <div>
      <p className="header-text">2026 Fantasy Football Platform Rankings</p>
      <h3 className="header-byline">by Alex Scardina</h3>
      {isDraftMode && (
        <p className="header-text-red draft-mode-banner">DRAFT MODE</p>
      )}
      <div className="toolbar">
        <div className="toolbar-row">
          <div className="toolbar-group">
            <label className="filter-label" htmlFor="sortBy">Sort by rankings</label>
            <select
              id="sortBy"
              name="sortBy"
              onChange={(event) => setSortBy(event.target.value)}
              className="filter-select"
              value={sortBy}
            >
              <option value="espn">ESPN</option>
              <option value="nfc">Rotowire NFC</option>
              <option value="fantasypros">FantasyPros</option>
              <option value="draftsharks">DraftSharks</option>
              <option value="sleeper">Sleeper</option>
              <option value="yahoo">Yahoo</option>
            </select>
          </div>

          <div className="toolbar-group">
            <label className="filter-label" htmlFor="positionFilter">Filter by position</label>
            <select
              id="positionFilter"
              name="positionFilter"
              value={positionFilter || 'null'}
              onChange={handlePositionFilterChange}
              className="filter-select"
            >
              <option value="null"></option>
              <option value="QB">QB</option>
              <option value="RB">RB</option>
              <option value="WR">WR</option>
              <option value="TE">TE</option>
            </select>
            <button
              type="button"
              onClick={() => setPositionFilter(null)}
              className="clear-button"
            >
              Clear
            </button>
          </div>

          <div className="toolbar-group">
            <button
              type="button"
              onClick={handleDraftMode}
              className={isDraftMode ? 'back-to-list-button' : 'draft-mode-button'}
            >
              {isDraftMode ? 'Back to List' : 'DRAFT MODE'}
            </button>
          </div>

          <div className="toolbar-updated">Updated: {updatedText}</div>
        </div>

        {isDraftMode && (
          <div className="toolbar-row toolbar-row-draft">
            <div className="toolbar-group">
              <div style={{ display: 'flex', flexGrow: 1 }}></div>
              <label className="filter-label" htmlFor="draftPosition">Your pick</label>
              <select
                id="draftPosition"
                name="draftPosition"
                value={draftPosition}
                onChange={handleDraftPositionChange}
                className="filter-select filter-select-narrow"
                aria-label="Your draft position"
              >
                {Array.from({ length: LEAGUE_SIZE }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <span className={`draft-on-clock${isYourTurn ? ' draft-on-clock-yours' : ''}`}>
              Pick {currentPickIndex + 1} · Team {onTheClockTeam}
              {isYourTurn ? ' · Your turn' : ''}
            </span>

            <div className="toolbar-group">
              <button
                type="button"
                onClick={() => setOpenYourPlayers(true)}
                className="draft-mode-button"
              >
                View Your Team
              </button>
              <button
                type="button"
                onClick={() => setOpenDraftBoard(true)}
                className="draft-mode-button"
              >
                View Draft Board
              </button>
            </div>
          </div>
        )}
      </div>
      <PlayerList
        players={displayedPlayers}
        sortBy={sortBy}
        isDraftMode={isDraftMode}
        onDraft={handleDraft}
        isYourTurn={isYourTurn}
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
          leagueSize={LEAGUE_SIZE}
          rosterSize={ROSTER_SIZE}
          draftPosition={draftPosition}
        />
      )}
    </div>
  );
}
