import React from 'react';
import { shallow, mount } from 'enzyme';
import { Map } from 'immutable';
import FeedbackLinkContainer, { FeedbackLink } from '../index';

describe('Feedback link', () => {
  it('should not request the url when the user and feedbackUrl props has not been set', () => {
    const requestFeedbackUrl = jest.fn();

    shallow(<FeedbackLink requestFeedbackUrl={requestFeedbackUrl} />);

    expect(requestFeedbackUrl).toHaveBeenCalledTimes(0);
  });

  it('should request the url when the user and url prop has been set', () => {
    const requestFeedbackUrl = jest.fn();
    const user = {};

    shallow(<FeedbackLink requestFeedbackUrl={requestFeedbackUrl} user={user} />);

    expect(requestFeedbackUrl).toHaveBeenCalledTimes(1);
  });

  it('should not request the url when the url and user has been set', () => {
    const requestFeedbackUrl = jest.fn();
    const user = {};

    shallow(<FeedbackLink requestFeedbackUrl={requestFeedbackUrl} user={user} feedbackUrl={'http://google.com'} />);

    expect(requestFeedbackUrl).toHaveBeenCalledTimes(0);
  });

  it('should call openWindow on click with the correct url', () => {
    const url = 'http://google.com';
    const openWindow = jest.fn();

    const component = shallow(<FeedbackLink user feedbackUrl={url} openWindow={openWindow} />);

    component.find('a').simulate('click');

    expect(openWindow).toHaveBeenCalledWith(url);
  });

  it('should render the message and link', () => {
    const url = 'http://google.com';

    const component = shallow(<FeedbackLink user feedbackUrl={url} />);
    const message = component.find('.main-content span').text();
    const link = component.find('.main-content span a').node.props;

    expect(link.href).toBe('#');
    expect(typeof link.onClick).toBe('function');
    expect(link.children.trim()).toBe('feedback');

    expect(message.trim()).toBe('Your  feedback  will to help us improve this service.');
  });

  it('should not render the message and link when url has not been set', () => {
    const component = shallow(<FeedbackLink user requestFeedbackUrl={() => {}} />);

    expect(component.node.props.children).toBe(undefined);
  });

  it('should pass the correct properties down to <FeedbackLink />', () => {
    const store = {
      getState: jest.fn(() => Map({
        authentication: {},
        app: {},
      })),
      dispatch: jest.fn(),
      subscribe: jest.fn(),
    };
    
    const component = mount(<FeedbackLinkContainer store={store} />);
    const properties = component.find(FeedbackLink).props();

    expect(typeof properties.requestFeedbackUrl).toBe('function');
    expect(typeof properties.openWindow).toBe('function');
  });
});