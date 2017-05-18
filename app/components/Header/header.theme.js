import styled from 'styled-components';
// import colors from 'theme/colors';
import fonts from 'theme/fonts';

const height = '60px';

export const Base = styled.div`
  ${fonts.misc}
  display: flex;
  flex-direction: row;
  height: ${height};
  align-items: center;
  justify-content: space-between;
  color: white;
`;

export const Logo = styled.div`
  width: 40px;
  margin-left: 15px;
  padding-bottom: 6px;
`;

export const LogoText = styled.div`
  color: white;
  font-size: 26px;
  padding: 0 15px;
  font-weight: bold;
`;

export const Title = styled.div`
  flex-grow: 1;
  color: white;
  font-size: 26px;
  border-left: solid white 1px;
  padding-left: 15px;
  font-weight: bold;
`;

export const SearchButton = styled.div`
  margin: 0;
  padding: 0 20px;
`;

export const SearchIcon = styled.div`
  margin: 0;
  padding: 0 20px;
`;

export const SearchText = styled.div`
  margin: 0;
  padding: 0 20px;
`;

export const UserMenu = styled.div`
  margin: 0;
  padding: 0 20px;
`;
//
// const LiRef = () => `
//   display: inline-flex;
//   margin: 0 10px;
//   align-items: center;
//   height: ${height};
//   cursor: pointer;
// `;
//
// export const Li = styled.li`
//   ${LiRef}
// `;
//
// export const Hover = styled.li`
//   ${LiRef}
//   position: relative;
//   padding: 0 10px;
//   height: ${height};
//   background: transparent;
//   transition: background 400ms ease;
//   &:hover {
//     background: lighten($ig-blue, 10%);
//   }
// `;
