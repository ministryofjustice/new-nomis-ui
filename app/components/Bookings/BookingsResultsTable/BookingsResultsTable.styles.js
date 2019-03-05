import styled, { css } from 'styled-components'
import { BREAKPOINTS } from '@govuk-react/constants'
import Table from '@govuk-react/table'

export const StyledTable = styled(Table)`
  td,
  th {
    @media print {
      font-size: 14px;
    }
  }
`

export const customCellStyles = css`
  display: ${props => (props.desktopOnly ? 'none' : 'table-cell')};
  word-break: initial;

  @media print, (min-width: ${BREAKPOINTS.DESKTOP}) {
    display: table-cell;
  }
`

export const StyledCellHeader = styled(Table.CellHeader)`
  ${customCellStyles}

  span {
    cursor: pointer;

    @media print, (min-width: ${BREAKPOINTS.DESKTOP}) {
      display: none;
    }
  }
`

export const StyledCell = styled(Table.Cell)`
  ${customCellStyles}
`

export const FlagsContainer = styled.div`
  [class$='status'] {
    display: block;
  }
`
