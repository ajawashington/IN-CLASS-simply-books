import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';
import { createUser, updateUser } from '../../api/userData';
import { useAuth } from '../../utils/context/authContext';

const intialState = {
  displayName: '',
  email: '',
  photoURL: '',
};

export default function UserForm({ userObj }) {
  const [formInput, setFormInput] = useState({ ...intialState, uid: userObj.uid });
  const { setDbUser } = useAuth();

  useEffect(() => {
    if (userObj.uid) {
      setFormInput(userObj);
    }
  }, [userObj]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      displayName: formInput.displayName,
      email: formInput.email,
      photoURL: formInput.photoURL,
      uid: formInput.uid,
      dateCreated: new Date().toUTCString(),
    };
    createUser(payload).then(({ name }) => {
      const patchPayload = { firebaseKey: name };
      updateUser(patchPayload).then(() => setDbUser(payload));
    });
  };

  return (
    <>
      <Form style={{ color: 'white' }} onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Name"
            name="displayName"
            value={formInput.displayName}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            name="email"
            value={formInput.email}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Profile Photo</Form.Label>
          <Form.Control
            type="url"
            placeholder="Enter Photo URL?"
            name="photoURL"
            value={formInput.photoURL}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Create User
        </Button>
      </Form>
    </>
  );
}

UserForm.propTypes = {
  userObj: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string,
    photoURL: PropTypes.string,
    uid: PropTypes.string,
    firebaseKey: PropTypes.string,
  }),
};

UserForm.defaultProps = {
  userObj: intialState,
};
