'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { getCategories } from '../../api/categoryData';
import { createTask, updateTask } from '../../api/taskData';
import { useAuth } from '../../utils/context/authContext';

// define initial state
const initialState = {
  category_id: '',
  completions: 0,
  description: '',
  firebaseKey: '',
  image: '',
  name: '',
  token_value: 0,
  uid: '',
};

export default function TaskForm({ obj = initialState }) {
  // define state for formInput and categories & and define router and user
  const [formInput, setFormInput] = useState(obj);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const { user } = useAuth();

  // get categories for select menu, and...
  // whenever obj changes, if it has a firebaseKey, set the form input to the obj
  useEffect(() => {
    getCategories(user.uid).then(setCategories);

    if (obj.firebaseKey) {
      setFormInput(obj);
    }
  }, [obj, user]);

  // whenever input field changes, update formInput with that input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: name === 'token_value' ? Number(value) : value, // convert token_value to number
    }));
  };

  // handle submit for update and create
  const handleSubmit = (e) => {
    e.preventDefault();
    // UPDATE
    if (obj.firebaseKey) {
      updateTask(formInput).then(() => router.push(`/`));
    } else {
      // CREATE
      const payload = { ...formInput, uid: user.uid };
      console.log('Submitting payload:', payload); // Debugging step
      createTask(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateTask(patchPayload).then(() => {
          router.push(`/`);
        });
      });
    }
  };

  return (
    <div style={{ maxWidth: '500px', display: 'flex', margin: '0 auto' }}>
      <Form onSubmit={handleSubmit}>
        <h2 className="mt-5" style={{ marginBottom: '30px' }}>
          {obj.firebaseKey ? 'Update' : 'Create a New'} Task
        </h2>

        {/* select category */}
        <Form.Group style={{ marginBottom: '8px' }}>
          <Form.Label> Select Category: </Form.Label>
          <Form.Select aria-label="category" name="category_id" onChange={handleChange} className="mb-3" value={formInput.category_id || ''} required>
            <option value="">Select a Category</option>
            {categories.map((category) => (
              <option key={category.firebaseKey} value={category.firebaseKey}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* STRETCH: or create category, modal appears before redirect (options to cancel or go) TODO: */}

        {/* task name input */}
        <Form.Group>
          <Form.Label>Task Name:</Form.Label>
          <FloatingLabel controlId="floatingInput1" label="Enter Task Name" className="mb-3">
            <Form.Control type="text" placeholder="Enter Task Name" name="name" value={formInput.name} onChange={handleChange} required />
          </FloatingLabel>
        </Form.Group>

        {/* description input */}
        <Form.Group>
          <Form.Label>Task Description:</Form.Label>
          <FloatingLabel controlId="floatingInput2" label="Enter Task Description" className="mb-3">
            <Form.Control type="text" placeholder="Enter Task Description" name="description" value={formInput.description} onChange={handleChange} required />
          </FloatingLabel>
        </Form.Group>

        {/* token value input, with question mark hover that explains */}
        <Form.Group>
          <Form.Label>
            Token Value:
            <OverlayTrigger placement="bottom" overlay={<Tooltip id="tokenInfo">How many tokens will you earn each time you complete this task?</Tooltip>}>
              <FontAwesomeIcon style={{ color: 'grey', fontSize: '1.6rem', marginLeft: '7px' }} icon={faCircleQuestion} />
            </OverlayTrigger>
          </Form.Label>
        </Form.Group>
        <FloatingLabel controlId="floatingInput3" label="Enter Token Value" className="mb-3">
          <Form.Control type="text" placeholder="Enter Token Value" name="token_value" value={formInput.token_value} onChange={handleChange} required />
        </FloatingLabel>

        {/* image input */}
        <Form.Group>
          <Form.Label>Task Image:</Form.Label>
          <FloatingLabel controlId="floatingInput4" label="Enter Image URL" className="mb-3">
            <Form.Control type="text" placeholder="Enter Image URL" name="image" value={formInput.image} onChange={handleChange} required />
          </FloatingLabel>
        </Form.Group>

        <Button variant="primary" type="submit">
          {obj.firebaseKey ? 'Update' : 'Create'} Task
        </Button>
      </Form>
    </div>
  );
}

TaskForm.propTypes = {
  obj: PropTypes.shape({
    category_id: PropTypes.string,
    completions: PropTypes.number,
    description: PropTypes.string,
    firebaseKey: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    token_value: PropTypes.number,
    uid: PropTypes.string,
  }).isRequired,
};
