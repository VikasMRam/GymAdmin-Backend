import React, { useContext, useState, useRef, useCallback } from 'react';
import Helmet from 'react-helmet';
import { useLocation } from 'react-router-dom';

import ChatBoxGlobalStyle from './ChatBoxGlobalStyle';

import { /* isBrowser, olarkSiteId, */ rokoApiKey, hideChatbox } from 'sly/web/config';


export const ChatBoxContext = React.createContext({ triggerChatBot: () => {} });

const loadJsScript = () => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined') {
      let script = document.getElementById('instabot');
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://widget.instabot.io/jsapi/rokoInstabot.js';
        script.id = 'instabot';
        script.type = 'text/javascript';
        script.text = `apiKey:"${rokoApiKey}"`;
        script.async = true;
        script.crossOrigin = '';
        document.body.appendChild(script);
      }
      script.onload = () => {
        resolve(window.RokoInstabot);
      };
      script.onerror = (err) => {
        reject(err);
      };
    } else {
      reject(new Error('Roko Instabot can\'t be loaded in the server'));
    }
  });
};

const getTimeoutForEvent = (eventName) => {
  if (eventName === 'Bot reintro') {
    return 30000;
  }
  return 10000; // default timeout
};


export const ChatBoxProvider = (props) => {
  const [isChatboxLoaded, setChatboxLoaded] = useState(false);
  const location = useLocation();
  const currentTimer = useRef(0);

  const clearCurrentTimeOut = useCallback(
    () => {
      if (currentTimer.current) {
        clearTimeout(currentTimer.current);
        currentTimer.current = null;
      }
    },
    [currentTimer.current],
  );

  const triggerEvent = useCallback(
    (eventName) => {
      if (hideChatbox) {
        return;
      }
      clearCurrentTimeOut();
      currentTimer.current = setTimeout(() => {
        if (location.pathname !== window.location.pathname) {
          return;
        }
        loadJsScript()
          .then((instance) => {
            instance.trigger(eventName);
            clearCurrentTimeOut();
            if (!isChatboxLoaded) {
              setChatboxLoaded(true);
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }, getTimeoutForEvent(eventName));
    },
    [currentTimer.current, location.pathname],
  );


  const contextValue = {
    triggerChatBot: triggerEvent,
  };

  return (
    <>
      <ChatBoxContext.Provider value={contextValue}>
        {isChatboxLoaded && (
          <Helmet>
            <style type="text/css">{ChatBoxGlobalStyle}</style>
          </Helmet>
     )}
        {props.children}
      </ChatBoxContext.Provider>

    </>
  );
};

export const useChatbox = () => {
  return useContext(ChatBoxContext);
};


export default ChatBoxProvider;

