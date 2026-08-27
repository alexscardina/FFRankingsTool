import React from 'react';

export const AppContext = React.createContext();

const FIXED_STARTERS = 4; // QB + 2 RB + TE

function useState() {
  const [sortBy, setSortBy] = React.useState('espn');
  const [positionFilter, setPositionFilter] = React.useState(undefined);
  const [isDraftMode, setDraftMode] = React.useState(false);
  const [theirTeam, setTheirTeam] = React.useState(new Set());
  const [yourTeam, setYourTeam] = React.useState(new Set());
  const [drafted, setDrafted] = React.useState([]);
  const [draftPosition, setDraftPosition] = React.useState(1);
  const [openYourPlayers, setOpenYourPlayers] = React.useState(false);
  const [openDraftBoard, setOpenDraftBoard] = React.useState(false);
  const [openLeagueSettings, setOpenLeagueSettings] = React.useState(false);
  const [leagueSize, setLeagueSize] = React.useState(12);
  const [startingWRs, setStartingWRs] = React.useState(2);
  const [flexSpots, setFlexSpots] = React.useState(2);
  const [benchSpots, setBenchSpots] = React.useState(5);

  const rosterSize = FIXED_STARTERS + startingWRs + flexSpots + benchSpots;

  return {
    sortBy,
    setSortBy,
    positionFilter,
    setPositionFilter,
    isDraftMode,
    setDraftMode,
    theirTeam,
    setTheirTeam,
    yourTeam,
    setYourTeam,
    drafted,
    setDrafted,
    draftPosition,
    setDraftPosition,
    openYourPlayers,
    setOpenYourPlayers,
    openDraftBoard,
    setOpenDraftBoard,
    openLeagueSettings,
    setOpenLeagueSettings,
    leagueSize,
    setLeagueSize,
    startingWRs,
    setStartingWRs,
    flexSpots,
    setFlexSpots,
    benchSpots,
    setBenchSpots,
    rosterSize,
  };
}

export function useAppContext() {
  const state = React.useContext(AppContext);
  return state;
}

export function AppContextProvider({ children }) {
  return (
    <AppContext.Provider value={useState()}>
      {children}
    </AppContext.Provider>
  );
}
