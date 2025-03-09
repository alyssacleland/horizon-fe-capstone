'use client';

import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faPenToSquare, faTrashCan, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { getUser, updateUser } from '../../../api/userData';
import { deleteReward, getSingleReward, updateReward } from '../../../api/rewardData';
import { useAuth } from '../../../utils/context/authContext';

export default function RewardDetailsPage({ params }) {
  // access reward firebase key
  const { firebaseKey } = params;

  // set state for user obj, reward obj, modal, success msg
  // eslint-disable-next-line no-unused-vars
  const [userObj, setUserObj] = useState([]);
  const [rewardObj, setRewardObj] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  // for access to uid
  const { user } = useAuth();

  // for routing to new page
  const router = useRouter();

  // get and set reward obj on initial mount AND any time user obj changes (so updating tokens (from claiming reward) triggers this & updates claims on rewardObj)
  useEffect(() => {
    getSingleReward(firebaseKey).then((data) => setRewardObj(data));
  }, [userObj]);

  // get and set user obj on initial mount AND any time reward obj changes (idk if this will create an infinite loop with the prev use effect?)
  // so any time reward obj changes (like claims updates when claim a reward), get and set the user obj
  useEffect(() => {
    getUser(user.uid).then(setUserObj);
  }, [rewardObj]);

  // delete reward and route to all rewards page
  const deleteThisReward = () => {
    if (window.confirm(`Delete ${rewardObj.name}?`)) {
      deleteReward(firebaseKey).then(() => {
        router.push('/rewards');
      });
    }
  };

  // function to refresh user obj and reward obj (to use in decrement tokens)
  const getUserObjAndReward = () => {
    getUser(user.uid).then(setUserObj);
    getSingleReward(firebaseKey).then(setRewardObj);
  };

  // *** DECREMENT USER TOKENS ***
  const decrementUserTokens = () => {
    // get the reward's token value
    const rewardTokenValue = Number(rewardObj.token_value);

    // get the user object from firebase, this is done in the useEffect above

    // define user's current token count
    const userCurrentTokens = Number(userObj[0]?.current_tokens);

    // if user current tokens is less than reward token value, show modal
    if (userCurrentTokens < rewardTokenValue) {
      setShowModal(true);
      return;
    }

    // subtract rewardObj.token_value from the user's current token count
    const updatedUserCurrentTokens = userCurrentTokens - rewardTokenValue;

    // get the reward's completions
    const { claims } = rewardObj;

    // +1 to reward's claims
    const updatedClaims = claims + 1;

    // update the user payload with updated tokens
    const userPayload = { ...userObj[0], current_tokens: updatedUserCurrentTokens };

    // update the reward payload with udpated claims
    const rewardPayload = { ...rewardObj, claims: updatedClaims };

    // update the user object in firebase
    updateUser(userPayload).then(() => {
      // show success message
      setSuccessMessage(`Reward Claimed! You spent ${rewardObj.token_value} tokens, ENJOY!`);
      setTimeout(() => {
        setSuccessMessage('');
      }, 8000);
      // update the user object in state
      setUserObj(userPayload);
      // update the user obj and reward obj
      getUserObjAndReward();
    });

    // update the reward obj in firebase with claims patched
    updateReward(rewardPayload).then(() => {
      setRewardObj(rewardPayload);
      getUserObjAndReward();
    });
  };

  return (
    <>
      <div style={{ marginTop: '20px' }}>
        {/* image and reward details */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginLeft: '650px' }}>
          {/* image */}
          <img
            className="faded-image"
            alt="Reward"
            style={{
              width: '300px',
              justifyContent: 'center',
              alignItems: 'flex-start',
              objectFit: 'cover',
              marginRight: '20px',
              height: 'auto',
              maxHeight: '300px',
            }}
            src={rewardObj?.image}
          />

          {/* reward details to the right of the image */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '100%' }}>
            {/* reward name */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <h1 style={{ fontSize: '1.6rem', marginRight: '8px' }}>{rewardObj?.name}</h1>

              {/* tokens */}
              <FontAwesomeIcon icon={faCoins} style={{ color: '#be8e00', fontSize: '1.3rem' }} />
              <h1 style={{ fontSize: '1.6rem', margin: '2px', color: '#be8e00' }}>{rewardObj?.token_value}</h1>
            </div>

            {/* DESCRIPTION */}
            <p style={{ marginBottom: '10px' }}>{rewardObj?.description}</p>

            {/* CLAIMS */}
            <h5 style={{ marginTop: '20px', marginBottom: '0' }}>Claimed {rewardObj?.claims} times.</h5>

            {/* BUTTONS */}
            <div className="" style={{ marginTop: '90px' }}>
              {/* Edit button */}
              <OverlayTrigger placement="bottom" overlay={<Tooltip id={`tooltip-${rewardObj.firebaseKey}`}>Edit</Tooltip>}>
                <Link href={`/reward/edit/${rewardObj?.firebaseKey}`} passHref>
                  <FontAwesomeIcon className="m-2 fa-2x" icon={faPenToSquare} style={{ color: 'grey', fontSize: '1.6rem' }} />
                </Link>
              </OverlayTrigger>

              {/* Delete button */}
              <OverlayTrigger placement="bottom" overlay={<Tooltip id={`tooltip-${rewardObj.firebaseKey}`}>Delete</Tooltip>}>
                <FontAwesomeIcon className="m-2 fa-2x" style={{ color: 'grey', fontSize: '1.6rem', cursor: 'pointer' }} icon={faTrashCan} onClick={deleteThisReward} />
              </OverlayTrigger>

              {/* Claim button */}
              <OverlayTrigger placement="bottom" overlay={<Tooltip id={`tooltip-${rewardObj.firebaseKey}`}>Claim</Tooltip>}>
                <FontAwesomeIcon className="m-2 fa-2x" icon={faCartShopping} style={{ color: '#6898ab', fontSize: '2.2rem', cursor: 'pointer' }} onClick={decrementUserTokens} />
              </OverlayTrigger>
            </div>
            {successMessage && <h6 style={{ color: '#6898ab', marginLeft: 'px' }}>{successMessage}</h6>}
          </div>
        </div>

        {/* Back to All Rewards button */}
        <Link style={{ marginLeft: '550px' }} href="/rewards" passHref>
          <Button style={{ marginTop: '20px' }}>Back to All Rewards</Button>
        </Link>
      </div>

      {/* modal for insufficient token balance  */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Insufficient Tokens</Modal.Title>
        </Modal.Header>
        <Modal.Body>You don&apos;t have enough tokens to purchase this reward. Complete tasks to earn more tokens first!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
RewardDetailsPage.propTypes = {
  params: PropTypes.shape({
    firebaseKey: PropTypes.string,
  }),
};
