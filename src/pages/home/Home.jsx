import React, {Fragment, useContext, useEffect} from 'react';
import {FirebaseContext} from '../../context/firebase/firebaseContext';
import Form from '../../components/Form';
import Loader from '../../components/Loader';
import Notes from '../../components/Notes';

const Home = () => {
  const {loading, notes, fetchNotes, removeNote} = useContext(FirebaseContext);

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <Fragment>
      <Form />

      <hr />

      {loading
        ? <Loader />
        : <Notes notes={notes} onRemove={removeNote} />}

    </Fragment>
  );
};

export default Home;
