import React from 'react';
import { render } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { Map } from 'immutable';
import CaseNoteDetailsBlock from './detailsPage';

const store = {
  getState: jest.fn(() => Map({
    authentication: Map({ user: { staffId: 45 } }),
    app: { feedbackUrl: 'url' },
  })),
  dispatch: jest.fn(),
  subscribe: jest.fn(),
};

describe('Case Note Details', () => {
  it('CaseNoteDetailsBlock renders correctly', () => {
    const wrapper = render(<IntlProvider locale="en-gb"><CaseNoteDetailsBlock
      store={store}
      backToCaseNotes={jest.fn()}
      addAmendment={jest.fn()}
      caseNoteId={300}
      offenderNo={400}
      caseNote={Map({
        text: 'my text',
        typeDescription: 'type desc',
        subTypeDescription: 'sub desc',
        originalNoteText: 'original text',
        authorName: 'The author',
        staffId: 45,
        creationDateTime: '2018-06-30T23:30:00',
        occurrenceDateTime: '2018-06-30T20:15:00',
        amendments: [] })}
    /></IntlProvider>);
    expect(wrapper.find('h2.heading-medium').text()).toEqual('type desc | sub desc');
    expect(wrapper.find('pre pre').text()).toEqual('original text');
    expect(wrapper.find('h2.heading-small div').text()).toEqual('30/06/2018 - 23:30');
    expect(wrapper.find('h2.heading-small + div').text()).toEqual('The author');
    expect(wrapper.find('div:has( > span.right-padding)').text()).toEqual(' Occurrence date: 30/06/2018 - 20:15');
    expect(wrapper.find('button').text()).toEqual('Make amendment');
  });

  it('Make amendment button hidden for a different user', () => {
    const wrapper = render(<IntlProvider locale="en-gb"><CaseNoteDetailsBlock
      store={store}
      backToCaseNotes={jest.fn()}
      addAmendment={jest.fn()}
      caseNoteId={300}
      offenderNo={400}
      caseNote={Map({
        text: 'my text',
        typeDescription: 'type desc',
        subTypeDescription: 'sub desc',
        originalNoteText: 'original text',
        authorName: 'The author',
        staffId: 44, // DIFFERENT
        creationDateTime: '2018-06-30T23:30:00',
        occurrenceDateTime: '2018-06-30T20:15:00',
        amendments: [] })}
    /></IntlProvider>);
    expect(wrapper.find('button').length).toBe(0);
  });
});
