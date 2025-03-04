/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import propTypes from 'prop-types';
import TaskCard from '../../../components/TaskCard';
import { viewCategoryDetails } from '../../../api/mergedData';
import { getUser } from '../../../api/userData';
import { useAuth } from '../../../utils/context/authContext';

export default function CategoryDetailsPage({ params }) {
  const { firebaseKey } = params; // destructuring the params object

  // set state for categoryDetails
  const [categoryDetails, setCategoryDetails] = useState({});
  const [userObj, setUserObj] = useState({});
  const { user } = useAuth();

  // retrieve category details from firebase
  useEffect(() => {
    viewCategoryDetails(firebaseKey).then(setCategoryDetails);
  }, [firebaseKey]);

  // function to get all tasks
  const getAllTheTasks = () => {
    viewCategoryDetails(firebaseKey).then(setCategoryDetails);
  };

  // function to refresh user object and tasks.
  // refreshing tasks triggers a change on the taskObj's so that useEffect in TaskCard will re-render (its' depenency array is taskCard)
  const getUserObjAndDetails = () => {
    getUser(user.uid).then((data) => setUserObj(data));
    viewCategoryDetails(firebaseKey).then((data) => setCategoryDetails(data));
  };

  // get user object and details on mount
  useEffect(() => {
    getUserObjAndDetails();
  }, []);

  const tasksArray = categoryDetails.tasks || []; // if categoryDetails.tasks is undefined, set it to an empty array

  console.log(categoryDetails);

  return (
    <div className="text-center my-4">
      <h2 style={{ marginBottom: '30px' }}>{categoryDetails.name} Tasks: </h2>
      <div className="d-flex flex-wrap justify-content-center align-items-center mx-auto" style={{ display: 'flex', gap: '20px', overflowY: 'auto', maxHeight: '600px', maxWidth: '1500px' }}>
        {tasksArray.length > 0 ? (
          tasksArray.map((task) => (
            <div className="d-flex justify-content-center">
              <TaskCard key={task.firebaseKey} taskObj={task} onUpdate={getAllTheTasks} onComplete={getUserObjAndDetails} />
            </div>
          ))
        ) : (
          <p>
            No {categoryDetails.name} tasks yet,
            <Link href="/task/new" passHref>
              <Button variant="link">create one?</Button>
            </Link>
          </p>
        )}
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
