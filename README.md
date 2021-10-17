Проект в стадии разработки. 
Реализует функционал записной книжки. 
Использует React, Axios, Firebase. Содержит Sass. 


------------------------------------------------------------------------------

# Маршрутизация

1. **Создаем компоненты, которые представляют страницы (Note, About)**
2. **Перечисляем в константах пути к ним:**

src/routes/constants.js

    export const HOME_ROUTE = `/home`;

3. **Описываем пути в виде массива объектов:**

src/routes/routes.js

    import {HOME_ROUTE} from './constants';
    import Home from '../pages/home/Note';

    export const publicRoutes = [
      {
        title: `home`,
        path: HOME_ROUTE,
        Component: Note,
      },
    ];

4. **Создаем компонент отвечающий за навигацию.**

Она позволит перемещаться между страницами при клике по указанному пункту. Используем NavLink. В отличии от простого Link, он позволяет воспользоваться стилизацией для выделения активной ссылки. NavLink включает в себя activeClassName (значение которого просто добавляется к стилизации) и/или activeStyle (используется в качестве встроенной стилизации, например activeStyle={{color: "green", fontWeight: "bold"}})

src/components/Navbar.jsx

    import React, {Fragment} from 'react';
    import {NavLink} from 'react-router-dom';
    import {publicRoutes} from '../routes/routes';

    const Navbar = () => {
      return (
        <ul className="navbar-nav">
          {publicRoutes.map(({title, path}) => (
            <li key={title} className="nav-item">
              <NavLink to={path} className="nav-link">{title}</NavLink>
            </li>
          ))}
        </ul>
      );
    };

    export default Navbar;

5. **Подключаем маршрутизацию.**

Switch итерируется по всем путям и в том случае, если ничего не найдено, возвращает последний маршрут. В нашем случае - Redirect. Это необходимо для того, чтобы пользователь, при неверном наборе пути, возвращался на HOME_ROUTE:

src/App.js

    import React from 'react';
    import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";
    import Navbar from './components/Navbar';
    import {HOME_ROUTE} from './routes/constants';
    import {publicRoutes} from './routes/routes';

    function App() {
      return (
        <BrowserRouter>
          <Navbar />
          <div className="container pt-4">
            <Switch>
              {publicRoutes.map(({title, path, Component}) => <Route key={title} path={path} component={Component} exact />)}
              <Redirect to={HOME_ROUTE} />
            </Switch>
          </div>
        </BrowserRouter>
      );
    }

    export default App;

# useContext

Данный подход позволит взаимодействовать между различными компонентов вне обычной каскадной схемы.

1. **Создаем экшены**:

*src/context/alertActions.jsx*

    export const SHOW_ALERT = `SHOW_ALERT`;
    export const HIDE_ALERT = `HIDE_ALERT`;

2. **Создаем редьюсер, который позволит взаимодействовать с стейтом Alert, отправляя action**:

*src/context/alert/alertReducer.js*

    import {HIDE_ALERT, SHOW_ALERT} from "../alertActions";

    const handlers = {
      [SHOW_ALERT]: (state, {payload}) => ({...payload, visible: true}),
      [HIDE_ALERT]: (state) => ({...state, visible: false}),
      DEFAULT: state => state,
    };

    export const alertReducer = (state, action) => {
      const handle = handlers[action.type] || handlers.DEFAULT;
      return handle(state, action);
    };

3. **Извлекаем контекст**:

*src/context/alert/alertContext.js*

    import {createContext} from 'react';

    export const AlertContext = createContext();

4. **Создаем компонент, который будет оборачивать все приложение в контекст провайдера**.

В useReducer передаем только что созданный редьюсер, создаем необходимые функции взаимодействия, передаем их одним объектом в пропсы.

*src/context/alert/AlertState.js*

    import React, {useReducer} from 'react';
    import {HIDE_ALERT, SHOW_ALERT} from '../alertActions';
    import {AlertContext} from './alertContext';
    import {alertReducer} from './alertReducer';

    export const AlertState = ({children}) => {
      const [state, dispatch] = useReducer(alertReducer, {visible: false});

      const show = (text, type = 'warning') => dispatch({
          type: SHOW_ALERT,
          payload: {text, type},
        });

      const hide = () => dispatch({
        type: HIDE_ALERT,
      });

      return (
        <AlertContext.Provider value={{show, hide, alert: state}}>
          {children}
        </AlertContext.Provider>
      );
    };

5. **Оборачиваем все компоненты в AlertState**. 

Тем самым абсолютно любые компоненты имеют доступ к стейту Alert при использовании его контекста {show, hide, alert: state}.

*src/App.js*

    import React from 'react';
    import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";
    import {HOME_ROUTE} from './routes/constants';
    import {publicRoutes} from './routes/routes';
    import Navbar from './components/Navbar';
    import Alert from './components/Alert';
    import {AlertState} from './context/alert/AlertState';

    function App() {
      return (
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
      );
    }

    export default App;

5. **Использование контекста в компонентах**. 

Все, что нужно теперь для извлечения стейта, это использовать const {alert, hide, show} = useContext(AlertContext):

    import React, {useContext} from 'react';
    import {AlertContext} from '../context/alert/alertContext';

    const Alert = () => {

      const {alert, hide} = useContext(AlertContext);

      if (!alert.visible) {
        return null;
      }

      return (
        <span>{alert.text}</span>
        <button type="button" className="close" onClick={hide} aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      );
    };

    export default Alert;

А так же:

    import React, {useContext, useState} from 'react';
    import {AlertContext} from '../context/alert/alertContext';

    const Form = () => {

      const [value, setValue] = useState('');
      const alert = useContext(AlertContext);

      const handleSubmit = (evt) => {
        evt.preventDefault();

        alert.show(value, `success`);
      };

      return (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control"
            placeholder="Введите название заметки"
            value={value}
            onChange={({target}) => setValue(target.value)} />
        </form>
      );
    };

    export default Form;

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

Часто при установке sass возникает ошибка версий. В этом случае:

    yarn remove node-sass 
    yarn add node-sass@4.14.1

Удаляем из предустановленного проекта App.css App.test.js logo.svg reportWebVitalis.js. Удаляем сопутствующие импорты.

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

# Паттерны и лайфхаки

Сгенерировать массив с фейковыми данными:

    const notes = new Array(3)
    .fill(``)
    .map((_, i) => (
      {
        id: i, 
        title: `Note ${i + 1}`
      })
    );
