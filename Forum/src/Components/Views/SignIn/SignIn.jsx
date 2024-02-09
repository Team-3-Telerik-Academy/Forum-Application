import { NavLink, useNavigate } from "react-router-dom";
import "./SignIn.css";
import { useContext, useEffect, useState } from "react";
import AppContext from "../../../AppContext/AppContext";
import { loginUser } from "../../../services/auth.service";

const SignIn = () => {
  const navigate = useNavigate();
  const { setRegistered, setContext } = useContext(AppContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const updateForm = (prop) => (e) => {
    setForm({
      ...form,
      [prop]: e.target.value,
    });
  };

  //TODO
  const onLogin = () => {
    // TODO: validate form before submitting

    loginUser(form.email, form.password)
      .then((credential) => {
        setContext({
          user: credential.user,
        });
      })
      .then(() => {
        navigate("/");
      })
      .catch((e) => console.log(e.message));
  };

  useEffect(() => {
    setRegistered(false);
  }, []);

  return (
    <div className="signin-content">
      <div className="logo">
        <img
          onClick={() => navigate("/home")}
          src="/src/Images/logo.png"
          alt="logo"
        />
      </div>
      <div className="form-content">
        <input
          type="email"
          onChange={updateForm("email")}
          placeholder="Email"
          value={form.email}
        />
        <input
          type="password"
          onChange={updateForm("password")}
          placeholder="Password"
          value={form.password}
        />
      </div>
      <div className="footer">
        <NavLink className="sign-up-nav" to="/sign-up">
          need an account?
        </NavLink>
        <NavLink onClick={onLogin} className="sign-in-nav" to="/sign-in">
          Sign in
        </NavLink>
      </div>
    </div>
  );
};

export default SignIn;
