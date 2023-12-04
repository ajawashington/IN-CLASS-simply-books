/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import {
  Navbar, Container, Nav, Button,
} from 'react-bootstrap';
import { signOut } from '../utils/auth';
import { useAuth } from '../utils/context/authContext';
import { clientCredentials } from '../utils/client';

export default function NavBar() {
  const { dbUser, user } = useAuth();
  const { adminUser } = clientCredentials;

  return (
    !dbUser
      ? (
        <Navbar expand="lg" bg="light" variant="light">
          <Container>
            <Link passHref href="/">
              <Navbar.Brand>📚 Simply Books 📚</Navbar.Brand>
            </Link>
          </Container>
        </Navbar>
      ) : (
        <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
          <Container>
            <Link passHref href="/">
              <Navbar.Brand>📚 Simply Books 📚</Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse className="justify-content-end">
              <Nav className="ml-auto">
                {/* CLOSE NAVBAR ON LINK SELECTION: https://stackoverflow.com/questions/72813635/collapse-on-select-react-bootstrap-navbar-with-nextjs-not-working */}
                <Link passHref href="/">
                  <Nav.Link>Home</Nav.Link>
                </Link>
                <Link passHref href="/books">
                  <Nav.Link>Books</Nav.Link>
                </Link>
                <Link passHref href="/authors">
                  <Nav.Link>Authors</Nav.Link>
                </Link>
                {adminUser === user.uid ? (
                  <Link passHref href="/orders">
                    <Nav.Link>Orders</Nav.Link>
                  </Link>
                ) : ''}
                <Link passHref href="/community">
                  <Nav.Link>Community</Nav.Link>
                </Link>
                <Link passHref href="/profile">
                  <Nav.Link>Profile</Nav.Link>
                </Link>
                <Button type="button" className="btn-danger" onClick={(signOut)}>
                  Sign Out
                </Button>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )
  );
}

NavBar.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string,
    photoURL: PropTypes.string,
  }).isRequired,
};
