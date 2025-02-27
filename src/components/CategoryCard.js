'use client';

import React from 'react';
import { Card , OverlayTrigger, Tooltip } from 'react-bootstrap';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { deleteCategoryAndItsTasks } from '../api/mergedData';

export default function CategoryCard({ categoryObj, onUpdate }) {
  const deleteThisCategory = () => {
    if (window.confirm(`Deleting ${categoryObj.name} will also delete all of its tasks. Are you sure you want to delete?`)) {
      deleteCategoryAndItsTasks(categoryObj.firebaseKey).then(() => onUpdate());
    }
  };
  return (
    <Card style={{ width: '18rem', margin: '10px' }}>
      <Card.Body>
        <Card.Title>{categoryObj.name}</Card.Title>
        {/* buttons */}
        <div className="d-flex align-items-center justify-content-center">
          {/* details button */}
          <OverlayTrigger placement="bottom" overlay={<Tooltip id={`tooltip-${categoryObj.firebaseKey}`}>Details</Tooltip>}>
            <Link href={`/category/${categoryObj.firebaseKey}`} passHref>
              <FontAwesomeIcon className="m-2 fa-2x" icon={faCircleInfo} style={{ color: 'grey', fontSize: '1.6rem' }} />
            </Link>
          </OverlayTrigger>

          {/* edit button */}
          <OverlayTrigger placement="bottom" overlay={<Tooltip id={`tooltip-${categoryObj.firebaseKey}`}>Edit</Tooltip>}>
            <Link href={`/category/edit/${categoryObj.firebaseKey}`} passHref>
              <FontAwesomeIcon className="m-2 fa-2x" icon={faPenToSquare} style={{ color: 'grey', fontSize: '1.6rem' }} />
            </Link>
          </OverlayTrigger>

          {/* delete button */}
          <OverlayTrigger placement="bottom" overlay={<Tooltip id={`tooltip-${categoryObj.firebaseKey}`}>Delete</Tooltip>}>
            <FontAwesomeIcon className="m-2 fa-2x" style={{ color: 'grey', fontSize: '1.6rem' }} icon={faTrashCan} onClick={deleteThisCategory} />
          </OverlayTrigger>
        </div>
      </Card.Body>
    </Card>
  );
}

CategoryCard.propTypes = {
  categoryObj: PropTypes.shape({
    name: PropTypes.string.isRequired,
    firebaseKey: PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};
