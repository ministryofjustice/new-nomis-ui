import React from 'react'
import { linkOnClick } from '../../helpers'
import alertFlags from './alertFlagValues'

const AlertFlags = (alerts, divClassName, onAlertFlagClick) => {
  function isShown(codes) {
    if (alerts) {
      return alerts.some(alert => {
        if (alert.get) {
          if (!alert.get('expired')) {
            if (codes.includes(alert.get('alertCode'))) return true
          }
        } else if (codes.includes(alert)) return true
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
              {isShown(alert.alertCodes) && (
                <span className={alert.className} {...linkOnClick(onAlertFlagClick)}>
                  {alert.img && <img src={alert.img} className={alert.imgClass} alt={alert.label} />}
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
