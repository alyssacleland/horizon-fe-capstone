import { useEffect, useState } from 'react';
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faCircleInfo, faPenToSquare, faTrashCan, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { deleteTask } from '../api/taskData';
import { useAuth } from '../utils/context/authContext';
import { getUser, updateUser } from '../api/userData';

export default function TaskCard({ taskObj, onUpdate, onComplete }) {
  const { user } = useAuth();
  const [userObj, setUserObj] = useState({});

  // get the user object from firebase and set it in state any time the taskObj changes.
  // needed to add taskObj as a dependency because a task's complete button only worked the first time it was clicked because the user object (and so tokens) was not being updated in state after updating in firebase. needed to get the user object from firebase and set it in state any time the taskObj changes to be able to prevent undefined userCurrentTokens and userLifetimeTokens to complete task multiple times.
  // over in all tasks page, completing task triggers a change on the taskObj's which trigger's this useEffect to run (its' depenency array is taskCard)
  useEffect(() => {
    getUser(user.uid).then((data) => {
      setUserObj(data);
    });
  }, [taskObj]);

  // FOR DELETE, WE NEED TO REMOVE THE TASK AND HAVE THE VIEW RERENDER,
  // SO WE PASS THE FUNCTION FROM THE PARENT THAT GETS THE TASKS
  const deleteThisTask = () => {
    if (window.confirm(`Delete ${taskObj.name}?`)) {
      deleteTask(taskObj.firebaseKey).then(() => onUpdate());
    }
  };

  const incrementUserTokens = () => {
    // get the task's token value via taskObj.token_value
    const taskTokenValue = taskObj.token_value;
    console.log('taskTokenValue:', taskTokenValue);

    // get the user object from firebase, this is done in the useEffect above

    // define user's current token count
    const userCurrentTokens = userObj[0]?.current_tokens;

    // define user's lifetime token count
    const userLifetimeTokens = userObj[0]?.lifetime_tokens;

    // add taskObj.token_value to the user's token counts (current and lifetime)
    const updatedUserCurrentTokens = userCurrentTokens + taskTokenValue;
    const updatedUserLifetimeTokens = userLifetimeTokens + taskTokenValue;

    const payload = { ...userObj[0], current_tokens: updatedUserCurrentTokens, lifetime_tokens: updatedUserLifetimeTokens };
    // update the user object in firebase
    updateUser(payload).then(() => {
      // update the user object in state
      setUserObj(payload);
      // run the onComplete function from the parent component. it should update the user object in the parent component
      onComplete();
    });
  };

  return (
    <Card style={{ width: '18rem' }}>
      {/* task name */}
      <div style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', minHeight: '100px', maxHeight: '100px', padding: '10px' }}>
        <Card.Title style={{ fontSize: '1.6rem', marginRight: '8px' }}>{taskObj.name}</Card.Title>

        {/* tokens */}
        <FontAwesomeIcon icon={faCoins} style={{ color: '#be8e00', fontSize: '1.3rem' }} />
        <Card.Title style={{ fontSize: '1.6rem', margin: '2px', color: '#be8e00' }}>{taskObj.token_value}</Card.Title>
      </div>

      {/* image */}
      {/* <div className="image-container">  */}
      <Card.Img variant="top" className="faded-image" style={{ height: '200px', objectFit: 'cover', padding: '' }} src={taskObj.image} />

      {/* </div> */}

      {/* buttons */}
      <div className="d-flex align-items-center justify-content-center">
        {/* details button */}
        <OverlayTrigger placement="bottom" overlay={<Tooltip id={`tooltip-${taskObj.firebaseKey}`}>Details</Tooltip>}>
          <Link href={`/task/${taskObj.firebaseKey}`} passHref>
            <FontAwesomeIcon className="m-2 fa-2x" icon={faCircleInfo} style={{ color: 'grey', fontSize: '1.6rem' }} />
          </Link>
        </OverlayTrigger>

        {/* edit button */}
        <OverlayTrigger placement="bottom" overlay={<Tooltip id={`tooltip-${taskObj.firebaseKey}`}>Edit</Tooltip>}>
          <Link href={`/task/edit/${taskObj.firebaseKey}`} passHref>
            <FontAwesomeIcon className="m-2 fa-2x" icon={faPenToSquare} style={{ color: 'grey', fontSize: '1.6rem' }} />
          </Link>
        </OverlayTrigger>

        {/* delete button */}
        <OverlayTrigger placement="bottom" overlay={<Tooltip id={`tooltip-${taskObj.firebaseKey}`}>Delete</Tooltip>}>
          <FontAwesomeIcon className="m-2 fa-2x" style={{ color: 'grey', fontSize: '1.6rem' }} icon={faTrashCan} onClick={deleteThisTask} />
        </OverlayTrigger>

        {/* complete button */}
        <OverlayTrigger placement="bottom" overlay={<Tooltip id={`tooltip-${taskObj.firebaseKey}`}>Complete</Tooltip>}>
          <FontAwesomeIcon className="m-2 fa-2x" icon={faCheckCircle} style={{ color: 'green', fontSize: '2.2rem' }} onClick={incrementUserTokens} />
        </OverlayTrigger>
      </div>
    </Card>
  );
}

TaskCard.propTypes = {
  taskObj: PropTypes.shape({
    name: PropTypes.string,
    firebaseKey: PropTypes.string,
    image: PropTypes.string,
    token_value: PropTypes.number,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
};
