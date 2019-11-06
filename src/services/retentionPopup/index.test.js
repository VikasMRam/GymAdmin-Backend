import React from 'react';
import { shape } from 'prop-types';
import { BrowserRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';

import RetentionPopup from './index';

const showModal = jest.fn();
const mockStore = configureStore([]);
const store = mockStore({
  requests: {},
  bees: {},
});

// Instantiate router context
const router = {
  history: new BrowserRouter().history,
  route: {
    location: {},
    match: {},
  },
};

const createContext = () => ({
  context: {
    router,
    store,
    api: {
      updateUser: jest.fn().mockReturnValue({
        type: 'apicall',
      }),
    },
  },
  childContextTypes: {
    router: shape({}),
    store: shape({}),
    api: shape({}),

  },
});

const wrap = (props = {}) => mount(
  <RetentionPopup {...props} store={store} showModal={showModal} />
  , createContext());

const setReferrer = (referrer) => {
  Object.defineProperty(document, 'referrer', {
    value: referrer,
    configurable: true,
  });
};

const setState = (state) => {
  Object.defineProperty(window.history, 'state', {
    value: state,
    configurable: true,
  });
};

const setHidden = (hidden) => {
  Object.defineProperty(document, 'hidden', {
    value: hidden,
    configurable: true,
  });
};

const setViewportWidth = (width) => {
  Object.defineProperty(window, 'innerWidth', {
    value: width,
    configurable: true,
  });
};

describe('Retention popup', () => {
  let listeners;

  const RealDate = Date;

  function mockDate(isoDate) {
    global.Date = class extends RealDate {
      constructor() {
        return new RealDate(isoDate);
      }
    };
  }

  beforeEach(() => {
    jest.resetModules();

    jest.resetAllMocks();
    jest.useFakeTimers();
    showModal.mockClear();


    listeners = {};
    window.addEventListener = jest.fn((event, listener) => {
      listeners[event] = listener;
    });

    window.removeEventListener = jest.fn((event) => {
      delete listeners[event];
    });

    document.addEventListener = jest.fn((event, listener) => {
      listeners[event] = listener;
    });

    document.removeEventListener = jest.fn((event) => {
      delete listeners[event];
    });

    window.history.replaceState = jest.fn();
    window.history.pushState = jest.fn();

    setReferrer('');
    setState(null);
    setHidden(false);
  });

  afterEach(() => {
    global.Date = RealDate;
    localStorage.removeItem('modal-shown');
  });

  it('should not add the popstate listener in case of an internal referrer', () => {
    setReferrer('http://localhost');
    setState({ intent: 'stay-intent' });

    const wrapper = wrap();

    expect(wrapper.html()).toBeNull();
    expect(typeof listeners.popstate).toEqual('undefined');
  });

  it('should not add the popstate listener in case of a refresh', () => {
    setReferrer('http://google.com');
    setState({ intent: 'stay-intent' });

    const wrapper = wrap();

    expect(wrapper.html()).toBeNull();
    expect(typeof listeners.popstate).toEqual('undefined');
  });

  it('should add the popstate listener, and show modal once', () => {
    setReferrer('http://google.com');

    const wrapper = wrap();

    expect(wrapper.html()).toBeNull();

    expect(typeof listeners.popstate).toEqual('function');

    listeners.popstate({ state: null });
    expect(showModal).not.toHaveBeenCalled();

    listeners.popstate({ state: { intent: 'stay-intent' } });
    expect(showModal).not.toHaveBeenCalled();

    listeners.popstate({ state: { intent: 'exit-intent' } });
    expect(showModal).toHaveBeenCalled();
    expect(showModal).toHaveBeenCalledTimes(1);
  });

  it('should remove popstate listener', () => {
    const wrapper = wrap();

    expect(wrapper.html()).toBeNull();
    expect(typeof listeners.popstate).toEqual('function');

    wrapper.unmount();

    expect(window.removeEventListener).toHaveBeenCalled();
    expect(typeof listeners.popstate).toEqual('undefined');
  });

  it('should add the focus blur listener', () => {
    const wrapper = wrap();

    expect(wrapper.html()).toBeNull();

    [
      'visibilitychange',
      'mousemove',
      'keyup',
      'touchstart',
    ].forEach((event) => {
      expect(typeof listeners[event]).toEqual('function');
    });
  });

  it('should not fire popup when user returns before 10 seconds', () => {
    mockDate('2017-11-25T12:34:10Z');

    const wrapper = wrap();

    expect(wrapper.html()).toBeNull();
    setHidden(true);

    listeners.visibilitychange();

    mockDate('2017-11-25T12:34:19Z');
    setHidden(false);

    expect(showModal).not.toHaveBeenCalled();
  });

  it('should fire popup once when user returns after 10 seconds', () => {
    mockDate('2017-11-25T12:34:10Z');

    const wrapper = wrap();

    expect(wrapper.html()).toBeNull();

    setHidden(true);
    listeners.visibilitychange();

    mockDate('2017-11-25T12:34:22Z');
    setHidden(false);
    listeners.visibilitychange();

    mockDate('2017-11-25T12:34:21Z');
    setHidden(true);
    listeners.visibilitychange();

    mockDate('2017-11-25T12:34:32Z');
    setHidden(false);
    listeners.visibilitychange();

    expect(showModal).toHaveBeenCalledTimes(1);
  });

  it('should add the mouseout listener', () => {
    const wrapper = wrap();

    expect(wrapper.html()).toBeNull();

    expect(typeof listeners.mouseout).toEqual('function');
  });

  it('should add the mouseout listener and should not show the modal', () => {
    mockDate('2017-11-25T12:34:10Z');

    const wrapper = wrap();

    setViewportWidth(100);
    expect(wrapper.html()).toBeNull();

    expect(typeof listeners.mouseout).toEqual('function');

    mockDate('2017-11-25T12:34:20Z');
    listeners.mouseout({ clientX: 30, clientY: 10 });
    expect(showModal).toHaveBeenCalledTimes(0);
  });

  it('should add the mouseout listener and should show the modal', () => {
    mockDate('2017-11-25T12:34:10Z');

    const wrapper = wrap();

    setViewportWidth(100);
    expect(wrapper.html()).toBeNull();

    expect(typeof listeners.mouseout).toEqual('function');

    mockDate('2017-11-25T12:34:30Z');
    listeners.mouseout({ clientX: 30, clientY: 10 });
    expect(showModal).toHaveBeenCalledTimes(1);
  });

  it('should remove mouseout listener', () => {
    const wrapper = wrap();

    expect(wrapper.html()).toBeNull();

    expect(typeof listeners.mouseout).toEqual('function');

    wrapper.unmount();

    expect(window.removeEventListener).toHaveBeenCalled();
    expect(typeof listeners.mouseout).toEqual('undefined');
  });

  it('should show the ebook modal', () => {
    mockDate('2017-11-25T12:34:10Z');

    const wrapper = wrap();

    expect(wrapper.html()).toBeNull();
    setHidden(true);
    mockDate('2017-11-25T12:35:20Z');

    listeners.visibilitychange();
    setHidden(false);

    mockDate('2017-11-25T12:37:20Z');
    listeners.visibilitychange();

    expect(showModal).toHaveBeenCalledTimes(1);
    expect(showModal).toHaveBeenCalledWith(
      expect.anything(),
      null,
      'eBook',
    );
  });

  it('should not show the ebook modal', () => {
    mockDate('2017-11-25T12:34:10Z');

    const wrapper = wrap();

    expect(wrapper.html()).toBeNull();
    mockDate('2017-11-25T12:36:09Z');
    setHidden(true);

    listeners.visibilitychange();

    expect(showModal).not.toHaveBeenCalled();
  });
});
