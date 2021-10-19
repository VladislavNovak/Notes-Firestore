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
      firebase.addNote(value.trim())
        .then(() => alert.show(`The note has been created`, `success`))
        .then(() => setValue(``))
        .catch((error) => alert.show(`Error: ${error}`, `danger`));
    } else {
      alert.show(`Enter a title for the note`, `warning`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Enter a title for the note"
          value={value}
          onChange={({target}) => setValue(target.value)} />
      </div>
    </form>
  );
};

export default Form;
