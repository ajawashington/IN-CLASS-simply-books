// for merged promises

import { deleteSingleAuthor, getAuthorBooks, getSingleAuthor } from './authorData';
import { deleteBook, getBooks, getSingleBook } from './bookData';
import { getMessages } from './messageData';
import { deleteBookOrder, getOrderBooks } from './orderBookData';
import { deleteOrder, getSingleOrder } from './orderData';
import { getSingleUser } from './userData';

const getBookDetails = (firebaseKey) => new Promise((resolve, reject) => {
  getSingleBook(firebaseKey).then((bookObj) => {
    getSingleAuthor(bookObj.author_id).then((authorObject) => {
      resolve({ ...bookObj, authorObject });
    });
  }).catch(reject);
});

const getAuthorDetails = async (firebaseKey) => {
  const author = await getSingleAuthor(firebaseKey);
  const books = await getAuthorBooks(author.firebaseKey);

  return { ...author, books };
};

const deleteAuthorBooksRelationship = (firebaseKey) => new Promise((resolve, reject) => {
  getAuthorBooks(firebaseKey).then((authorsBookArray) => {
    const deleteBookPromises = authorsBookArray.map((book) => deleteBook(book.firebaseKey));

    Promise.all(deleteBookPromises).then(() => {
      deleteSingleAuthor(firebaseKey).then(resolve);
    });
  }).catch(reject);
});

const getOrderDetails = async (orderId, uid) => {
  // GET ORDER
  const order = await getSingleOrder(orderId);

  // GET ALL BOOKS
  const allBooks = await getBooks(uid);

  // GET ALL ORDERBOOKS
  const allOrderBooks = await getOrderBooks(orderId);

  // GET SINGLE BOOKS IN ORDER
  const books = await allOrderBooks.map((orderBook) => getSingleBook(orderBook.bookId));

  // MOST USE PROMISE.ALL() TO RETURN EACH BOOK IN ORDER
  const booksInOrder = await Promise.all(books);

  // FILTERED BOOKS NOT IN ORDER
  const booksNotInOrder = await allBooks.filter((obj) => !booksInOrder.some((e) => e.firebaseKey === obj.firebaseKey));

  // RETURNS THE SINGLE ORDER AND ALL BOOKS FOUND RELATED TO ORDER
  return { ...order, booksInOrder, booksNotInOrder };
};

const deleteOrderBooksRelationship = (firebaseKey) => new Promise((resolve, reject) => {
  getOrderBooks(firebaseKey).then((orderBooksArray) => {
    const deleteBookPromises = orderBooksArray.map((ob) => deleteBookOrder(ob.firebaseKey));

    Promise.all(deleteBookPromises).then(() => {
      deleteOrder(firebaseKey).then(resolve);
    });
  }).catch(reject);
});

const getAllMessages = async (senderId, receiverId) => {
  const receivedMessages = await getMessages(senderId, receiverId);
  const sentMessages = await getMessages(receiverId, senderId);
  const sender = await getSingleUser(senderId);
  const receiver = await getSingleUser(receiverId);
  const messages = await receivedMessages.concat(sentMessages);

  return { sender, receiver, messages };
};

export {
  getBookDetails,
  getAuthorDetails,
  deleteAuthorBooksRelationship,
  getOrderDetails,
  deleteOrderBooksRelationship,
  getAllMessages,
};
