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
  });

  const updateForm = (prop) => (e) => {
    setForm({
      ...form,
      [prop]: e.target.value,
    });
  };

  //TODO validation
  const onRegister = () => {
    // TODO: validate the form before submitting request

    // check if an user with the handle exist
    getUserByHandle(form.handle)
      .then((snapshot) => {
        if (snapshot.exists()) {
          throw new Error(`Handle @${form.handle} has already been taken!`);
        }

        return registerUser(form.email, form.password);
      })
      .then((credential) => {
        setRegistered(true);
        // the handle is unique, so create a user record with the handle, user id, data of creation, email and a map to liked tweets (an empty object initially)
        return createUserHandle(
          form.handle,
          credential.user.uid,
          credential.user.email
        ).then(() => {
          setContext({
            user: credential.user,
          });
        });
      })
      // .then(() => {
      //   navigate("/");
      // })
      .catch((e) => console.log(e));
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
