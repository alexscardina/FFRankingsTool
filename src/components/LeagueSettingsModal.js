import React from 'react';
import Modal from 'react-modal';
import { useAppContext } from '../Context';
import { isYourPick } from '../utilities';
import './../styling/Modal.css';

const WR_OPTIONS = [1, 2, 3, 4];
const FLEX_OPTIONS = [0, 1, 2, 3, 4];
const BENCH_OPTIONS = [3, 4, 5, 6, 7, 8];
const LEAGUE_SIZE_OPTIONS = [6, 8, 10, 12, 14, 16];

export default function LeagueSettingsModal({ isOpen, onClose }) {
  const {
    startingWRs,
    setStartingWRs,
    flexSpots,
    setFlexSpots,
    benchSpots,
    setBenchSpots,
    rosterSize,
    leagueSize,
    setLeagueSize,
    draftPosition,
    setDraftPosition,
    drafted,
    setYourTeam,
    setTheirTeam,
  } = useAppContext();

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

  const handleLeagueSizeChange = (event) => {
    const size = Number(event.target.value);
    setLeagueSize(size);
    if (draftPosition > size) {
      setDraftPosition(size);
      rebuildTeamsFromDraft(drafted, size);
    } else {
      rebuildTeamsFromDraft(drafted, draftPosition);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="League settings"
      className="app-modal league-settings-modal"
      overlayClassName="app-modal-overlay"
    >
      <div className="modal-header-row">
        <div className="selected-header">League Settings</div>
        <button
          type="button"
          className="modal-close-button"
          onClick={onClose}
          aria-label="Close league settings"
        >
          Close
        </button>
      </div>

      <div className="modal-section">
        <div className="modal-section-header">Roster Construction</div>
        <div className="league-settings-list">
          <div className="league-settings-row">
            <label className="league-settings-label" htmlFor="leagueSize">League size</label>
            <select
              id="leagueSize"
              name="leagueSize"
              value={leagueSize}
              onChange={handleLeagueSizeChange}
              className="filter-select filter-select-narrow"
              aria-label="League size"
            >
              {LEAGUE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="league-settings-row">
            <label className="league-settings-label" htmlFor="startingWRs">
              Starting WRs
            </label>
            <select
              id="startingWRs"
              className="filter-select filter-select-narrow"
              value={startingWRs}
              onChange={(event) => setStartingWRs(Number(event.target.value))}
            >
              {WR_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="league-settings-row">
            <label className="league-settings-label" htmlFor="flexSpots">
              FLEX spots
            </label>
            <select
              id="flexSpots"
              className="filter-select filter-select-narrow"
              value={flexSpots}
              onChange={(event) => setFlexSpots(Number(event.target.value))}
            >
              {FLEX_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="league-settings-row">
            <label className="league-settings-label" htmlFor="benchSpots">
              Bench spots
            </label>
            <select
              id="benchSpots"
              className="filter-select filter-select-narrow"
              value={benchSpots}
              onChange={(event) => setBenchSpots(Number(event.target.value))}
            >
              {BENCH_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="league-settings-summary">
          Roster size: <strong>{rosterSize}</strong>
          <span className="league-settings-summary-detail">
            (1 QB · 2 RB · {startingWRs} WR · 1 TE · {flexSpots} FLEX · {benchSpots} BN)
          </span>
        </div>
      </div>
    </Modal>
  );
}
