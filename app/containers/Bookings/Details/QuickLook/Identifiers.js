import React from 'react'
import ValueWithLabel from '../../../../components/ValueWithLabel'

const Identifiers = ({ identifiers }) => {
  const getIdentifierValue = type => {
    const identifier = identifiers && identifiers.size > 0 && identifiers.find(id => id.get('type') === type)

    return identifier ? identifier.get('value') : undefined
  }

  return (
    <>
      <ValueWithLabel label="PNC number">{getIdentifierValue('PNC')}</ValueWithLabel>
      <ValueWithLabel label="CRO number">{getIdentifierValue('CRO')}</ValueWithLabel>
      <ValueWithLabel label="National insurance number">{getIdentifierValue('NINO')}</ValueWithLabel>
      <ValueWithLabel label="Driving licence number">{getIdentifierValue('DL')}</ValueWithLabel>
      <ValueWithLabel label="Home office reference number">{getIdentifierValue('HOREF')}</ValueWithLabel>
    </>
  )
}

export default Identifiers
