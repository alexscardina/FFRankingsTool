import React from 'react';
import PlayerList from './components/PlayerList';
import YourPlayersModal from './components/YourPlayersModal';
import DraftBoardModal from './components/DraftBoardModal';
import LeagueSettingsModal from './components/LeagueSettingsModal';
import data from './data/players.json';
import updatedText from './data/lastUpdated';
import { isYourPick, getTeamIndexForPick } from './utilities';
import { useAppContext } from './Context';

import './styling/App.css';

export default function App() {
  const players = JSON.parse(JSON.stringify(data));
  const {
    sortBy, setSortBy, positionFilter, setPositionFilter,
    isDraftMode, setDraftMode, setTheirTeam, theirTeam, setYourTeam, yourTeam,
    drafted, setDrafted, draftPosition, setDraftPosition, openYourPlayers,
    setOpenYourPlayers, openDraftBoard, setOpenDraftBoard,
    openLeagueSettings, setOpenLeagueSettings, leagueSize, rosterSize,
  } = useAppContext();

  const isRosterFilled = yourTeam.size >= rosterSize;
  const currentPickIndex = drafted.length;
  const onTheClockTeam = getTeamIndexForPick(currentPickIndex, leagueSize) + 1;
  const isYourTurn = isYourPick(currentPickIndex, leagueSize, draftPosition);

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
      if (isYourPick(overallPick, leagueSize, position)) yours.add(id);
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
      <header className="app-header">
        <h1 className="header-text">2026 Fantasy Football Platform Rankings</h1>
        <p className="header-byline">by Alex Scardina</p>
        {isDraftMode && (
          <p className="draft-mode-banner">Draft Mode</p>
        )}
      </header>
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
              <option value="espnOffline">ESPN Offline</option>
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
              <label className="filter-label" htmlFor="draftPosition">Your pick</label>
              <select
                id="draftPosition"
                name="draftPosition"
                value={draftPosition}
                onChange={handleDraftPositionChange}
                className="filter-select filter-select-narrow"
                aria-label="Your draft position"
              >
                {Array.from({ length: leagueSize }, (_, i) => (
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
                onClick={() => setOpenLeagueSettings(true)}
                className="back-to-list-button"
              >
                League Settings
              </button>
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
      {openLeagueSettings && (
        <LeagueSettingsModal
          isOpen={openLeagueSettings}
          onClose={() => setOpenLeagueSettings(false)}
        />
      )}
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
          leagueSize={leagueSize}
          rosterSize={rosterSize}
          draftPosition={draftPosition}
        />
      )}
    </div>
  );
}
