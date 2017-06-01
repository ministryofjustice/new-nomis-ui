import styled from 'styled-components';
import colours from 'theme/colours';
// import DW from 'components/CommonTheme/DesktopWrapper';


const Base = () => `
  box-sizing: border-box;
  font-family: "nta", Arial, sans-serif;
  font-weight: 400;
  text-transform: none;
  font-size: 16px;
  line-height: 1.25;
  width: 100%;
  background: ${colours.forms.textInput.background};
  padding: 5px 4px 4px;
  margin: 5px 0;
  border: 2px solid ${colours.forms.textInput.border};
`;

export const DesktopWrapper = styled.div`
  max-width: 1170px;
  margin: auto;
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
`;

export const Wrapper = styled.div`
  ${''/* margin: 100px auto 0; */}
  width: 100%;
  max-width: 1170px;
  padding: 0 20px;
`;

export const Form = styled.form`
  width: 430px;
  margin: 0 auto;
  position: relative;
`;

export const Input = styled.input`
  ${Base}
  &:focus {
    outline: 3px solid ${colours.forms.textInput.focusBorder};
    outline-offset: 0;
  }
`;

export const Button = styled.button`
 /* Adapt the colors based on primary prop */
  background: lightgrey;
  width: 300px;
  text-align: left;
  font-size: 1.25em;
  padding: 0.5em;
  margin: 0.5em;
  border: 1px lightgrey solid;
  border-radius: 0px;
`;

export const Label = styled.label`
  width:100%;
  margin:0;
  padding:0;
`;

export const Heading = styled.div`
  color: black;
  text-align: center;
  margin-bottom: 65px;
`;

export const H1 = styled.div`
  font-weight: normal;
  font-size: 48px;
`;

export const H2 = styled.div`
  font-weight: normal;
  font-size: 24px;
`;
