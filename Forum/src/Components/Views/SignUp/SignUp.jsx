import { NavLink, useNavigate } from "react-router-dom";
import "./SignUp.css";
import { useContext, useState } from "react";
import AppContext from "../../../AppContext/AppContext";
import {
  getUserByUsername,
  createUserUsername,
} from "../../../services/users.service";
import { registerUser } from "../../../services/auth.service";
import Successfully from "../../Successfully/Successfully";

/**
 * Sign up component for user registration.
 *
 * @component
 * @returns {JSX.Element} The sign up form.
 */
const SignUp = () => {
  const navigate = useNavigate();
  const {setContext } = useContext(AppContext);
  const [isRegistered, setRegistered] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState("");

  const updateForm = (prop) => (e) => {
    setError("");
    setForm({
      ...form,
      [prop]: e.target.value,
    });
  };

  const onRegister = () => {
    if (form.firstName.length < 4 || form.firstName.length > 32) {
      setError("First Name should be between 4 and 32 characters long!");
      return;
    }

    if (form.lastName.length < 4 || form.lastName.length > 32) {
      setError("Last Name should be between 4 and 32 characters long!");
      return;
    }

    if (!form.username) {
      setError("Username is required!");
      return;
    }

    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const isValid = isValidEmail(form.email);

    if (!isValid) {
      setError("Email is not valid!");
      return;
    }

    if (!form.password) {
      setError("Password is required!");
      return;
    }

    getUserByUsername(form.username)
      .then((snapshot) => {
        if (snapshot.exists()) {
          throw new Error(`Username ${form.username} has already been taken!`);
        }

        return registerUser(form.email, form.password);
      })
      .then((credential) => {
        setRegistered(true);
        return createUserUsername(
          form.username,
          form.firstName,
          form.lastName,
          credential.user.uid,
          credential.user.email
        ).then(() => {
          setContext({
            user: credential.user,
          });
        });
      })
      .catch((e) => {
        if (e.message.includes("email")) {
          setError("Email is already in use!");
        } else if (e.message.includes("weak-password")) {
          setError("Password should be at least 6 characters long!");
        } else {
          setError(e.message);
        }
      });
  };

  return (
    <>
      {isRegistered ? (
        <Successfully page={"sign-in"} color={"#89C623"}>
          Your account has been successfully created! <br /> You will be
          redirected to the Sign In page!
        </Successfully>
      ) : (
        <div id="sign-up-page">
          <div id="observatory">
            <img src="/src/Images/observatory.svg" alt="observatory" />
          </div>
          <img
            onClick={() => navigate("/home")}
            src="/src/Images/logo.png"
            alt="logo"
          />
          <div id="sign-up">
            {error && <div className="error">{error}</div>}
            <input
              type="text"
              value={form.firstName}
              onChange={updateForm("firstName")}
              placeholder="First Name"
              name="firstName"
              id="firstName"
            />
            <input
              type="text"
              value={form.lastName}
              onChange={updateForm("lastName")}
              placeholder="Last Name"
              name="lastName"
              id="lastName"
            />
            <input
              type="text"
              value={form.username}
              onChange={updateForm("username")}
              placeholder="Username"
              name="username"
              id="username"
            />
            <input
              type="email"
              value={form.email}
              onChange={updateForm("email")}
              placeholder="Email"
              name="email"
              id="email"
            />
            <input
              value={form.password}
              onChange={updateForm("password")}
              type="password"
              placeholder="Password"
              name="password"
              id="password"
            />
          </div>
          <div id="sign-up-buttons">
            <NavLink style={{ backgroundColor: "transparent" }} to={"/sign-in"}>
              sign in
            </NavLink>
            <NavLink
              onClick={onRegister}
              style={{ backgroundColor: "#89C623" }}
            >
              Next
            </NavLink>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUp;
