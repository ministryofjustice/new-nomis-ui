import styled from 'styled-components';
import colours from 'theme/colours';

export const AssignmentsHeaderWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  background-color: ${colours.assignments.mobileBackgroundColour};
  margin-bottom: 28px;
  padding-top: 38px;
`;

export const PortraitImage = styled.div`
  width: 121px;
  height: 121px;
  background-image: url('${(props) => props.background}');
  background-size: cover;
  background-position: center;
  margin-left: 21px;
`;

export const UserName = styled.div`
  position: absolute;
  top: 27px;
  left: 230px;
  font-size: 35px;
  color: black;
`;

export const CaseLoad = styled.div`
  position: absolute;
  top: 71px;
  left: 230px;
  font-size: 28px;
  color: ${colours.assignments.idText};
`;

export const SwitchCaseLoad = styled.div`
  color: ${colours.assignments.linkText};
  text-decoration: underline;
  font-size: 19px;
  color: #005EA5;
  display: inline-block;
  margin-left: 24px;
`;

export const YouHaveAssignments = styled.div`
  position: absolute;
  top: 128px;
  left: 230px;
  font-size: 28px;
  color: black;
`;

export const NotificationNumber = styled.span`
  height: 20px;
  width: 20px;
  margin: auto;
  text-align: center;
  line-height: 34px;
  border-radius: 14px;
  color: black;
  font-size: 19px;
  background-color: ${colours.userMenu.notification};
`;

export const NotificationNumberAssignments = styled(NotificationNumber)`
  position: relative;
  top: -4px;
  left: 4px;
  display: inline;
  padding: 2px 6px;
  font-weight: bold;
  margin-right: 7px;
`;

export const ResultsViewToggleWrapper = styled.div`
  position: absolute;
  bottom: 6px;
  width: 100%;

`;

