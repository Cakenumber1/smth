import { useAuth } from 'AuthContext';
import { NextComponentType } from 'next';
import { useRouter } from 'next/router';

function withAuth<T>(Component: NextComponentType<T>) {
  const Auth = (props: T) => {
    const { currentUser } = useAuth()!;
    const router = useRouter();

    if (!currentUser) {
      // Redirect
      router.replace('/auth');
      return null;
    }

    return <Component {...props} />;
  };

  // Copy getInitial props so it will run as well
  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
}

export default withAuth;
