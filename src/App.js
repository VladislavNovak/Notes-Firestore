import React from 'react';
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";
import {HOME_ROUTE} from './routes/constants';
import {publicRoutes} from './routes/routes';
import {AlertState} from './context/alert/AlertState';
import {FirebaseState} from './context/firebase/FirebaseState';
import Navbar from './components/Navbar';
import Alert from './components/Alert';

function App() {
  return (
    <FirebaseState>
      <AlertState>
        <BrowserRouter>
          <Navbar />
          <div className="container pt-4">
            <Alert />
            <Switch>
              {publicRoutes.map(({title, path, Component}) => <Route key={title} path={path} component={Component} exact />)}
              <Redirect to={HOME_ROUTE} />
            </Switch>
          </div>
        </BrowserRouter>
      </AlertState>
    </FirebaseState>
  );
}

export default App;
