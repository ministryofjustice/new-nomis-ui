import styled from 'styled-components'
import colours from 'theme/colours'

export const QueryForm = styled.form`
  position: relative;
  padding: 15px;
  background: ${colours.filterBlocks.background};
`

export const QueryWrapper = styled.div`
  position: relative;
  padding: 15px;
  background: ${colours.filterBlocks.background};
`

export const QueryItemHolder = styled.div`
  width: 25%;
  height: 64px;
  margin: 0px 0px 0px;
  padding: 0px 15px;
  float: left;

  &:not(:nth-child(6n)) {
    border-right: 1px solid #d9d9d9;
  }

  label {
    color: #4d4d4d;
    font-size: 16px;
  }

  querylabel {
    color: #4d4d4d;
    font-size: 16px;
  }

  input {
    height: 40px;
  }

  .Select-control {
    height: 40px;
    display: block;
  }

  .Select-placeholder {
    margin-top: -7px;
  }
`

export const QueryValue = styled.div`
  position: relative;
  padding-top: 3px;
  font-size: 26px;
  background: ${colours.filterBlocks.background};
`

export const QueryValueScroll = styled(QueryValue)`
  position: relative;
  padding-top: 3px;
  font-size: 26px;
  background: ${colours.filterBlocks.background};
  height: 38px;
  overflow-y: scroll;
`
