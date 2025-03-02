/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { signOut } from '../utils/auth';
import { getUser } from '../api/userData';
import { useAuth } from '../utils/context/authContext';

export default function NavBar() {
  const [userObj, setUserObj] = useState({});
  const [prevCurrentTokens, setPrevCurrentTokens] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    getUser(user.uid).then((data) => {
      setUserObj(data);
    });
  }, [userObj]);

  useEffect(() => {
    getUser(user.uid).then((data) => {
      setUserObj(data);
      setPrevCurrentTokens(data[0]?.current_tokens || 0);
    });
  }, []);

  // ANIMATION
  useEffect(() => {
    if (!userObj[0]) return undefined; // Prevent running if userObj isn't ready
    // If the user's current tokens change, add an animation class:
    if (userObj[0]?.current_tokens > prevCurrentTokens) {
      // If the user's current tokens increase, add a bounce animation
      setAnimationClass('fa-bounce');
      // If the user's current tokens decrease, add a fade animation:
    } else if (userObj[0]?.current_tokens < prevCurrentTokens) {
      setAnimationClass('fa-fade');
    }

    const timer = setTimeout(() => {
      // setTimeout sytnax: setTimeout(function, milliseconds, param1, param2, ...) params being a fx to be executed after the timer expires (none here but just so i know)
      setAnimationClass('');
    }, 1000); // Remove animation class after 1 second

    // Set the previous tokens to the user's current tokens:
    // The reason you need to update prevCurrentTokens after the comparison is to ensure that the next time the useEffect hook runs, it has the correct previous value to compare against the current value. This allows you to detect changes in the current_tokens value accurately.
    setPrevCurrentTokens(userObj[0]?.current_tokens);

    // Clear the timer
    return () => {
      clearTimeout(timer);
    }; // clearTimeout(timeoutID): method clears a timer set with the setTimeout() method
  }, [userObj[0]?.current_tokens]);

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
            {/*  current tokens, TODO: Add animation class back in as className later */}
            <FontAwesomeIcon className={animationClass} icon={faCoins} style={{ color: '#be8e00', fontSize: '1.3rem', marginLeft: '10px' }} />
            <p style={{ fontSize: '1.6rem', margin: '2px', color: '#be8e00' }}>{userObj[0]?.current_tokens}</p>
            {/* lifetime tokens */}
            <FontAwesomeIcon className={animationClass} icon={faCoins} style={{ color: '#9028ff', fontSize: '1.3rem', marginLeft: '10px' }} />
            <p style={{ fontSize: '1.6rem', margin: '2px', color: '#9028ff' }}>{userObj[0]?.lifetime_tokens}</p>
          </Nav>

          <Button variant="danger" onClick={signOut}>
            Sign Out
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
