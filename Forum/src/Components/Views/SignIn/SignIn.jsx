import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./SignIn.css";
import { useContext, useState } from "react";
import AppContext from "../../../AppContext/AppContext";
import { loginUser } from "../../../services/auth.service";

const SignIn = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { setContext } = useContext(AppContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const updateForm = (prop) => (e) => {
    setError("");
    setForm({
      ...form,
      [prop]: e.target.value,
    });
  };

  const onLogin = async () => {
    if (!form.email) {
      setError("Email is required!");
      setForm({
        ...form,
        password: "",
      });
      return;
    }

    if (!form.password) {
      setError("Password is required!");
      setForm({
        ...form,
        password: "",
      });
      return;
    }

    loginUser(form.email, form.password)
      .then((credential) => {
        setContext({
          user: credential.user,
        });
      })
      .then(() => {
        navigate(location.state?.from.pathname || "/");
      })
      .catch((e) => {
        console.log(e.message);
        setError("Your login information was incorrect! Please try again.");
        setForm({
          ...form,
          password: "",
        });
      });
  };

  return (
    <div className="signin-content">
      <div id="observatory">
        <img src="/src/Images/observatory.svg" alt="observatory" />
      </div>
      <div className="logo">
        <img
          onClick={() => navigate("/home")}
          src="/src/Images/logo.png"
          alt="logo"
        />
      </div>
      <div className="form-content">
        {error && <div className="error">{error}</div>}
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
