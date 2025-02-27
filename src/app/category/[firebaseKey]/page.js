'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import propTypes from 'prop-types';
import TaskCard from '../../../components/TaskCard';
import { viewCategoryDetails } from '../../../api/mergedData';

export default function CategoryDetailsPage({ params }) {
  const { firebaseKey } = params; // destructuring the params object

  // set state for categoryDetails
  const [categoryDetails, setCategoryDetails] = useState({});

  // retrieve category details from firebase
  useEffect(() => {
    viewCategoryDetails(firebaseKey).then(setCategoryDetails);
  }, [firebaseKey]);

  const tasksArray = categoryDetails.tasks || []; // if categoryDetails.tasks is undefined, set it to an empty array

  console.log(categoryDetails);

  return (
    <div className="text-center my-4">
      <h1>{categoryDetails.name} tasks: </h1>
      <div className="d-flex flex-wrap justify-content-center align-items-center mx-auto" style={{ display: 'flex', gap: '20px', overflowY: 'auto', maxHeight: '750px' }}>
        {tasksArray.map((task) => (
          <div className="d-flex justify-content-center">
            <TaskCard key={task.firebaseKey} taskObj={task} />
          </div>
        ))}
      </div>
      <Link href="/categories" passHref>
        <Button style={{ marginTop: '20px' }}>Back to Categories</Button>
      </Link>
    </div>
  );
}

CategoryDetailsPage.propTypes = {
  params: propTypes.shape({
    firebaseKey: propTypes.string.isRequired,
  }).isRequired,
};
