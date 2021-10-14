import React from 'react';
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";
import Navbar from './components/Navbar';
import {NOTE_ROUTE} from './routes/constants';
import {publicRoutes} from './routes/routes';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container pt-4">
        <Switch>
          {publicRoutes.map(({title, path, Component}) => <Route key={title} path={path} component={Component} exact />)}
          <Redirect to={NOTE_ROUTE} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
