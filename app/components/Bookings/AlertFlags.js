import React from 'react'
import { linkOnClick } from '../../helpers'

const AlertFlags = (alerts, divClassName, onAlertFlagClick) => {
  function isShown(code) {
    if (alerts) {
      return alerts.some(alert => {
        if (alert.get) {
          if (!alert.get('expired')) {
            if (alert.get('alertCode') === code) return true
          }
        } else if (alert === code) return true
        return false
      })
    }
    return false
  }

  return (
    <div className={divClassName}>
      {isShown('HA') && (
        <span className="acct-status" {...linkOnClick(onAlertFlagClick)}>
          ACCT OPEN
        </span>
      )}
      {isShown('XSA') && (
        <span className="assault-status" {...linkOnClick(onAlertFlagClick)}>
          STAFF ASSAULTER
        </span>
      )}
      {isShown('XA') && (
        <span className="arsonist-status" {...linkOnClick(onAlertFlagClick)}>
          <img src="/img/Arsonist_icon.png" className="flag-arsonist-icon" alt="" width="13" height="16" /> ARSONIST
        </span>
      )}
      {isShown('PEEP') && (
        <span className="disability-status" {...linkOnClick(onAlertFlagClick)}>
          <img src="/img/Disability_icon.png" className="disability-adjust" alt="" width="19" height="21" /> PEEP
        </span>
      )}
      {isShown('XEL') && (
        <span className="elist-status" {...linkOnClick(onAlertFlagClick)}>
          E-LIST
        </span>
      )}
      {isShown('XRF') && (
        <span className="risk-females-status" {...linkOnClick(onAlertFlagClick)}>
          RISK TO FEMALES
        </span>
      )}
      {isShown('XTACT') && (
        <span className="tact-status" {...linkOnClick(onAlertFlagClick)}>
          TACT
        </span>
      )}
    </div>
  )
}

const AssessmentFlags = (category, divClassName) => (
  <div className={divClassName}>{category === 'A' && <span className="cata-status">CAT A</span>}</div>
)

const flags = { AlertFlags, AssessmentFlags }
export default flags
