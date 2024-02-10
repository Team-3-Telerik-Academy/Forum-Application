import { useContext } from "react";
import "./Header.css";
import { NavLink, useNavigate } from "react-router-dom";
import AppContext from "../../AppContext/AppContext";
import { logoutUser } from "../../services/auth.service";

const Header = ({ magnifiedGlassColor }) => {
  const { user, userData, setAppState } = useContext(AppContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logoutUser().then(() => {
      setAppState({
        user: null,
        userData: null,
      });
    });
  };

  return (
    <div className="header-content">
      <div id="logo">
        <img
          onClick={() => navigate("/home")}
          src="/src/Images/logo.png"
          alt="logo"
        />
        {user && <NavLink to="/create-new-post">+ New post</NavLink>}
      </div>
      {user && (
        <div id="search">
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Trends, posts, #tags"
          />
          <div
            id="magnifying-glass"
            style={
              magnifiedGlassColor
                ? { backgroundColor: magnifiedGlassColor }
                : { backgroundColor: "#CD4D95" }
            }
          >
            <img
              src="/src/Images/magnifying-glass.svg"
              alt="magnifying-glass"
            />
          </div>
        </div>
      )}
      {user ? (
        <div id="logged-in">
          <span>Welcome, {userData?.handle}</span>{" "}
          <NavLink
            onClick={onLogout}
            style={{ backgroundColor: "#89C623" }}
            to={"/home"}
          >
            Log Out
          </NavLink>
        </div>
      ) : (
        <div className="button-content">
          <NavLink style={{ backgroundColor: "#CD4D95" }} to={"/sign-in"}>
            Sign in
          </NavLink>
          <NavLink style={{ backgroundColor: "#89C623" }} to={"/sign-up"}>
            Sign up
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default Header;
