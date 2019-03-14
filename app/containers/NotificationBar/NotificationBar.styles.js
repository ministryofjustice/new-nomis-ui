import styled from 'styled-components'
import { LIGHT_BLUE, YELLOW } from 'govuk-colours'
import { MEDIA_QUERIES } from '@govuk-react/constants'

export const Container = styled.div`
  ${MEDIA_QUERIES.LARGESCREEN} {
    margin-top: 15px;
  }
  margin-top: 25px;
  padding: 9px;
  display: flex;
  border: 2px solid ${props => (props.type === 'Information' ? LIGHT_BLUE : YELLOW)};
  justify-content: space-between;
  align-items: center;
`
export const Notification = styled.article``
