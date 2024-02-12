import "./AdminDashboard.css";
import AdminDashboardHeader from "../AdminDashboardHeader/AdminDashboardHeader";
import { getAllUsers } from "../../../services/users.service";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [users, setUsers] = useState(null);
  const [selected, setSelected] = useState("firstName");
  const [value, setValue] = useState("");

  const handleInputValue = (e) => {
    setValue(e.target.value);
  };

  const handleSelected = (e) => {
    setSelected(e.target.value);
  };

  const searchUserBy = (value, selected, fn) => {
    getAllUsers()
      .then((data) => Object.values(data))
      .then((data) => {
        return data.filter((user) =>
          user[selected].toLowerCase().includes(value)
        );
      })
      .then((data) => fn(data));
  };

  useEffect(() => {
    getAllUsers().then((data) => setUsers(Object.values(data)));
  }, []);

  useEffect(() => {
    searchUserBy(value, selected, setUsers);
  }, [value]);

  return (
    <div className="dashboard">
      <AdminDashboardHeader />
      <div className="dashboard-main">
        <div className="search-box">
          <div className="searchBy-box">
            <label htmlFor="search-by" id="search-by-label">
              Search by
            </label>
            <select
              value={selected}
              onChange={handleSelected}
              name="search-by"
              id="search-by"
            >
              <option className="option-search-by" value="firstName">
                First Name
              </option>
              <option className="option-search-by" value="lastName">
                Last Name
              </option>
              <option className="option-search-by" value="username">
                Username
              </option>
              <option className="option-search-by" value="email">
                Email
              </option>
            </select>
            <input
              value={value}
              onChange={handleInputValue}
              type="text"
              name="search-by-input"
              id="search-by-input"
            />
          </div>
        </div>
        <div className="users-dashboard-header">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Username</th>
                <th>First name</th>
                <th>Last name</th>
                <th>Admin</th>
                <th>Delete User</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.uid}>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>No</td>
                  <td>Delete</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* <div className="users-dashboard">
          <div className="users-dashboard-header">
            <span className="users-nav-link">Username</span>
            <span className="users-nav-link">First name</span>
            <span className="users-nav-link">Last name</span>
            <span className="users-nav-link">Email </span>
            <span className="users-nav-link">Admin</span>
          </div>
        </div>
        {users?.map((user) => {
          return (
            <div className="users-dashboard-content" key={user.uid}>
              <span className="user-info">{user.handle}</span>
              <span className="user-info">{user.firstName}</span>
              <span className="user-info">{user.lastName}</span>
              <span className="user-info">{user.email}</span>
              <span className="user-info">false</span>
            </div>
          );
        })} */}
      </div>
    </div>
  );
};

export default AdminDashboard;

// 1.Accessible to users with administrative privileges.

// 2.Admin must be able to search for a user by their username, email, or display name.

// 3.Admin must be able to block or unblock individual users. A blocked user must not be able to create posts or comments.

// 4.Admin must be able to delete any post.

// 5.Admin must be able to view a list of all posts with an option to filter and sort them.
