import React from 'react';

const alertFlags = (alerts, divClassName, onAlertFlagClick) => {
  let acct = false;
  let assaulter = false;
  let arsonist = false;
  let disability = false;

  function selectFlag(alert) {
    switch (alert) {
      case 'HA':
        acct = true;
        break;
      case 'XSA':
        assaulter = true;
        break;
      case 'XA':
        arsonist = true;
        break;
      case 'PEEP':
        disability = true;
        break;
      default:
    }
  }

  alerts && alerts.forEach(alert => {
    if (alert.get) {
      if (!alert.get('expired')) {
        selectFlag(alert.get('alertCode'));
      }
    } else {
      selectFlag(alert);
    }
  });

  const AlertFlag = ({ className, children }) => (<span className={className} onClick={onAlertFlagClick}>{children}</span>);

  return (<div className={divClassName}>
  {acct && <AlertFlag className="acct-status">ACCT OPEN</AlertFlag>}
  {assaulter && <AlertFlag className="assault-status">STAFF ASSAULTER</AlertFlag>}
  {arsonist && <AlertFlag className="arsonist-status"><img src="/img/Arsonist_icon.png" className="flag-arsonist-icon" alt="" width="13" height="16" /> ARSONIST</AlertFlag>}
  {disability && <AlertFlag className="disability-status"><img src="/img/Disability_icon.png" className="disability-adjust" alt="" width="19" height="21" /> PEEP</AlertFlag>}
</div>);
};

export default alertFlags;