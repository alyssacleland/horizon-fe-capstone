/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react';
import { Button, Card, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faCircleInfo, faPenToSquare, faTrashCan, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../utils/context/authContext';
import { getUser, updateUser } from '../api/userData';
import { deleteReward, getSingleReward, updateReward } from '../api/rewardData';

export default function RewardCard({ rewardObj, onUpdate, onClaim }) {
  const { user } = useAuth();
  const [userObj, setUserObj] = useState([]);
  const [theRewardObj, setTheRewardObj] = useState([]);
  const { firebaseKey } = rewardObj;
  const [successMessage, setSuccessMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  // get the user obj from firebase and set it in state any time the rewardObj changes.
  // over in all rewards page, claiming a reward triggers a change on the rewardObj (rewardObj is a prop passed in here) which triggers this userEffect to run
  useEffect(() => {
    getUser(user.uid).then(setUserObj);
  }, [rewardObj]);

  // get and set reward obj
  useEffect(() => {
    getSingleReward(firebaseKey).then((data) => setTheRewardObj(data));
  }, [rewardObj]);

  // on deleting, delete and rerender (pass onUpdate which gets rewards)
  const deleteThisReward = () => {
    if (window.confirm(`Delete ${rewardObj.name}?`)) {
      deleteReward(firebaseKey).then(() => onUpdate());
    }
  };

  // decrement user tokens
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

    // subtract taskObj.token_value from the user's current token count
    const updatedUserCurrentTokens = userCurrentTokens - rewardTokenValue;

    // get the task's completions
    const { claims } = theRewardObj;

    // +1 to task's claims
    const updatedClaims = claims + 1;

    // update the user payload with updated tokens
    const userPayload = { ...userObj[0], current_tokens: updatedUserCurrentTokens };

    // update the reward payload with udpated claims
    const rewardPayload = { ...theRewardObj, claims: updatedClaims };

    // update the user object in firebase
    updateUser(userPayload).then(() => {
      // show success message
      setSuccessMessage(`Reward Claimed! You spent ${rewardObj.token_value} tokens, ENJOY!`);
      setTimeout(() => {
        setSuccessMessage('');
      }, 8000);
      // update the user object in state
      setUserObj(userPayload);

      window.refreshUser(); // hacky way to refresh user object in the navbar
      // run the onComplete function from the parent component. it should update the user object in the parent component
      onClaim();
    });

    // update the task obj in firebase with completions patched
    updateReward(rewardPayload).then(() => {
      setTheRewardObj(rewardPayload);
      onClaim();
    });
  };

  return (
    <>
      <Card style={{ width: '14rem' }}>
        {/* reward name */}
        <div style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', minHeight: '75px', maxHeight: '100px', padding: '10px' }}>
          <Card.Title style={{ fontSize: '1.1rem', marginRight: '8px' }}>{rewardObj.name}</Card.Title>

          {/* tokens */}
          <FontAwesomeIcon icon={faCoins} style={{ color: '#be8e00', fontSize: '1rem' }} />
          <Card.Title style={{ fontSize: '1.3rem', margin: '2px', color: '#be8e00' }}>{rewardObj.token_value}</Card.Title>
        </div>

        {/* image */}
        <Card.Img variant="top" className="faded-image" style={{ height: '150px', objectFit: 'cover', padding: '' }} src={rewardObj.image} />

        {/* buttons */}
        <div className="d-flex align-items-center justify-content-center">
          {/* details button */}
          <OverlayTrigger placement="bottom" overlay={<Tooltip id={`tooltip-${rewardObj.firebaseKey}`}>Details</Tooltip>}>
            <Link href={`/reward/${rewardObj.firebaseKey}`} passHref>
              <FontAwesomeIcon className="m-2 fa-2x" icon={faCircleInfo} style={{ color: 'grey', fontSize: '1.3rem' }} />
            </Link>
          </OverlayTrigger>

          {/* edit button */}
          <OverlayTrigger placement="bottom" overlay={<Tooltip id={`tooltip-${rewardObj.firebaseKey}`}>Edit</Tooltip>}>
            <Link href={`/reward/edit/${rewardObj.firebaseKey}`} passHref>
              <FontAwesomeIcon className="m-2 fa-2x" icon={faPenToSquare} style={{ color: 'grey', fontSize: '1.3rem' }} />
            </Link>
          </OverlayTrigger>

          {/* delete button */}
          <OverlayTrigger placement="bottom" overlay={<Tooltip id={`tooltip-${rewardObj.firebaseKey}`}>Delete</Tooltip>}>
            <FontAwesomeIcon className="m-2 fa-2x" style={{ color: 'grey', fontSize: '1.3rem', cursor: 'pointer' }} icon={faTrashCan} onClick={deleteThisReward} />
          </OverlayTrigger>

          {/* claim button */}
          <OverlayTrigger placement="bottom" overlay={<Tooltip id={`tooltip-${rewardObj.firebaseKey}`}>Claim</Tooltip>}>
            <FontAwesomeIcon className="m-2 fa-2x" icon={faCartShopping} style={{ color: '#6898ab', fontSize: '1.7rem', cursor: 'pointer' }} onClick={decrementUserTokens} />
          </OverlayTrigger>
        </div>

        {successMessage && <h6 style={{ color: '#6898ab' }}>{successMessage}</h6>}
      </Card>

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

RewardCard.propTypes = {
  rewardObj: PropTypes.shape({
    name: PropTypes.string,
    firebaseKey: PropTypes.string,
    image: PropTypes.string,
    token_value: PropTypes.number,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onClaim: PropTypes.func.isRequired,
};
