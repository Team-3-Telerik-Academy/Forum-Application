import { NavLink } from "react-router-dom";
import "./SignIn.css";

const SignIn = () => {
  return (
    <div className="signin-content">
      <div className="logo">
        <img src="/src/Images/logo.png" alt="logo" />
      </div>
      <div className="form-content">
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
      </div>
      <div className="footer">
        <NavLink className="sign-up-nav" to="/sign-up">
          need an account?
        </NavLink>
        <NavLink className="sign-in-nav" to="/sign-in">
          Sign in
        </NavLink>
      </div>
    </div>
  );
};

export default SignIn;
