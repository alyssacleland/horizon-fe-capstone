import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import Image from 'next/image';
import { signOut } from '../utils/auth';
import { getUser } from '../api/userData';
import { useAuth } from '../utils/context/authContext';
import Tokens from './Tokens';

export default function NavBar() {
  const [userObj, setUserObj] = useState([]);
  const { user } = useAuth();

  // Fetch user data when component mounts or when user UID changes
  useEffect(() => {
    if (user?.uid) {
      getUser(user.uid).then(setUserObj);
    }
  }, [user?.uid]);

  // Function to refresh user data automatically
  const refreshUser = async () => {
    const updatedUser = await getUser(user.uid);
    setUserObj(updatedUser);
  };

  // Expose refresh function globally (for updates in other components)
  useEffect(() => {
    window.refreshUser = refreshUser;
  }, []);

  return (
    <Navbar collapseOnSelect expand="lg" bg="white" variant="light">
      <Container>
        <Link passHref href="/" className="navbar-brand">
          <Image src="/images/horizon-logo-2.png" alt="logo" width={65} height={65} />
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {/* <Link className="nav-link" href="/">
              Home
            </Link> */}
            <Link className="nav-link" href="/">
              Tasks
            </Link>
            <Link className="nav-link" href="/categories">
              Categories
            </Link>
            {/* <Link className="nav-link" href="/routines">
              Routines
            </Link> */}
            <Link className="nav-link" href="/rewards">
              Rewards
            </Link>
            <Tokens userObj={userObj} />
          </Nav>

          <Button variant="danger" onClick={signOut}>
            Sign Out
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
