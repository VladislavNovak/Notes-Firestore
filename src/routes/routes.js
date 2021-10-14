import {ABOUT_ROUTE, NOTE_ROUTE} from './constants';
import Note from '../pages/note/Note';
import About from '../pages/about/About';

export const publicRoutes = [
  {
    title: `note`,
    path: NOTE_ROUTE,
    Component: Note,
  },
  {
    title: `about`,
    path: ABOUT_ROUTE,
    Component: About,
  },
];
