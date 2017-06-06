import styled from 'styled-components';
import colours from 'theme/colours';
// import fonts from 'theme/fonts';
import desktop from 'theme/desktop';


export const PaginateWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: auto;
  width: 100%;
  max-width: ${desktop.fixWidth}px;
`;

export const PaginateItem = styled.div`
  ${''/* flex-grow: 1; */}
  margin: 0 5px;
  width: 20px;
  height: 20px;
  color: ${({ active }) => active ? 'white' : 'black'};;
  font-size: 16px;
  border-radius: 100%;
  background-color: ${({ active }) => active ? colours.pagination.bg : 'none'};
  text-align: center;
`;
