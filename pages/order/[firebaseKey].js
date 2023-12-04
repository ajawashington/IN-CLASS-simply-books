/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import Link from 'next/link';
import { getOrderDetails } from '../../api/mergedData';
import { useAuth } from '../../utils/context/authContext';
import {
  createOrderBook, deleteBookOrder, getSingleBookOrder, updateOrderBook,
} from '../../api/orderBookData';

export default function ViewOrder() {
  const [orderDetails, setOrderDetails] = useState({});
  const { user } = useAuth();

  const router = useRouter();
  const { firebaseKey } = router.query;

  useEffect(() => {
    getOrderDetails(firebaseKey, user.uid).then(setOrderDetails);
  }, [orderDetails.booksInOrder]);

  const addBookToOrder = (bookFirebaseKey) => {
    const payload = { orderId: orderDetails.firebaseKey, bookId: bookFirebaseKey };

    createOrderBook(payload).then(({ name }) => {
      const patchPayload = { firebaseKey: name };

      updateOrderBook(patchPayload).then(() => router.push(`/order/${firebaseKey}`));
    });
  };

  const deleteBookFromOrder = (bookId) => {
    getSingleBookOrder(bookId, firebaseKey).then((orderBook) => deleteBookOrder(orderBook.firebaseKey));
  };
  const total = orderDetails.booksInOrder?.reduce((prev, next) => prev + +next.price, 0);

  return (
    <>
      <div className="mt-5 d-flex flex-wrap">
        <div className="d-flex flex-column">
          <div className="text-white ms-5 details">
            <h2>{orderDetails.customer_name} {orderDetails.orderType}</h2>
            Order Email: <a href="mailto:aja@aja.com">${orderDetails.email}</a>
          </div>
          <h4 style={{ color: 'white' }}>Order Total ${total?.toFixed(2)}</h4>
          <h2 style={{ color: 'white' }}>Books In Order</h2>
          { orderDetails.booksInOrder?.length > 0 ? orderDetails.booksInOrder?.map((book) => (
            <Card key={book.firebaseKey} style={{ width: '10rem', margin: '1rem' }}>
              <Card.Img variant="top" src={book.image} alt={book.title} style={{ height: '200px' }} />
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <p className="card-text bold">{book.sale && <span>SALE<br /></span> } ${book.price}</p>
                {/* DYNAMIC LINK TO VIEW THE BOOK DETAILS  */}
                <Link href={`/book/${book.firebaseKey}`} passHref>
                  <Button variant="primary" className="m-2">VIEW</Button>
                </Link>
                <Button variant="danger" onClick={() => deleteBookFromOrder(book.firebaseKey)} className="m-2">
                  DELETE
                </Button>
              </Card.Body>
            </Card>
          )) : <h2 style={{ color: 'white' }}>No Books In Cart</h2> }
          <h3 style={{ color: 'white' }}> Add Books to Order</h3>
          { orderDetails.booksNotInOrder?.map((book) => (
            <Card key={book.firebaseKey}>
              <img className="card-img-top" src={book.image} alt={book.title} style={{ height: '80px', width: '80px' }} />
              <div className="card-body">
                <h5 className="card-title">${book.title}</h5>
                <p className="card-text bold">{ book.sale ? `🏷️ Sale $${book.price}` : `$${book.price}` }</p>
              </div>
              <Button onClick={() => addBookToOrder(book.firebaseKey)}> Add Book To Bag</Button>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
