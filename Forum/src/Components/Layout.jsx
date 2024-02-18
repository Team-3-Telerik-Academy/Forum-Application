// import SignIn from "./Views/SignIn/SignIn";

// const Layout = ({ user, children }) => {
//   return user ? children : <SignIn />;
// };

// export default Layout;

import { Navigate } from "react-router-dom";
import SignIn from "./Views/SignIn/SignIn";
import { useLocation } from "react-router-dom";

const Layout = ({ user, children }) => {
  const location = useLocation();
  console.log(user);
  if (!user) {
    return <Navigate replace to="/sign-in" state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default Layout;
