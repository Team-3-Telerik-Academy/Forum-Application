import { NavLink, useNavigate } from "react-router-dom";
import "./SignUp.css";
import { useContext, useState } from "react";
import AppContext from "../../../AppContext/AppContext";
import SuccessfullyRegistered from "../SuccessfullyRegistered/SuccessfullyRegistered";
import {
  getUserByHandle,
  createUserHandle,
} from "../../../services/users.service";
import { registerUser } from "../../../services/auth.service";

const SignUp = () => {
  const navigate = useNavigate();
  const { setRegistered, isRegistered, setContext } = useContext(AppContext);
  const [form, setForm] = useState({
    handle: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const updateForm = (prop) => (e) => {
    setForm({
      ...form,
      [prop]: e.target.value,
    });
  };

  const onRegister = () => {

    if (form.firstName.length < 4 || form.firstName.length > 32) {
      window.alert("First Name should be between 4 and 32 characters long!");
      return;
    }

    if (form.lastName.length < 4 || form.lastName.length > 32) {
      window.alert("Last Name should be between 4 and 32 characters long!");
      return;
    }

    if (!form.handle) {
      window.alert("Handle is required!");
      return;
    }

    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
    
    const isValid = isValidEmail(form.email);

    if (!isValid) {
      window.alert("Invalid email!");
      return;
    }

    if (!form.password) {
      window.alert("Password is required!");
      return;
    }

    getUserByHandle(form.handle)
      .then((snapshot) => {
        if (snapshot.exists()) {
          window.alert(`Handle @${form.handle} has already been taken!`);
          return;
        }

        return registerUser(form.email, form.password);
      })
      .then((credential) => {
        setRegistered(true);
        return createUserHandle(
          form.handle,
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
          window.alert(
            "An account with this email already exists! Please sign in!"
          );
        } else if (e.message.includes("weak-password")) {
          window.alert("Password should be at least 6 characters long!");
        } else {
          window.alert(e.message);
        }
      });
  };

  return (
    <>
      {isRegistered ? (
        <SuccessfullyRegistered />
      ) : (
        <div id="sign-up-page">
          <img
            onClick={() => navigate("/home")}
            src="/src/Images/logo.png"
            alt=""
          />
          <div id="sign-up">
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
              value={form.handle}
              onChange={updateForm("handle")}
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
