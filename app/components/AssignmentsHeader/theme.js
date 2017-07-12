import styled from 'styled-components';
import colours from 'theme/colours';

export const AssignmentsHeaderWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 214px;
  border-bottom: 2px solid ${colours.baseFont};
  margin-bottom: 11px;
`;

export const PortraitImage = styled.div`
  width: 121px;
  height: 121px;
  background-image: url('${(props) => props.background}');
  background-size: cover;
  background-position: center;
`;

export const UserName = styled.div`
  position: absolute;
  top: 0px;
  left: 230px;
  font-size: 50px;
  color: #0b0c0c;
`;

export const CaseLoad = styled.div`
  position: absolute;
  top: 94px;
  left: 230px;
  font-size: 24px;
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
  bottom: 6px;
  left: 0px;
  font-size: 20px;
  color: #0b0c0c;

`;

export const NotificationNumber = styled.span`
  height: 20px;
  width: 20px;
  margin: auto;
  text-align: center;
  line-height: 22px;
  border-radius: 10px;
  background-color: ${colours.userMenu.notification};
  color: #0b0c0c;
  font-size: 12px;
`;

export const NotificationNumberAssignments = styled(NotificationNumber)`
  position: relative;
  top: -2px;
  left: 4px;
  display: inline;
  padding: 2px 5px;
  font-weight: bold;
  margin-right: 7px;
`;

export const ResultsViewToggleWrapper = styled.div`
  position: absolute;
  bottom: 6px;
  width: 100%;

`;

