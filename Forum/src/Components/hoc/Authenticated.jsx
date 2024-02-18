import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { auth } from "../../config/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";

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
