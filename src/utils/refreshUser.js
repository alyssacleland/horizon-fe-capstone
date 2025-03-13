//  'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/utils/context/authContext';
// import { getTasks } from '../api/taskData';
// import { getUser } from '../api/userData';

// const refreshUser = () => {

//     // set state for user object
//     const [userObj, setUserObj] = useState({});
//     // for access to uid
//     const { user } = useAuth();
//     // set state for tasks
//     const [tasks, setTasks] = useState([]);

//     // function to get all tasks
//     const getAllTheTasks = () => {
//       getTasks(user.uid).then(setTasks);
//     };

//     // function to refresh user object and tasks.
//     // refreshing tasks triggers a change on the taskObj's so that useEffect in TaskCard will re-render (its' depenency array is taskObj)
//     const getUserObjAndTasks = () => {
//       getUser(user.uid).then((data) => setUserObj(data));
//       getTasks(user.uid).then((data) => setTasks(data));
//     };

//     // get user object and tasks on mount
//     useEffect(() => {
//       getUserObjAndTasks();
//     }, []);
//   }
