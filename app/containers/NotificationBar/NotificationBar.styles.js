import styled from 'styled-components'
import { TURQUOISE_25, YELLOW_25 } from 'govuk-colours'
import { spacing } from '@govuk-react/lib'

export const Container = styled.div`
  @media only screen and (min-width: 1024px) {
    margin-top: 0;
  }
  margin-top: ${spacing.simple(2)}px;
  margin-bottom: ${spacing.simple(4)}px;
  padding: 12px 12px 12px 18px;
  display: flex;
  background-color: ${props => (props.type === 'Information' ? TURQUOISE_25 : YELLOW_25)};
  justify-content: space-between;
  align-items: center;
`

export const Notification = styled.article`
  padding-right: 10px;
`
