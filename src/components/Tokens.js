/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

export default function Tokens({ userObj }) {
  const [prevCurrentTokens, setPrevCurrentTokens] = useState(0);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    setPrevCurrentTokens(userObj[0]?.current_tokens);
  }, []);

  const isFirstRender = useRef(true); // Ref to track the first render

  // ANIMATION
  useEffect(() => {
    // Skip animation logic on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!userObj || !userObj[0]) {
      return; // Prevent running if userObj isn't ready
    }
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
    // eslint-disable-next-line consistent-return
    return () => {
      clearTimeout(timer);
    }; // clearTimeout(timeoutID): method clears a timer set with the setTimeout() method
  }, [userObj]);

  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {/*  current tokens */}
      <OverlayTrigger placement="bottom" overlay={<Tooltip id={`tooltip-${userObj[0]?.firebaseKey}`}>Current Token Balance</Tooltip>}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
          <FontAwesomeIcon className={animationClass} icon={faCoins} style={{ color: '#be8e00', fontSize: '1.3rem', marginLeft: '10px' }} />
          <p style={{ fontSize: '1rem', margin: '0px', color: '#be8e00' }}>{userObj[0]?.current_tokens}</p>
        </span>
      </OverlayTrigger>

      {/* lifetime tokens */}
      <OverlayTrigger placement="bottom" overlay={<Tooltip id={`tooltip-${userObj[0]?.firebaseKey}`}>Lifetime Tokens Earned</Tooltip>}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
          <FontAwesomeIcon icon={faCoins} style={{ color: '#9028ff', fontSize: '1.3rem', marginLeft: '10px' }} />
          <p style={{ fontSize: '1rem', margin: '0px', color: '#9028ff' }}>{userObj[0]?.lifetime_tokens}</p>
        </span>
      </OverlayTrigger>
    </div>
  );
}

Tokens.propTypes = {
  userObj: PropTypes.shape({
    current_tokens: PropTypes.number,
    firebaseKey: PropTypes.string,
    lifetime_tokens: PropTypes.number,
  }).isRequired,
};
