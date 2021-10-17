/* eslint-disable react/prop-types */
import React, {useContext} from 'react';
import {AlertContext} from '../context/alert/alertContext';

const Alert = () => {

  const {alert, hide} = useContext(AlertContext);

  if (!alert.visible) {
    return null;
  }

  return (
    <div className={`alert alert-${alert.type || `warning`} alert-dismissible fade show alert-reboot`} role="alert">
      <strong>Внимание</strong>
      <span>{alert.text}</span>
      <button type="button" className="close button-reboot" onClick={hide} data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
};

export default Alert;
