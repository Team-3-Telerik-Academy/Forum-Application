import { useContext } from "react";
import "./Header.css";
import { NavLink } from "react-router-dom";
import AppContext from "../../AppContext/AppContext";

const Header = () => {
  const { user, userData, setAppState } = useContext(AppContext);

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
        <img src="/src/Images/logo.png" alt="logo" />
        {user && <NavLink to="">+ New post</NavLink>}
      </div>
      {user && (
        <div id="search">
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Trends, posts, #tags"
          />
          <div id="magnifying-glass">
            <img
              src="/src/Images/magnifying-glass.svg"
              alt="magnifying-glass"
            />
          </div>
        </div>
      )}
      {user ? (
        <div id="logged-in">
          <span>Welcome, ...</span>{" "}
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
