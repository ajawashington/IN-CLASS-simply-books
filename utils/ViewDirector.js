import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useAuth } from './context/authContext';
import Loading from '../components/Loading';
import Signin from '../components/Signin';
import NavBar from '../components/NavBar';
import UserForm from '../components/forms/UserForm';
import { clientCredentials } from './client';

const ViewDirectorBasedOnUserAuthStatus = ({ component: Component, pageProps }) => {
  const { user, userLoading, dbUser } = useAuth();
  const { adminUser } = clientCredentials;
  const router = useRouter();

  useEffect(() => {
    if (user?.uid !== adminUser && router.pathname.includes('/order')) {
      router.push('/');
    }
  }, [user]);

  // if user state is null, then show loader
  if (userLoading) {
    return <Loading />;
  }

  if (user && dbUser === null) {
    return (
      <>
        <NavBar user={user} />
        <UserForm userObj={user} />
      </>
    );
  }
  if (user && dbUser) {
    return (
      <>
        <NavBar user={user} /> {/* NavBar only visible if user is logged in and is in every view */}
        <div className="container">
          <Component {...pageProps} />
        </div>
      </>
    );
  }

  return <Signin />;
};

export default ViewDirectorBasedOnUserAuthStatus;

ViewDirectorBasedOnUserAuthStatus.propTypes = {
  component: PropTypes.func.isRequired,
  pageProps: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
