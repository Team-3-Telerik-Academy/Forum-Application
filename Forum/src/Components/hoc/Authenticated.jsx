import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { auth } from "../../config/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";

/**
 * Higher-order component that checks if the user is authenticated.
 * If the user is not authenticated, it redirects to the sign-in page.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components to render if the user is authenticated.
 * @returns {ReactNode} - The child components if the user is authenticated, otherwise it redirects to the sign-in page.
 */
const Authenticated = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const location = useLocation();

  if (!loading && !user) {
    return <Navigate replace to="/sign-in" state={{ from: location }} />;
  }

  return <>{children}</>;
};

Authenticated.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Authenticated;
