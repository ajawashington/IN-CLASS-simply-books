/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { useAuth } from '../utils/context/authContext';

function Home() {
  // TODO: Get user ID using useAuth Hook
  const { dbUser } = useAuth();

  return (
    <div className="text-center my-4">
      <h1>
        Hello {dbUser.displayName}!!
      </h1>
      <Link href="/books" passHref>
        <Button>See All Books</Button>
      </Link>
      <br />
      <br />
      <Link href="/authors" passHref>
        <Button>See All Authors</Button>
      </Link>
      <br />
      <br />
      <Link href="/orders" passHref>
        <Button>See All Orders</Button>
      </Link>
      <br />
      <br />
      <Link href="/community" passHref>
        <Button>See Community</Button>
      </Link>
    </div>
  );
}

export default Home;
