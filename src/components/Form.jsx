import React, {useContext, useState} from 'react';
import {AlertContext} from '../context/alert/alertContext';
import {FirebaseContext} from '../context/firebase/firebaseContext';

const Form = () => {

  const [value, setValue] = useState('');
  const alert = useContext(AlertContext);
  const firebase = useContext(FirebaseContext);

  const handleSubmit = (evt) => {
    evt.preventDefault();

    if (value.trim()) {

      firebase.addNote(value.trim()).then(() => {
        alert.show(`Заметка была создана`, `success`);
      }).catch(error => {
        alert.show(`Заметка не была создана`, error);
      });

      setValue(``);

    } else {
      alert.show(`Введите название заметки`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Введите название заметки"
          value={value}
          onChange={({target}) => setValue(target.value)} />
      </div>
    </form>
  );
};

export default Form;
