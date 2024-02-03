import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/context/authContext';
import { createMessage, updateMessage } from '../../api/messageData';

export default function MessageForm({ messageObj, onUpdate }) {
  const { user } = useAuth();
  const router = useRouter();
  const { receiverUid } = router.query;
  const [formInput, setFormInput] = useState({});

  useEffect(() => {
    setFormInput(messageObj);
  }, [messageObj]);

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
      ...formInput,
      receiverId: receiverUid,
      senderId: user.uid,
      dateSent: new Date().toUTCString(),
    };
    createMessage(payload).then(({ name }) => {
      const patchPayload = { firebaseKey: name };
      updateMessage(patchPayload).then(() => onUpdate());
    });
  };

  return (
    <>
      <Form style={{ color: 'white' }} onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter Message"
            name="message"
            value={formInput.message}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Send Message
        </Button>
      </Form>
    </>
  );
}

MessageForm.propTypes = {
  messageObj: PropTypes.shape({
    message: PropTypes.string,
    senderId: PropTypes.string,
    receiverId: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};
