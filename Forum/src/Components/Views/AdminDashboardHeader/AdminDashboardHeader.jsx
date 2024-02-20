import "./AdminDashboardHeader.css";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * Renders the header component for the admin dashboard.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} [props.usersNavColor=""] - The background color of the "Users" navigation link.
 * @param {string} [props.usersFontColor=""] - The font color of the "Users" navigation link.
 * @param {string} [props.blockedUsersNavColor=""] - The background color of the "Blocked users" navigation link.
 * @param {string} [props.blockedUsersFontColor=""] - The font color of the "Blocked users" navigation link.
 * @param {string} [props.postsNavColor=""] - The background color of the "Posts" navigation link.
 * @param {string} [props.postsFontColor=""] - The font color of the "Posts" navigation link.
 * @returns {JSX.Element} The rendered AdminDashboardHeader component.
 */
const AdminDashboardHeader = ({
  usersNavColor = "",
  usersFontColor = "",
  blockedUsersNavColor = "",
  blockedUsersFontColor = "",
  postsNavColor = "",
  postsFontColor = "",
}) => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-header">
      <span onClick={() => navigate('/home')} style={{cursor: 'pointer'}}  className="admin-title">Admin dashboard</span>
      <NavLink
        to="/admin-dashboard"
        style={{
          backgroundColor: usersNavColor ? usersNavColor : "#000000E6",
          color: usersFontColor ? usersFontColor : "white",
        }}
        className="nav-link-dashboard"
      >
        Users
      </NavLink>
      <NavLink
        style={{
          backgroundColor: blockedUsersNavColor
            ? blockedUsersNavColor
            : "#000000E6",
          color: blockedUsersFontColor ? blockedUsersFontColor : "white",
        }}
        to="/admin-dashboard-blocked-users"
        className="nav-link-dashboard"
      >
        Blocked users
      </NavLink>
      <NavLink
        to="/admin-dashboard-posts"
        style={{
          backgroundColor: postsNavColor ? postsNavColor : "#000000E6",
          color: postsFontColor ? postsFontColor : "white",
        }}
        className="nav-link-dashboard"
      >
        Posts
      </NavLink>
    </div>
  );
};

AdminDashboardHeader.propTypes = {
  usersNavColor: PropTypes.string,
  usersFontColor: PropTypes.string,
  blockedUsersNavColor: PropTypes.string,
  blockedUsersFontColor: PropTypes.string,
  postsNavColor: PropTypes.string,
  postsFontColor: PropTypes.string,
};

export default AdminDashboardHeader;
