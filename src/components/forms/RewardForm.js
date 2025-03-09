'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useAuth } from '../../utils/context/authContext';
import { createReward, updateReward } from '../../api/rewardData';

// define initial state
const initialState = {
  claims: 0,
  description: '',
  firebaseKey: '',
  image: '',
  name: '',
  token_value: 0,
  uid: '',
};

export default function RewardForm({ obj = initialState }) {
  // define state for formInput and define router and user
  const [formInput, setFormInput] = useState({});
  const router = useRouter();
  const { user } = useAuth();

  // whenever obj changes, if it has a firebaseKey, set the formInput to the obj
  useEffect(() => {
    if (obj.firebaseKey) {
      setFormInput(obj);
    }
  }, [obj]);

  // whenever input field changes, update formInput with that input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: name === 'token_value' || name === 'claims' ? Number(value) : value, // convert token_value and claims to number
    }));
  };

  // handleSubmit for update and for create
  const handleSubmit = (e) => {
    e.preventDefault();
    // UPDATE
    if (obj.firebaseKey) {
      updateReward(formInput).then(() => router.push(`/rewards`));
    } else {
      // CREATE
      const payload = { ...formInput, uid: user.uid, claims: 0 };
      createReward(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateReward(patchPayload).then(() => {
          router.push(`/rewards`);
        });
      });
    }
  };

  return (
    <div style={{ maxWidth: '500px', display: 'flex', margin: '0 auto' }}>
      <Form onSubmit={handleSubmit}>
        <h2 className="mt-5" style={{ marginBottom: '30px' }}>
          {obj.firebaseKey ? 'Update' : 'Create a New'} Reward
        </h2>

        {/* reward name input */}
        <Form.Group>
          <Form.Label>Reward Name:</Form.Label>
          <FloatingLabel controlId="floatingInput1" label="Enter Reward Name" className="mb-3">
            <Form.Control type="text" placeholder="Enter Reward Name" name="name" value={formInput.name} onChange={handleChange} required />
          </FloatingLabel>
        </Form.Group>

        {/* description input */}
        <Form.Group>
          <Form.Label>Reward Description:</Form.Label>
          <FloatingLabel controlId="floatingInput2" label="Enter Reward Description" className="mb-3">
            <Form.Control type="text" placeholder="Enter Reward Description" name="description" value={formInput.description} onChange={handleChange} required />
          </FloatingLabel>
        </Form.Group>

        {/* token value input, with question mark hover that explains */}
        <Form.Group>
          <Form.Label>
            Token Cost:
            <OverlayTrigger placement="bottom" overlay={<Tooltip id="tokenInfo">How many tokens will you spend each time you claim this reward?</Tooltip>}>
              <FontAwesomeIcon style={{ color: 'grey', fontSize: '1.6rem', marginLeft: '7px' }} icon={faCircleQuestion} />
            </OverlayTrigger>
          </Form.Label>
        </Form.Group>
        <FloatingLabel controlId="floatingInput3" label="Enter Token Cost" className="mb-3">
          <Form.Control type="text" placeholder="Enter Token Cost" name="token_value" value={formInput.token_value} onChange={handleChange} required />
        </FloatingLabel>

        {/* image input */}
        <Form.Group>
          <Form.Label>Reward Image:</Form.Label>
          <FloatingLabel controlId="floatingInput4" label="Enter Image URL" className="mb-3">
            <Form.Control type="text" placeholder="Enter Image URL" name="image" value={formInput.image} onChange={handleChange} required />
          </FloatingLabel>
        </Form.Group>

        <Button variant="primary" type="submit">
          {obj.firebaseKey ? 'Update' : 'Create'} Reward
        </Button>
      </Form>
    </div>
  );
}

// prop types
RewardForm.propTypes = {
  obj: PropTypes.shape({
    claims: PropTypes.number,
    description: PropTypes.string,
    firebaseKey: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    token_value: PropTypes.number,
    uid: PropTypes.string,
  }).isRequired,
};
