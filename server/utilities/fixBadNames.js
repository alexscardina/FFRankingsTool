const fixBadNames = name => {
  switch (name) {
    case 'Aaron Jones': return 'Aaron Jones Sr.';
    case 'Patrick Mahomes': return 'Patrick Mahomes II';
    case 'Anthony Richardson': return 'Anthony Richardson Sr.';
    case 'Chigoziem Okonkwo': return 'Chig Okonkwo';
    case 'Cameron Skattebo': return 'Cam Skattebo';
    case 'D.K. Metcalf': return 'DK Metcalf';
    case 'D.J. Moore': return 'DJ Moore';
    case 'Travis Etienne': return 'Travis Etienne Jr.';
    case 'Deebo Samuel': return 'Deebo Samuel Sr.';
    case 'Demario Douglas': return 'DeMario Douglas';
    case 'Kyle Pitts Sr.': return 'Kyle Pitts';
    case 'Kenneth Walker': return 'Kenneth Walker III';
    case 'Marvin Harrison': return 'Marvin Harrison Jr.';
    case 'Brian Robinson': return 'Brian Robinson Jr.';
    case 'Tyrone Tracy': return 'Tyrone Tracy Jr.';
    case 'Michael Pittman': return 'Michael Pittman Jr.';
    case 'Luther Burden': return 'Luther Burden III';
    case 'Michael Penix': return 'Michael Penix Jr.';
    case 'Marvin Mims': return 'Marvin Mims Jr.';
    case 'Marquise Brown': return 'Hollywood Brown';
    case 'Calvin Austin': return 'Calvin Austin III';
    case "Dont'e Thornton": return "Dont'e Thornton Jr.";
    case "Brian Thomas": return "Brian Thomas Jr.";
    default: 
      break;
  }
  return name;
};

module.exports = fixBadNames;