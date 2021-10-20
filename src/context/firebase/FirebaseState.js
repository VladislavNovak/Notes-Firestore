/* eslint-disable react/prop-types */
import React, {useReducer} from 'react';
import axios from 'axios';
import {ADD_NOTE, FETCH_NOTES, REMOVE_NOTE, SHOW_LOADER} from './firebaseConstants';
import {FirebaseContext} from './firebaseContext';
import {firebaseReducer} from './firebaseReducer';

const url = process.env.REACT_APP_DB_URL;

const initialState = {
  notes: [],
  loading: false,
};

export const FirebaseState = ({children}) => {

  const [state, dispatch] = useReducer(firebaseReducer, initialState);

  const fetchNotes = async () => {
    dispatch({type: SHOW_LOADER});

    const res = await axios.get(`${url}/notes.json`);

    const payload = Object.keys(res.data || {}).map(key => {
      return {
        ...res.data[key],
        id: key,
      };
    });

    dispatch({type: FETCH_NOTES, payload});
  };

  const addNote = async (title) => {
    const note = {
      title,
      date: new Date().toJSON(),
    };

    try {
      const res = await axios.post(`${url}/notes.json`, note);

      const payload = {
        ...note,
        id: res.data.name
      };

      dispatch({type: ADD_NOTE, payload});

    } catch (error) {
      throw new Error(error.message);
    }
  };

  const removeNote = async (id) => {
    await axios.delete(`${url}/notes/${id}.json`);

    dispatch({
      type: REMOVE_NOTE,
      payload: id,
    });
  };

  return (
    <FirebaseContext.Provider value={{
      fetchNotes,
      addNote,
      removeNote,
      loading: state.loading,
      notes: state.notes,
    }}>
      {children}
    </FirebaseContext.Provider>
  );
};
