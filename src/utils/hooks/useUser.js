import { useEffect, useState } from 'react';
import { getUser, createUser, updateUser } from '@/api/userData';
import { useAuth } from '@/utils/context/authContext';

const useUser = () => {
  const { user } = useAuth(); // Get the current user from your auth context
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // used to indicate whether the user data is currently being fetched

  useEffect(() => {
    const handleUser = () => {
      if (user) {
        // If user is available (logged in)
        // Check if user obj exists in firebase. Because we only want to create a user obj if it doesn't exist
        getUser(user.uid)
          .then((existingUser) => {
            if (existingUser.length === 0) {
              // If no user obj exists, create one
              const payload = {
                uid: user.uid,
                current_tokens: 0,
                lifetime_tokens: 0,
                firebaseKey: null,
              };

              createUser(payload).then(({ name }) => {
                const patchPayload = { ...payload, firebaseKey: name };
                return updateUser(patchPayload).then(() => {
                  // wait for updateUser to complete
                  setUserData(patchPayload); // set userData after updateUser completes
                });
              });
            } else {
              // If user exists, set userData from existing user
              setUserData(existingUser[0]);
            }
            setLoading(false); // Stop loading when done
          })
          .catch((error) => {
            console.error('Error fetching user data:', error); // Handle any errors
            setLoading(false); // Stop loading even if there's an error
          });
      } else {
        setLoading(false); // Stop loading if no user
      }
    };

    handleUser();
  }, [user]); // Run the effect when the user changes

  return { userData, loading };
};

export default useUser;
