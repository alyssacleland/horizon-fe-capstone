'use client';

import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { useAuth } from '../../utils/context/authContext';
import { createCategory, updateCategory } from '../../api/categoryData';

// define initial state
const initialState = {
  firebaseKey: '',
  name: '',
  uid: '',
};
export default function CategoryForm({ obj = initialState }) {
  // define state for formInput and define router and user
  const { user } = useAuth();
  const router = useRouter();
  const [formInput, setFormInput] = useState(obj);

  // whenever obj changes, if it has a firebaseKey, set the formInput to the obj
  useEffect(() => {
    if (obj.firebaseKey) setFormInput(obj);
  }, [obj]);

  // whenever input field changes, update formInput with that input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value, // here, name is actually name (what the data property key in firebase is)
    }));
  };

  // handleSubmit for update and for create
  const handleSubmit = (e) => {
    e.preventDefault();
    // UPDATE
    if (obj.firebaseKey) {
      updateCategory(formInput).then(() => router.push(`/categories`));
    } else {
      // CREATE
      const payload = { ...formInput, uid: user.uid };
      createCategory(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateCategory(patchPayload).then(() => {
          router.push(`/categories`);
        });
      });
    }
  };

  return (
    <div style={{ maxWidth: '500px', display: 'flex', margin: '0 auto' }}>
      <Form onSubmit={handleSubmit}>
        <h2 className="mt-5" style={{ marginBottom: '30px' }}>
          {obj.firebaseKey ? 'Update' : 'Create a New'} Category
        </h2>
        <FloatingLabel controlId="floatingInput1" label="Enter Category Name" className="mb-3">
          <Form.Control type="text" placeholder="Enter Category Name" name="name" value={formInput.name} onChange={handleChange} required />
        </FloatingLabel>

        <Button variant="primary" type="submit">
          {obj.firebaseKey ? 'Update' : 'Create'} Category
        </Button>
      </Form>
    </div>
  );
}

// prop types
CategoryForm.propTypes = {
  obj: PropTypes.shape({
    name: PropTypes.string,
    uid: PropTypes.string,
    firebaseKey: PropTypes.string,
  }),
};
