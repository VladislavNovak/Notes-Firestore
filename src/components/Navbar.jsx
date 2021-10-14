import React, {Fragment} from 'react';
import {NavLink} from 'react-router-dom';
import {publicRoutes} from '../routes/routes';

const Navbar = () => {
  return (
    <Fragment>
      <nav className="navbar navbar-dark navbar-expand-lg bg-primary">
        <div className="navbar-brand">
          Note App
        </div>

        <ul className="navbar-nav">
          {publicRoutes.map(({title, path}) => (
            <li key={title} className="nav-item">
              <NavLink
                to={path}
                className="nav-link">
                {title}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </Fragment>
  );
};

export default Navbar;
