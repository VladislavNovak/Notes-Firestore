Проект реализует функционал записной книжки. Основывается на React, Axios, Firebase. Содержит Sass. 

# Базовые настройки

  Если ещё не установлен yarn:

    npm i -g yarn

  Создаем проект:

    npx create-react-app notes-firestore

  Переходим в сам проект через cd notes-firestore и устанавливаем зависимости:

    yarn add node-sass react-router-dom axios bootstrap

  Настраиваем линтер (сам eslint уже установлен вместе с create-react-app):

    yarn add eslint-plugin-babel eslint-plugin-react --dev

  Создаем обслуживающие функционал:

    touch .editorconfig .eslintrc.json .gitattributes

  Наполняем editorconfig:

    root = true

    [*]
    charset = utf-8
    end_of_line = lf
    indent_size = 2
    indent_style = space
    insert_final_newline = true
    trim_trailing_whitespace = true

    [*.md]
    trim_trailing_whitespace = false

  Наполняем eslintrc:

    {
      "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
      },
      "extends": ["eslint:recommended",
        "plugin:react/recommended"],
        "parserOptions": {
          "ecmaFeatures": {
            "jsx": true
      },
          "ecmaVersion": 2018,
          "sourceType": "module"
      },
      "plugins": [
          "react",
          "babel"
      ],
      "rules": {
          "no-unused-vars": ["error", { "caughtErrorsIgnorePattern": "^ignore" }],
          "react/jsx-uses-react": 1,
          "react/jsx-uses-vars": "error",

          "linebreak-style": [
          "error",
          "unix"
      ],
          "babel/new-cap": 1,
          "babel/camelcase": 1,
          "babel/no-invalid-this": 1,
          "babel/object-curly-spacing": 1,
            "babel/semi": 1,
          "babel/no-unused-expressions": 1,
          "babel/valid-typeof": 1
      }
    }

  Наполняем gitattributes:

    * text=auto
    *.doc     diff=astextplain
    *.DOC     diff=astextplain
    *.docx    diff=astextplain
    *.DOCX    diff=astextplain
    *.dot     diff=astextplain
    *.DOT     diff=astextplain
    *.pdf     diff=astextplain
    *.PDF     diff=astextplain
    *.rtf     diff=astextplain
    *.RTF     diff=astextplain
    *.md text
    *.tex text
    *.adoc text
    *.textile text
    *.mustache text
    *.csv text
    *.tab text
    *.tsv text
    *.sql text
    *.png binary
    *.jpg binary
    *.jpeg binary
    *.gif binary
    *.tif binary
    *.tiff binary
    *.ico binary
    *.svg binary
    #*.svg text
    *.eps binary

    .gitattributes export-ignore
    .gitignore export-ignore

  Для того, чтобы использовать препроцессор, меняем расширение index.css и перемещаем в папку src/assets/sass/index.scss. А для того, чтобы подключить туда же bootstrap, помещаем вверх этого файла:

    @import "~bootstrap/scss/bootstrap";

  Удаляем из предустановленного проекта App.js App.test.js logo.svg reportWebVitalis.js. Удаляем сопутствующие импорты.

  Настраиваем порт в package.json:

    "start": "set port=3013 && react-scripts start",

  Запускаем проект:

    yarn run start

  Если проект успешно скомпилировался, создаем репозиторий на gitHub и копируем его на компьютер, введя после нижеприведенной команды адрес, который скопировали из удаленного репозитория:

    git remote add origin

  Сохраняем все изменения в удаленный репозиторий на github, привязываясь к нему:

    git add -A
    git commit -m
    git push -u origin master

  Все последующие изменения можно будет вносить командой:

    git add -A
    git commit -m
    git push

------------------------------------------------------------------------------

# Маршрутизация

  Создаем компоненты, которые представляют страницы (src/pages/note/: Note, About) и перечисляем в константах пути к ним:

  src/routes/constants.js

    export const NOTE_ROUTE = `/note`;
    export const ABOUT_ROUTE = `/about`;

  Описываем пути в виде массива объектов:

  src/routes/routes.js

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

  Создаем навигацию. Она позволит перемещаться между страницами при клике по указанному пути. Используем NavLink. В отличии от простого Link, он позволяет воспользоваться стилизацией для выделения активной ссылки. NavLink включает в себя:
1.  activeClassName, значение которого просто добавляется к стилизации
2. activeStyle, который используется в качестве встроенной стилизации (activeStyle={{color: "green", fontWeight: "bold"}})

src/components/Navbar.jsx

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


  Подключаем маршрутизацию. Switch итерируется по всем путям и в том случае, если ничего не найдено, возвращает последний маршрут. В нашем случае - Redirect. Это необходимо для того, чтобы пользователь, при неверном наборе пути, возвращался на NOTE_ROUTE:

  src/App.js

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



