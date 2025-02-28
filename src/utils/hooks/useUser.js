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
        // *****CREATE A USER OBJECT IN FIREBASE IF IT DOESN'T EXIST*****
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
              // *****  IF USER ALREADY EXISTS, SET USER DATA FROM EXISTING USER *****
              setUserData(existingUser[0]);
            }
            // *****  AFTER EITHER CREATING OR UPDATING USER DATA, STOP LOADING. (SET LOADING TO FALSE WHEN USER DATA IS AVAILABLE) *****
            // the loading boolean is used in the ViewDirector to show a loading spinner while user data is being fetched
            setLoading(false); // Stop loading when done
          })
          .catch((error) => {
            console.error('Error fetching user data:', error); // Handle any errors
            setLoading(false); // Stop loading even if there's an error
          });
      } else {
        setLoading(false); // Stop loading if no user so that the ViewDirector can render the SignIn component
      }
    };

    handleUser();
  }, [user]); // Run the effect when the user changes

  // PRETTY SURE BELOW WAS A WASTE OF TIME TODO: REMOVE ONCE CONFIRMED
  // // Function to update userData
  // const updateUserData = (updatedData) => { // updatedData is an object with the updated user data that will be passed to the updateUser function, in navbar (to udpate tokens) and maybe in taskcard too if i have to
  //    updateUser(updatedData).then(() => {
  //     setUserData(updatedData);  // Update the user data locally
  //   }).catch((error) => {
  //     console.error('Error updating user data:', error);
  //   });
  // };

  return { userData, loading };
};

export default useUser;
