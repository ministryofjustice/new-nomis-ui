import styled from 'styled-components';
// import colors from 'theme/colors';
import fonts from 'theme/fonts';
import InlineSVG from 'react-svg-inline';

const height = '60px';
const heightMobile = '90px';

export const Base = styled.div`
  ${fonts.misc}
  display: flex;
  flex-direction: row;
  height: ${height};
  align-items: center;
  justify-content: space-between;
  color: white;
`;

export const BaseMobile = styled.div`
  ${fonts.misc}
  display: flex;
  flex-direction: row;
  height: ${heightMobile};
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
  border-right: solid white 1px;
  margin-right: 15px;
`;

export const Title = styled.a`
  flex-grow: 1;
  color: white;
  font-size: 26px;
  font-weight: bold;
  text-decoration: none;
`;

export const TitleMobile = styled(Title)`
  text-align: center;
  font-size: 42px;
  padding-top: 5px;
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

export const Hamburger = styled(InlineSVG)`
  position: absolute;
  top: 0;
  right: 0;
  display: block;
  padding: 22px 65px;
  width: 40px;
  height: 30px;
  svg {
    display: block;

    width: 40px;
    height: 43px;
    fill: inherit;
  }
`;

export const ArrowBack = styled(InlineSVG)`
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  padding: 22px;
  width: 40px;
  height: 43px;
  svg {
    display: block;

    width: 40px;
    height: 43px;
    fill: inherit;
  }
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
