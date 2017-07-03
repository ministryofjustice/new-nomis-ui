import styled from 'styled-components';
import colours from 'theme/colours';
import desktop from 'theme/desktop';

export const Help = styled.div`
  background: red;
  width: 300px;
  height: 300px;
`;

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direct: row;
  align-items: center;
  justify-content: center;
`;

export const WrapperColumn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px;

  div {
    width: calc(100% - 30px);
  }
`;

export const BlockWrapper = styled.div`
  ${''/*  calculates width to be 470 at full width */}
  width: calc(100%*${desktop.actionBlockWidth}/${desktop.fixWidth});
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${colours.actionBlocks.background};
  padding: 30px;
  box-sizing: border-box;
  border-radius: 15px;
  margin: 20px 15px;

  a {
    width: 533px;
    font-size: 32px;

  }
`;

export const Title = styled.div`
  font-weight: normal;
  font-size: 36px;
`;

export const Description = styled.div`
  flex-grow: 1;
  font-size: 30px
  padding: 20px 0 30px;
`;
