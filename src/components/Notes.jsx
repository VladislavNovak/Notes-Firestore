/* eslint-disable react/prop-types */
import React from 'react';

const Notes = ({notes}) => {
  return (
    <ul className="list-group">
      {notes.map(note => (
        <li
          key={note.id}
          className="list-group-item note">
            <div>
              <strong>{note.title}</strong>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          <button type="button" className="btn btn-danger btn-sm">&times;</button>
        </li>
      ))}
    </ul>
  );
};

export default Notes;
