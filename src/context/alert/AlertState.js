/* eslint-disable react/prop-types */
import React, {useReducer} from 'react';
import {HIDE_ALERT, SHOW_ALERT} from './alertConstants';
import {AlertContext} from './alertContext';
import {alertReducer} from './alertReducer';

const initialState = {
  visible: false,
  text: ``,
  warning: ``,
};

export const AlertState = ({children}) => {
  const [state, dispatch] = useReducer(alertReducer, initialState);

  const show = (text, warning) => {
    dispatch({
      type: SHOW_ALERT,
      payload: {text, warning},
    });
  };

  const hide = () => dispatch({
    type: HIDE_ALERT,
  });

  return (
    <AlertContext.Provider value={{show, hide, alert: state}}>
      {children}
    </AlertContext.Provider>
  );
};
