/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getAuthorDetails } from '../../api/mergedData';
import BookCard from '../../components/BookCard';

export default function ViewAuthor() {
  const [authorDetails, setAuthorDetails] = useState({});
  const router = useRouter();
  const { firebaseKey } = router.query;

  const getADetails = () => {
    getAuthorDetails(firebaseKey).then(setAuthorDetails);
  };

  useEffect(() => {
    getADetails();
  }, [firebaseKey]);

  return (
    <>
      <div>
        <div className="d-flex flex-column">
          <img src={authorDetails.image} alt={authorDetails.title} style={{ width: '300px' }} />
        </div>
        <div className="text-white ms-5 details">
          <h5>
            {authorDetails.title} by {authorDetails.first_name} {authorDetails.last_name}
            {authorDetails?.favorite ? '🤍' : ''}
          </h5>
          Author Email: <a href={`mailto:${authorDetails.email}`}>{authorDetails?.email}</a>
          <p>{authorDetails.description || ''}</p>
        </div>
        {authorDetails.books?.map((book) => (
          <BookCard key={book.firebaseKey} bookObj={book} onUpdate={getADetails} />
        ))}
      </div>
    </>
  );
}
