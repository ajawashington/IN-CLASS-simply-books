/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import UserCard from '../components/UserCard';
import { getUsers } from '../api/userData';
import { useAuth } from '../utils/context/authContext';

function Community() {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();

  const getAllUsers = () => {
    getUsers().then((userArray) => {
      const nonLoggedInUsers = userArray.filter((nlUser) => nlUser.uid !== user.uid);
      setUsers(nonLoggedInUsers);
    });
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div>
      { users?.map((u) => <UserCard key={u.firebaseKey} userObj={u} />)}
    </div>
  );
}

export default Community;
