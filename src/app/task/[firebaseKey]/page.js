/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getTaskDetails } from '@/api/mergedData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faPenToSquare, faTrashCan, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { deleteTask, getSingleTask, updateTask } from '@/api/taskData';
import { useAuth } from '@/utils/context/authContext';
import { getUser, updateUser } from '@/api/userData';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import LoadingComponent from '../../../components/LoadingComponent';

export default function TaskDetailsPage({ params }) {
  const { firebaseKey } = params;
  const { user } = useAuth();
  const router = useRouter();
  const [userObj, setUserObj] = useState({});
  const [taskDetails, setTaskDetails] = useState({});
  const [taskObj, setTaskObj] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false); // for use in incrementUserTokens
  const [pageLoading, setPageLoading] = useState(true); // for loading page only after data is fetched

  useEffect(() => {
    getTaskDetails(firebaseKey).then((data) => {
      setTaskDetails(data);
      setPageLoading(false);
    });
  }, [firebaseKey]);

  useEffect(() => {
    getSingleTask(firebaseKey).then((data) => setTaskObj(data));
  }, [firebaseKey]);

  // get the user object from firebase and set it in state any time the taskObj changes.
  // needed to add taskObj as a dependency because a task's complete button only worked the first time it was clicked because the user object (and so tokens) was not being updated in state after updating in firebase. needed to get the user object from firebase and set it in state any time the taskObj changes to be able to prevent undefined userCurrentTokens and userLifetimeTokens to complete task multiple times.
  // over in all tasks page, completing task triggers a change on the taskObj's which trigger's this useEffect to run (its' depenency array is taskCard)
  useEffect(() => {
    if (user && taskDetails.firebaseKey) {
      getUser(user.uid).then((data) => {
        setUserObj(data);
      });
    }
  }, [taskObj]);

  // delete and route back to all tasks page
  const deleteThisTask = () => {
    if (window.confirm(`Delete ${taskDetails.name}?`)) {
      deleteTask(taskDetails.firebaseKey).then(() => {
        router.push('/');
      });
    }
  };

  // function to refresh user object and tasks.
  const getUserObjAndTasks = () => {
    getUser(user.uid).then((data) => setUserObj(data));
    getTaskDetails(firebaseKey).then((data) => setTaskDetails(data));
  };

  // // get user object and tasks on mount
  // useEffect(() => {
  //   getUserObjAndTasks();
  // }, []);

  const incrementUserTokens = async () => {
    if (loading) return; // Prevent multiple clicks before previous update

    setLoading(true); // Set loading state to true before updating

    // get the task's token value via taskObj.token_value
    const taskTokenValue = Number(taskDetails.token_value);

    // get the user object from firebase, this is done in the useEffect above

    // define user's current token count
    const userCurrentTokens = Number(userObj[0]?.current_tokens);

    // define user's lifetime token count
    const userLifetimeTokens = Number(userObj[0]?.lifetime_tokens);

    // add taskObj.token_value to the user's token counts (current and lifetime)
    const updatedUserCurrentTokens = userCurrentTokens + taskTokenValue;
    const updatedUserLifetimeTokens = userLifetimeTokens + taskTokenValue;

    // get the task's completions
    const { completions } = taskDetails;

    // +1 to task's completions
    const updatedCompletions = completions + 1;

    // update user payload with updated tokens
    const userPayload = { ...userObj[0], current_tokens: updatedUserCurrentTokens, lifetime_tokens: updatedUserLifetimeTokens };

    setUserObj(userPayload);

    // update task payload with updated completions
    const taskPayload = { ...taskObj, completions: updatedCompletions };

    // update the user object in firebase
    await updateUser(userPayload).then(() => {
      window.refreshUser(); // hacky way to refresh user object in the navbar

      // show success message
      setSuccessMessage(`Task Completed, you earned ${taskDetails.token_value} tokens!`);
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    });

    // update the task object in firebase
    updateTask(taskPayload).then(() => {
      setTaskObj(taskPayload);
      getUserObjAndTasks();
      setLoading(false); // Reset loading state after the update
    });
  };

  if (pageLoading) return <LoadingComponent />;
  return (
    <>
      <div />
      <div style={{ marginTop: '20px' }}>
        {/* image and task details */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginLeft: '650px' }}>
          {/* image */}
          <img
            className="faded-image"
            alt="Task"
            style={{
              width: '300px',
              justifyContent: 'center',
              alignItems: 'flex-start',
              objectFit: 'cover',
              marginRight: '20px',
              height: 'auto',
              maxHeight: '300px',
            }}
            src={taskDetails.image}
          />

          {/* task details to the right of the image */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '100%' }}>
            {/* task name */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <h1 style={{ fontSize: '1.6rem', marginRight: '8px' }}>{taskDetails.name}</h1>

              {/* tokens */}
              <FontAwesomeIcon icon={faCoins} style={{ color: '#be8e00', fontSize: '1.3rem' }} />
              <h1 style={{ fontSize: '1.6rem', margin: '2px', color: '#be8e00' }}>{taskDetails.token_value}</h1>
            </div>

            {/* DESCRIPTION */}
            <p style={{ marginBottom: '10px' }}>{taskDetails?.description}</p>

            {/* CATEGORY BADGE */}
            <Link href={`/category/${taskDetails.category_id}`} passHref>
              <Button variant="info">{taskDetails.categoryObject?.name}</Button>
            </Link>

            {/* COMPLETIONS */}
            <h5 style={{ marginTop: '20px', marginBottom: '0' }}>Completed {taskDetails.completions} times.</h5>

            {/* BUTTONS */}
            <div className="" style={{ marginTop: '90px' }}>
              {/* Edit button */}
              <OverlayTrigger placement="bottom" overlay={<Tooltip id={`tooltip-${taskDetails.firebaseKey}`}>Edit</Tooltip>}>
                <Link href={`/task/edit/${taskDetails.firebaseKey}`} passHref>
                  <FontAwesomeIcon className="m-2 fa-2x" icon={faPenToSquare} style={{ color: 'grey', fontSize: '1.6rem' }} />
                </Link>
              </OverlayTrigger>

              {/* Delete button */}
              <OverlayTrigger placement="bottom" overlay={<Tooltip id={`tooltip-${taskDetails.firebaseKey}`}>Delete</Tooltip>}>
                <FontAwesomeIcon className="m-2 fa-2x" style={{ color: 'grey', fontSize: '1.6rem', cursor: 'pointer' }} icon={faTrashCan} onClick={deleteThisTask} />
              </OverlayTrigger>

              {/* Complete button */}
              <OverlayTrigger placement="bottom" overlay={<Tooltip id={`tooltip-${taskDetails.firebaseKey}`}>Complete</Tooltip>}>
                <FontAwesomeIcon className="m-2 fa-2x" icon={faCheckCircle} style={{ color: 'green', fontSize: '2.2rem', cursor: 'pointer' }} onClick={incrementUserTokens} />
              </OverlayTrigger>
            </div>
            {successMessage && <h6 style={{ color: 'green', marginLeft: 'px' }}>{successMessage}</h6>}
          </div>
        </div>

        {/* Back to All Tasks button */}
        <Link style={{ marginLeft: '550px' }} href="/" passHref>
          <Button style={{ marginTop: '20px' }}>Back to All Tasks</Button>
        </Link>
      </div>
    </>
  );
}

TaskDetailsPage.propTypes = {
  params: PropTypes.shape({
    firebaseKey: PropTypes.string,
  }),
};
