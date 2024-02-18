import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { auth } from "../../config/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useContext } from "react";
import AppContext from "../../AppContext/AppContext";

const AuthenticatedAdmin = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const {userData} = useContext(AppContext);
  const location = useLocation();

  console.log(userData);

  if (!userData?.admin) {
    return <Navigate replace to="/home" state={{ from: location }} />;
  }

  return <>{children}</>;
};

AuthenticatedAdmin.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthenticatedAdmin;
