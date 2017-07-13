import styled from 'styled-components';
import { media } from '../../utils/style-utils';

export const Form = styled.form`
  position: relative;
  
  width: 430px;
  ${media.mobile`width: 100%;`}
  
  margin: 0 20px;
  ${media.mobile`margin: auto;`}
  
  ${media.mobile`padding: 0px 20px;`}
  ${media.mobile`padding-bottom: 150px;`}
  
  ${media.mobile`button {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    font-size: 32px;
    height: 120px;
  }`}
  
  ${media.mobile`label {
    font-size: 30px;
  }`}

  ${media.mobile`input {
    height: 75px;
    font-size: 22px;
    margin-bottom: 5px;
  }`}

  ${media.mobile`span {
    margin-bottom: 25px;
  }`}
`;
