import styled from 'styled-components';
import { media } from 'utils/style-utils';

export const Form = styled.form`
  position: relative;
  
  width: 100%;
  ${media.desktop`width: 430px;`}
  
  margin: auto;
  ${media.desktop`margin: 0 20px;`}
  
  padding: 0px 20px;
  padding-bottom: 150px;
  ${media.desktop`padding: 0;`}
  
  button {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 60px;
    margin-bottom: 0;
  }
  
  ${media.desktop`button {
    position: relative;
    bottom: initial;
    left: initial;
    width: auto;
    height: initial;
    margin-bottom: 15px;
  }`}
`;
