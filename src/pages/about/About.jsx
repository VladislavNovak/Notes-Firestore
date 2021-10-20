import React, {useContext, useEffect} from 'react';
import {AlertContext} from '../../context/alert/alertContext';

const About = () => {
  const {alert, hide} = useContext(AlertContext);

  useEffect(() => {
    if (alert.visible) {
      hide();
    }
  }, []);

  return (
    <div className="jumbotron">
      <div className="container">
        <h1 className="display-6">Лучшее React приложение</h1>
        <p className="lead">Версия 0.1</p>
      </div>
    </div>
  );
};

export default About;
