import "./AdminDashboardHeader.css";
import { NavLink } from "react-router-dom";

const AdminDashboardHeader = () => {
  return (
    <div className="dashboard-header">
      <span className="admin-title">Admin dashboard</span>
      <NavLink className="nav-link-dashboard">Posts</NavLink>
      <NavLink className="nav-link-dashboard">Blocked users</NavLink>
    </div>
  );
};

export default AdminDashboardHeader;
