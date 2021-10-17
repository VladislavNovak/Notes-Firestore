import {ABOUT_ROUTE, HOME_ROUTE} from './constants';
import Home from '../pages/home/Home';
import About from '../pages/about/About';

export const publicRoutes = [
  {
    title: `Home`,
    path: HOME_ROUTE,
    Component: Home,
  },
  {
    title: `About`,
    path: ABOUT_ROUTE,
    Component: About,
  },
];
