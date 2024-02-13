import "./AdminDashboardHeader.css";
import { NavLink } from "react-router-dom";

const AdminDashboardHeader = ({
  usersNavColor = "",
  usersFontColor = "",
  blockedUsersNavColor = "",
  blockedUsersFontColor = "",
  postsNavColor = "",
  postsFontColor = "",
}) => {
  return (
    <div className="dashboard-header">
      <span className="admin-title">Admin dashboard</span>
      <NavLink
        to="/admin-dashboard"
        style={{
          backgroundColor: usersNavColor ? usersNavColor : "#000000E6",
          color: usersFontColor ? usersFontColor : "#d98f40",
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
          color: blockedUsersFontColor ? blockedUsersFontColor : "#d98f40",
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
          color: postsFontColor ? postsFontColor : "#d98f40",
        }}
        className="nav-link-dashboard"
      >
        Posts
      </NavLink>
    </div>
  );
};

export default AdminDashboardHeader;
