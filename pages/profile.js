/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { useAuth } from '../utils/context/authContext';

export default function Profile() {
  const { dbUser } = useAuth();

  return (
    <>
      <img alt="User Profile" src={dbUser.photoURL} />
      <h1>{dbUser.displayName}</h1>
      <h2>{dbUser.email}</h2>
    </>
  );
}
