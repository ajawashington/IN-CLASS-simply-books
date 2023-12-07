/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Card } from 'react-bootstrap';
import MessageForm from '../../../components/forms/MessageForm';
import { getAllMessages } from '../../../api/mergedData';
import { useAuth } from '../../../utils/context/authContext';
import { deleteMessage } from '../../../api/messageData';

export default function ShowMessages() {
  const router = useRouter();
  const { user } = useAuth();
  const { receiverUid, senderUid } = router.query;
  const [messageDetails, setMessageDetails] = useState({});
  const [newMessage, setNewMessage] = useState({});

  const getMessageDetails = () => {
    getAllMessages(senderUid, receiverUid).then(setMessageDetails);
    setNewMessage({ message: '', senderId: senderUid, receiverId: receiverUid });
  };

  const deleteSingleMessage = (messageText, firebaseKey) => {
    if (window.confirm(`Do you want to delete ${messageText}?`)) {
      deleteMessage(firebaseKey).then(() => getMessageDetails());
    }
  };

  useEffect(() => {
    getMessageDetails();
  }, []);

  return (
    <>
      {messageDetails?.messages?.sort((a, b) => new Date(a.dateSent) - new Date(b.dateSent)).map((mes) => (
        <>
          <Card key={mes.firebaseKey}>
            <div>
              <h2>
                <img
                  style={{ width: '30px' }}
                  src={mes.senderId === senderUid ? messageDetails?.sender?.photoURL : messageDetails?.receiver?.photoURL}
                  alt={mes.senderId === senderUid ? messageDetails?.sender?.displayName : messageDetails?.receiver?.displayName}
                />
                {mes.message}
              </h2>
              <p>{mes.dateSent}</p>
            </div>
            {mes.senderId === user.uid ? <Button onClick={() => deleteSingleMessage(mes.message, mes.firebaseKey)}>Delete Message</Button> : '' }
          </Card>
        </>
      ))}
      <br />
      <MessageForm messageObj={newMessage} onUpdate={getMessageDetails} />
    </>
  );
}
