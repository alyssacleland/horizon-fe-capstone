/* eslint-disable jsx-a11y/anchor-is-valid */
// import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import Image from 'next/image';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { signOut } from '../utils/auth';
// import { getUser } from '../api/userData';
// import { useAuth } from '../utils/context/authContext';
// import Tokens from './Tokens';

export default function NavBar() {
  // const [userObj, setUserObj] = useState([]);
  // const { user } = useAuth();

  // if (!user) return null;

  // const getTheUser = () => {
  //   getUser(user.uid).then(setUserObj);
  // };

  // useEffect(() => {
  //   getTheUser();
  // }, []);

  return (
    <Navbar collapseOnSelect expand="lg" bg="white" variant="light">
      <Container>
        <Link passHref href="/" className="navbar-brand">
          <Image src="/images/horizon-logo-2.png" alt="logo" width={65} height={65} />
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {/* CLOSE NAVBAR ON LINK SELECTION: https://stackoverflow.com/questions/72813635/collapse-on-select-react-bootstrap-navbar-with-nextjs-not-working */}
            <Link className="nav-link" href="/">
              Home
            </Link>
            <Link className="nav-link" href="/">
              Tasks
            </Link>
            <Link className="nav-link" href="/categories">
              Categories
            </Link>
            <Link className="nav-link" href="/routines">
              Routines
            </Link>
            <Link className="nav-link" href="/rewards">
              Rewards
            </Link>
            {/* <Tokens userObj={userObj} /> */}
          </Nav>

          <Button variant="danger" onClick={signOut}>
            Sign Out
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
