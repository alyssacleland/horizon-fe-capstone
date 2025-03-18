'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../utils/context/authContext';
import { getRewards } from '../../api/rewardData';
import { getUser } from '../../api/userData';
import RewardCard from '../../components/RewardCard';
import LoadingComponent from '../../components/LoadingComponent';

export default function RewardsPage() {
  // set state for rewards
  const [rewards, setRewards] = useState([]);

  // set state for user obj
  // eslint-disable-next-line no-unused-vars
  const [userObj, setUserObj] = useState([]);

  // set state for loading
  const [loading, setLoading] = useState(true);

  // for access to uid
  const { user } = useAuth();

  // function to get all rewards (passed into onUpdate below)
  const getAllTheRewards = () => {
    getRewards(user.uid).then((data) => {
      setRewards(data);
      setLoading(false);
    });
  };

  // function to refresh user object and rewards
  // refreshing rewards triggers a change on the rewardObj so that useEffect in RewardCard will re-render (its' dependency array is rewardObj)
  const getUserObjAndRewards = () => {
    // setLoading(true); // Ensure loading state starts
    Promise.all([getUser(user.uid).then(setUserObj), getRewards(user.uid).then(setRewards)]).then(() => setLoading(false)); // Set loading to false only after both finish
  };

  // get and set userObj and rewards on mount
  useEffect(() => {
    if (user) {
      getUserObjAndRewards();
    }
  }, [user]);

  if (loading) return <LoadingComponent />;

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
      {/* page title */}
      <h2 style={{ marginBottom: '30px' }}>{user.displayName}&apos;s Rewards:</h2>

      {/* Create new reward */}
      <div style={{ marginBottom: '30px' }}>
        <Link href="/reward/new" passHref>
          <Button variant="primary">New Reward</Button>
        </Link>
      </div>

      {/* rewards cards or text if no rewards */}
      <div className="d-flex flex-wrap align-itmes-center mx-auto" style={{ justifyContent: 'center', gap: '20px', overflowY: 'auto', maxHeight: '600px', maxWidth: '1500px' }}>
        {rewards.length > 0 ? rewards.map((reward) => <RewardCard key={reward.firebaseKey} rewardObj={reward} onUpdate={getAllTheRewards} onClaim={getUserObjAndRewards} />) : <h2>No Rewards Yet, create one to get started!</h2>}
      </div>
    </div>
  );
}
