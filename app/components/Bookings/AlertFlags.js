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
          <img src="/img/Arsonist_icon.png" className="arsonist-adjust" alt="" width="11" height="14" /> ARSONIST
        </span>
      )}
      {isShown('PEEP') && (
        <span className="disability-status" {...linkOnClick(onAlertFlagClick)}>
          <img src="/img/Disability_icon.png" className="disability-adjust" alt="" width="14" height="15" /> PEEP
        </span>
      )}
      {isShown('XEL') && (
        <span className="elist-status" {...linkOnClick(onAlertFlagClick)}>
          E&#x2011;LIST
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
  <div className={divClassName}>
    {(category === 'A' || category === 'E') && <span className="cata-status">CAT A</span>}
    {category === 'H' && <span className="cata-high-status">CAT A High</span>}
    {category === 'P' && <span className="cata-prov-status">CAT A Prov</span>}
  </div>
)

const AssessmentFlagsOrLetter = (category, categoryDesc, divClassName) => {
  if (!['A', 'E', 'H', 'P'].includes(category)) {
    return <strong>{categoryDesc}</strong>
  }
  return AssessmentFlags(category, divClassName)
}

const flags = { AlertFlags, AssessmentFlags, AssessmentFlagsOrLetter }
export default flags
