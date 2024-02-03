/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { getSingleUser } from '../../api/userData';
import { useAuth } from '../../utils/context/authContext';

export default function SingleUser() {
  const router = useRouter();
  const { user } = useAuth();
  const { userUid } = router.query;
  const [displayedUser, setDisplayedUser] = useState({});

  useEffect(() => {
    getSingleUser(userUid).then((res) => setDisplayedUser(res));
  }, [userUid]);

  return (
    <>
      <img alt="User Profile" src={displayedUser?.photoURL} />
      <h1>{displayedUser?.displayName}</h1>
      <h2>{displayedUser?.email}</h2>
      <Link href={`/message/${displayedUser.uid}/${user.uid}`} passHref>
        <Button variant="primary" className="m-2">Show Messages</Button>
      </Link>
    </>
  );
}
