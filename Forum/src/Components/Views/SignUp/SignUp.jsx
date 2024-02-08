import { NavLink, useNavigate } from "react-router-dom";
import "./SignUp.css";
import { useContext } from "react";
import AppContext from "../../../AppContext/AppContext";
import SuccessfullyRegistered from "../SuccessfullyRegistered/SuccessfullyRegistered";

const SignUp = () => {
  const navigate = useNavigate();
  const {isRegistered, setRegistered} = useContext(AppContext);

  return (
    <>{isRegistered ? (<SuccessfullyRegistered />) : (
        <div id="sign-up-page">
      <img onClick={() => navigate('/home')} src="/src/Images/logo.png" alt="" />
      <div id="sign-up">
        <input type="text" placeholder="Username" name="username" id="username" />
        <input type="email" placeholder="Email" name="email" id="email" />
        <input type="password" placeholder="Password" name="password" id="password" />
      </div>
      <div id="sign-up-buttons">
        <NavLink style={{ backgroundColor: "transparent" }} to={"/sign-in"}>
          sign in
        </NavLink>
        <NavLink onClick={() => setRegistered(true)} style={{ backgroundColor: "#89C623" }}>Next</NavLink>
      </div>
    </div>
    )}</>
  );
};

export default SignUp;
