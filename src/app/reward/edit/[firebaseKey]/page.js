'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import RewardForm from '../../../../components/forms/RewardForm';
import { getSingleReward } from '../../../../api/rewardData';

export default function EditRewardPage({ params }) {
  const [editItem, setEditItem] = useState({});
  const { firebaseKey } = params;

  useEffect(() => {
    getSingleReward(firebaseKey).then(setEditItem);
  }, [firebaseKey]);

  return <RewardForm obj={editItem} />;
}
EditRewardPage.propTypes = {
  params: PropTypes.shape({
    firebaseKey: PropTypes.string.isRequired,
  }).isRequired,
};
