/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/utils/context/authContext';
import { Button } from 'react-bootstrap';
import Select from 'react-select';
import Link from 'next/link';
import TaskCard from '../components/TaskCard';
import { getTasks, getCategoryTasks } from '../api/taskData';
import { getCategories } from '../api/categoryData';
import { getUser } from '../api/userData';
import Tokens from '../components/Tokens';

function TasksPage() {
  // set state for tasks
  const [tasks, setTasks] = useState([]);
  // set state for categories
  const [categories, setCategories] = useState([]);
  // set state for selected categories
  const [selectedCategories, setSelectedCategories] = useState([]);
  // set state for user object
  const [userObj, setUserObj] = useState({});
  // for access to uid
  const { user } = useAuth();

  // function to get all tasks
  const getAllTheTasks = () => {
    getTasks(user.uid).then(setTasks);
  };

  // function to refresh user object and tasks.
  // refreshing tasks triggers a change on the taskObj's so that useEffect in TaskCard will re-render (its' depenency array is taskObj)
  const getUserObjAndTasks = () => {
    getUser(user.uid).then((data) => setUserObj(data));
    getTasks(user.uid).then((data) => setTasks(data));
  };

  // get user object and tasks on mount
  useEffect(() => {
    getUserObjAndTasks();
  }, []);

  // retrieve tasks from firebase (filtered or all): initially or when categories are selected
  useEffect(() => {
    if (selectedCategories.length === 0) {
      // if no categories are selected, get all tasks
      getTasks(user.uid).then((taskArray) => setTasks(taskArray));
    } else {
      // if categories are selected, get tasks for each selected category
      Promise.all(selectedCategories.map((category) => getCategoryTasks(category.value))).then((taskArrays) => {
        setTasks(taskArrays.flat());
      }); // The flat() method of Array instances creates a new array with all sub-array elements concatenated into it recursively up to the specified depth.
    }
  }, [selectedCategories]); // only run when selectedCategories changes

  // retrieve categories from firebase for the dropdown menu
  useEffect(() => {
    getCategories(user.uid).then((data) => {
      // set state for categories. map over the data to create an array of objects with value and label properties
      setCategories(data.map((category) => ({ value: category.firebaseKey, label: category.name })));
    });
  }, [user.uid]); // only run when user.uid changes

  return (
    <div
      className="text-center my-4"
      style={{
        height: '90px',
        padding: '0px',
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      {/* HOPEFULLY JUST TEMPORARY DISPLAYING THESE HERE */}
      <Tokens userObj={userObj} />

      <h2 style={{ marginBottom: '30px' }}>{user.displayName}&apos;s Tasks:</h2>
      <div className="d-flex align-items-center justify-content-center" style={{ gap: '10px', marginBottom: '20px' }}>
        {/* Create new task */}
        <Link href="/task/new" passHref>
          <Button variant="primary">New Task</Button>
        </Link>
        {/* select categories menu */}
        <Select
          style={{ maxWidth: '300px' }}
          options={categories}
          isMulti
          value={selectedCategories}
          onChange={setSelectedCategories}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Select Categories..."
          styles={{
            control: (provided) => ({
              ...provided,
              color: 'black',
            }),
            singleValue: (provided) => ({
              ...provided,
              color: 'black',
            }),
            multiValue: (provided) => ({
              ...provided,
              color: 'black',
            }),
            input: (provided) => ({
              ...provided,
              color: 'black',
            }),
            menu: (provided) => ({
              ...provided,
              color: 'black',
            }),
            option: (provided) => ({
              ...provided,
              color: 'black',
            }),
          }}
        />
      </div>

      {/* tasks cards or text if no tasks */}
      <div className="d-flex flex-wrap align-itmes-center mx-auto" style={{ justifyContent: 'center', gap: '20px', overflowY: 'auto', maxHeight: '600px', maxWidth: '1500px' }}>
        {tasks.length > 0 ? tasks.map((task) => <TaskCard key={task.firebaseKey} taskObj={task} onUpdate={getAllTheTasks} onComplete={getUserObjAndTasks} />) : <h2>No Tasks Yet, create a task to get started!</h2>}
      </div>
    </div>
  );
}
export default TasksPage;
