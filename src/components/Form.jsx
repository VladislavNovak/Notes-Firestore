import React, {useContext, useState} from 'react';
import {AlertContext} from '../context/alert/alertContext';

const Form = () => {

  const [value, setValue] = useState('');
  const alert = useContext(AlertContext);

  const handleSubmit = (evt) => {
    evt.preventDefault();

    if (value.trim()) {
      alert.show(`Заметка была создана`, `success`);
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
