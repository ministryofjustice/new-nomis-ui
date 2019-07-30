import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { IEPSlip } from 'new-nomis-shared-components'
import { spacing } from '@govuk-react/lib'

const StyledIEPContainer = styled.div`
  padding: ${spacing.simple(3)}px;
`

function IEPContainer() {
  const [iepData, setIepData] = useState()
  const [printed, setPrinted] = useState(false)

  useEffect(() => {
    setIepData(JSON.parse(localStorage.getItem('iepSlip')))

    if (iepData && !printed) {
      window.print()
      setPrinted(true)
    }
  })

  window.onafterprint = () => {
    localStorage.clear()
    window.close()
  }

  return (
    <StyledIEPContainer>
      <IEPSlip {...iepData} />
    </StyledIEPContainer>
  )
}

export default IEPContainer
