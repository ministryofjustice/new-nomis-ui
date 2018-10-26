import styled from 'styled-components'
import allColours from '../../../../theme/colours'
import { responsiveCols } from '../../../CommonTheme/responsiveColumns'

const colours = allColours.bookings.details.caseNotes.list

export const DateTimeIdBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-self: flex-start;
  justify-content: space-between;
`

export const DateTimeBlock = styled.div`
  font-weight: bold;
`

export const DateBlock = styled.div`
  font-size: 14px;
`

export const TimeBlock = styled.div`
  font-size: 12px;
`

export const MiddleBlock = styled.div`
  align-self: flex-start;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: ${responsiveCols(8)};
`

export const TypeAndText = styled.div``

export const TypeDescription = styled.div`
  padding-top: 5px;
  font-size: 19px;
  font-weight: bold;
  margin-bottom: 10px;
`

export const CaseNoteText = styled.div`
  font-size: 18px;
  margin-bottom: 20px;
`

export const AssignedOfficer = styled.div`
  font-size: 16px;
  color: ${colours.altTextColour};
`

export const AmendmentListBlock = styled.div`
  background: ${colours.amendments.backgroundColour};
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 10px 10px 0px 10px;
`

export const AmendmentSection = styled.div``

export const AmendmentSubSection = styled.div`
  width: 100%
  font-weight: bold;
`

export const PreStyle = styled.pre`
  font-family: nta, Arial, sans-serif;
  white-space: pre-wrap;
`
