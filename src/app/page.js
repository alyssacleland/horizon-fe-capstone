/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/utils/context/authContext';
import { Button } from 'react-bootstrap';
import Select from 'react-select';
import TaskCard from '../components/TaskCard';
import { getTasks, getCategoryTasks } from '../api/taskData';
import { getCategories } from '../api/categoryData';

function TasksPage() {
  // set state for tasks
  const [tasks, setTasks] = useState([]);
  // set state for categories
  const [categories, setCategories] = useState([]);
  // set state for selected categories
  const [selectedCategories, setSelectedCategories] = useState([]);
  // for access to uid
  const { user } = useAuth();

  // function to get all tasks
  const getAllTheTasks = () => {
    getTasks(user.uid).then(setTasks);
  };

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
      setCategories(data.map((cat) => ({ value: cat.firebaseKey, label: cat.name })));
    });
  }, [user.uid]); // only run when user.uid changes

  return (
    <div
      className="text-center my-4"
      style={{
        height: '90vh',
        padding: '30px',
        // maxWidth: '400px',
        margin: '0 auto',
      }}
    >
      <h1>Your Tasks! You got this!</h1>
      <div style={{ margin: '20px' }}>
        {/* TODO: Create new task */}
        <Button variant="primary">New Task</Button>
        <div className="container mt-3">
          {/* select categories menu */}
          <div className="container mt-3">
            <Select
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
        </div>
      </div>

      <div className="d-flex flex-wrap" style={{ justifyContent: 'center', gap: '20px', overflowY: 'auto', maxHeight: '750px', maxWidth: '1500px' }}>
        {tasks.length > 0 ? tasks.map((task) => <TaskCard key={task.firebaseKey} taskObj={task} onUpdate={getAllTheTasks} />) : <h2>No Tasks Yet, create a task to get started!</h2>}
      </div>
    </div>
  );
}
export default TasksPage;
