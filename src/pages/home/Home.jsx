import React, {Fragment, useContext, useEffect} from 'react';
import {FirebaseContext} from '../../context/firebase/firebaseContext';
import Form from '../../components/Form';
import Loader from '../../components/Loader';
import Notes from '../../components/Notes';
import {AlertContext} from '../../context/alert/alertContext';

const Home = () => {
  const {loading, notes, fetchNotes, removeNote} = useContext(FirebaseContext);
  const alert = useContext(AlertContext);

  const handleRemove = (id) => {
    removeNote(id)
      .then(() => alert.show(`Note successfully deleted`, `info`))
      .catch((error) => alert.show(`Error: ${error}`, `danger`));
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <Fragment>
      <Form />

      <hr />

      {loading
        ? <Loader />
        : <Notes notes={notes} onRemove={handleRemove} />}

    </Fragment>
  );
};

export default Home;
