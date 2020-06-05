export default [
  { alertCodes: ['HA'], className: 'acct-status', label: 'ACCT open', img: '', imgClass: '' },
  {
    alertCodes: ['HA1'],
    className: 'acct-post-closure-status',
    label: 'ACCT post closure',
    img: '',
    imgClass: '',
  },
  { alertCodes: ['XSA'], className: 'assault-status', label: 'Staff assaulter', img: '', imgClass: '' },
  {
    alertCodes: ['XA'],
    className: 'arsonist-status',
    label: 'Arsonist',
    img: '/img/Arsonist_icon.png',
    imgClass: 'arsonist-adjust',
  },
  {
    alertCodes: ['PEEP'],
    className: 'disability-status',
    label: 'PEEP',
    img: '/img/Disability_icon.png',
    imgClass: 'disability-adjust',
  },
  { alertCodes: ['XEL'], className: 'elist-status', label: 'E-list', img: '', imgClass: '' },
  { alertCodes: ['XRF'], className: 'risk-females-status', label: 'Risk to females', img: '', imgClass: '' },
  { alertCodes: ['XTACT'], className: 'tact-status', label: 'TACT', img: '', imgClass: '' },
  {
    alertCodes: ['XCO'],
    className: 'corruptor-status',
    label: 'Corruptor',
    img: '/img/CU_icon.png',
    imgClass: 'corruptor-adjust',
  },
  {
    alertCodes: ['XCA'],
    className: 'chemical-attacker-status',
    label: 'Chemical attacker',
    img: '',
    imgClass: '',
  },
  {
    alertCodes: ['XCI'],
    className: 'concerted-indiscipline-status',
    label: 'Concerted indiscipline',
    img: '',
    imgClass: '',
  },
  { alertCodes: ['XR'], className: 'racist-status', label: 'Racist', img: '', imgClass: '' },
  { alertCodes: ['RTP', 'RLG'], className: 'risk-lgbt-status', label: 'Risk to LGBT', img: '', imgClass: '' },
  { alertCodes: ['XHT'], className: 'hostage-taker-status', label: 'Hostage taker', img: '', imgClass: '' },
  {
    alertCodes: ['XCU'],
    className: 'controlled-unlock-status',
    label: 'Controlled unlock',
    img: '',
    imgClass: '',
  },
  { alertCodes: ['XGANG'], className: 'gang-member-status', label: 'Gang member', img: '', imgClass: '' },
  { alertCodes: ['CSIP'], className: 'csip-status', label: 'CSIP', img: '', imgClass: '' },
  { alertCodes: ['F1'], className: 'veteran-status', label: 'Veteran', img: '', imgClass: '' },
  {
    alertCodes: ['LCE'],
    className: 'care-experienced-status',
    label: 'Care experienced',
    img: '',
    imgClass: '',
  },
  {
    alertCodes: ['RNO121'],
    className: 'no-one-to-one-status',
    label: 'No one-to-one',
    img: '',
    imgClass: '',
  },
  { alertCodes: ['RCON'], className: 'conflict-status', label: 'Conflict', img: '', imgClass: '' },

  {
    alertCodes: ['URCU'],
    className: 'reverse-cohorting-unit',
    label: 'Reverse Cohorting Unit',
    img: '',
    imgClass: '',
  },
  {
    alertCodes: ['UPIU'],
    className: 'protective-isolation-unit',
    label: 'Protective Isolation Unit',
    img: '',
    imgClass: '',
  },
  { alertCodes: ['USU'], className: 'shielding-unit', label: 'Shielding Unit', img: '', imgClass: '' },
  { alertCodes: ['URS'], className: 'refusing-to-shield', label: 'Refusing to shield', img: '', imgClass: '' },
].sort((a, b) => a.label.localeCompare(b.label))
