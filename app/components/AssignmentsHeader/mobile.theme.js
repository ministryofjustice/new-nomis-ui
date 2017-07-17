import styled from 'styled-components';
import colours from 'theme/colours';

export const AssignmentsHeaderWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 110px;
  background-color: ${colours.assignments.mobileBackgroundColour};
  padding: 18px 10px;
`;

export const PortraitImage = styled.div`
  width: 74px;
  height: 74px;
  background-image: url('${(props) => props.background}');
  background-size: cover;
  background-position: center;
`;

export const UserName = styled.div`
  position: absolute;
  top: 18px;
  left: 100px;
  font-size: 18px;
  color: ${colours.baseFont};
`;

export const CaseLoad = styled.div`
  position: absolute;
  top: 44px;
  left: 100px;
  font-size: 14px;
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
  top: 71px;
  left: 100px;
  font-size: 14px;
  color: ${colours.baseFont};
`;

export const NotificationNumber = styled.span`
  border-radius: 14px;
  background-color: ${colours.userMenu.notification};
`;

export const NotificationNumberAssignments = styled(NotificationNumber)`
  padding: 2px 6px;
  font-weight: bold;
`;

export const ResultsViewToggleWrapper = styled.div`
  position: absolute;
  bottom: 6px;
  width: 100%;
`;
