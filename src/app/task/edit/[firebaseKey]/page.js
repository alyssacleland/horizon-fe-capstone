'use client';

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TaskForm from '../../../../components/forms/TaskForm';
import { getSingleTask } from '../../../../api/taskData';

export default function EditTaskPage({ params }) {
  const [editItem, setEditItem] = useState({});
  const { firebaseKey } = params;

  useEffect(() => {
    getSingleTask(firebaseKey).then(setEditItem);
  }, [firebaseKey]);

  return <TaskForm obj={editItem} />;
}

EditTaskPage.propTypes = {
  params: PropTypes.shape({
    firebaseKey: PropTypes.string.isRequired,
  }).isRequired,
};
