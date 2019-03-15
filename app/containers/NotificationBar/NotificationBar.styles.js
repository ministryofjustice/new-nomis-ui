import styled from 'styled-components'
import { TURQUOISE_25, YELLOW_25 } from 'govuk-colours'

export const Container = styled.div`
  @media only screen and (min-width: 1024px) {
    margin-top: 0;
  }
  margin-top: 10px;
  padding: 12px 12px 12px 18px;
  display: flex;
  background-color: ${props => (props.type === 'Information' ? TURQUOISE_25 : YELLOW_25)};
  justify-content: space-between;
  align-items: center;
`

export const Notification = styled.article`
  padding-right: 10px;
`
