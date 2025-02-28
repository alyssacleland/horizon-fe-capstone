import PropTypes from 'prop-types';
import { useAuth } from '@/utils/context/authContext';
import Loading from '@/components/Loading';
import SignIn from '@/components/SignIn';
import NavBar from '@/components/NavBar';
import useUser from '@/utils/hooks/useUser';

function ViewDirectorBasedOnUserAuthStatus({ children }) {
  const { user, userLoading } = useAuth();
  const { userData, loading } = useUser(); // loading is true when user data is being fetched. in useUser, loading is set to false when user data is available. destructuring loading from useUser

  // if user state is null, then show loader
  // Show loading spinner while user data is being fetched
  if (userLoading || loading) {
    return <Loading />;
  }

  // Allow rendering SignIn if user is not authenticated or userData is not available
  if (!user || !userData) {
    return <SignIn />;
  }

  // what the user should see if they are logged in and data is available
  return (
    <>
      <NavBar /> {/* NavBar only visible if user is logged in and is in every view */}
      {children}
    </>
  );
}

export default ViewDirectorBasedOnUserAuthStatus;

ViewDirectorBasedOnUserAuthStatus.propTypes = {
  children: PropTypes.node.isRequired,
};
