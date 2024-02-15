import "./Header.css";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AppContext from "../../AppContext/AppContext";
import { logoutUser } from "../../services/auth.service";
import { getAllPosts } from "../../services/posts.service";
import { getAllUsers } from "../../services/users.service";

const Header = ({ magnifiedGlassColor, inputColor }) => {
  const { user, userData, setAppState } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const [numbers, setNumbers] = useState({
    users: 0,
    posts: 0,
  });


  useEffect(() => {
    getAllPosts().then((posts) =>
      getAllUsers().then((users) => {
        setNumbers({
          users: Object.keys(users).length,
          posts: posts.length,
        });
      })
    );
  }, []);

  const handleSearchClick = () => {
    if (searchTerm === "") {
      return;
    }

    navigate(`/search/${searchTerm}`);
    setSearchTerm("");
  };

  const handleProfileClick = () => {
    navigate(`/profile/${userData.uid}`);
  }

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
        {!user && (
          <div id="no-logged-in-info">
            <span id="users">Registered users: {numbers.users}</span>
            <span id="posts">Created posts: {numbers.posts}</span>
          </div>
        )}
        {user && <NavLink to="/create-new-post">+ New post</NavLink>}
      </div>
      {user && (
        <div id="search">
          <input
            onFocus={(e) => (e.target.style.border = `3px solid ${inputColor}`)}
            onBlur={(e) => (e.target.style.border = "")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            name="search"
            id="search"
            placeholder="Trends, posts, #tags"
          />
          <div
            style={{ backgroundColor: magnifiedGlassColor }}
            id="magnifying-glass"
          >
            <img
              onClick={handleSearchClick}
              src="/src/Images/magnifying-glass.svg"
              alt="magnifying-glass"
            />
            {userData?.admin && <NavLink to="/admin-dashboard">Admin</NavLink>}
          </div>
        </div>
      )}
      {user ? (
        <div id="logged-in">
          {userData && <span onClick={handleProfileClick}>{userData?.username}</span>}
          <NavLink
            onClick={onLogout}
            style={{ backgroundColor: "#89C623" }}
            to={"/home"}
          >
            Sign Out
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

Header.propTypes = {
  magnifiedGlassColor: PropTypes.string,
  inputColor: PropTypes.string,
};

export default Header;
