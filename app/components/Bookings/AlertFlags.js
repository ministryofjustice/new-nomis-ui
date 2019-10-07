import React from 'react'
import { linkOnClick } from '../../helpers'

const AlertFlags = (alerts, divClassName, onAlertFlagClick) => {
  // eslint-disable-next-line global-require
  const alertFlags = require('./alertFlags.json')

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
      {alertFlags &&
        alertFlags.map(alert => {
          return (
            <>
              {isShown(alert.alertCode) && (
                <span className={alert.className} {...linkOnClick(onAlertFlagClick)}>
                  {alert.img && <img src={alert.img} className={alert.imgClass} alt="" width="11" height="14" />}
                  {alert.label.toUpperCase()}
                </span>
              )}
            </>
          )
        })}
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
  if (!category) {
    return <strong>--</strong>
  }
  if (!['A', 'E', 'H', 'P'].includes(category)) {
    return <strong>{categoryDesc}</strong>
  }
  return AssessmentFlags(category, divClassName)
}

const flags = { AlertFlags, AssessmentFlags, AssessmentFlagsOrLetter }
export default flags
