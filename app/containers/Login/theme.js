import styled from 'styled-components';
import { mfmedia } from 'utils/style-utils';

export const Form = styled.form`
  position: relative;
  
  width: 100%;
  ${mfmedia.desktop`width: 430px;`}
  
  margin: auto;
  ${mfmedia.desktop`margin: 0 20px;`}
  
  padding: 0px 20px;
  padding-bottom: 150px;
  ${mfmedia.desktop`padding: 0;`}
  
  button {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 60px;
    margin-bottom: 0;
  }
  
  ${mfmedia.desktop`button {
    position: relative;
    bottom: initial;
    left: initial;
    width: auto;
    height: initial;
    margin-bottom: 15px;
  }`}
`;
