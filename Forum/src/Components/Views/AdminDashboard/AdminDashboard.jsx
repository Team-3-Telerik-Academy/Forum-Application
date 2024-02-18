import "./AdminDashboard.css";
import AdminDashboardHeader from "../AdminDashboardHeader/AdminDashboardHeader";
import { getAllUsers } from "../../../services/users.service";
import { useEffect, useState } from "react";
import { blockUser } from "../../../services/users.service";
import { isAdmin } from "../../../services/users.service";

const AdminDashboard = () => {
  const [users, setUsers] = useState(null);
  const [selected, setSelected] = useState("firstName");
  const [value, setValue] = useState("");

  const handleAdmin = async (username, fn, user) => {
    const result = await isAdmin(username, fn, user);

    return result;
  };

  const handleBlock = async (users, user, fn) => {
    const block = await blockUser(users, user, fn);
    return block;
  };

  const handleInputValue = (e) => {
    setValue(e.target.value);
  };

  const handleSelected = (e) => {
    setSelected(e.target.value);
  };

  useEffect(() => {
    getAllUsers().then((data) => setUsers(Object.values(data)));
  }, []);

  const searchUserBy = (value, selected, fn) => {
    getAllUsers()
      .then((data) => Object.values(data))
      .then((data) => {
        return data.filter((user) =>
          user[selected]?.toLowerCase().includes(value)
        );
      })
      .then((data) => fn(data));
  };

  useEffect(() => {
    searchUserBy(value, selected, setUsers);
  }, [value]);

  return (
    <div className="dashboard">
      <AdminDashboardHeader usersNavColor="#d98f40" usersFontColor="black" />
      <div className="dashboard-main">
        <div className="search-box">
          <div className="panel-selected">
            <span>Users</span>
          </div>
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
                <th>Block User</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.uid}>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td
                    onClick={() => handleAdmin(user.username, setUsers, user)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: user.admin ? "#89C623" : "#2C2F34",
                      borderBottom: "2px solid #2c2f34",
                    }}
                  >
                    {user.admin ? "Yes" : "No"}
                  </td>
                  {user.admin ? (
                    <td
                      className="block-cell"
                      style={{
                        backgroundColor: "red",
                      }}
                    >
                      Cannot block user
                    </td>
                  ) : (
                    <td
                      className="block-cell"
                      onClick={() => handleBlock(users, user, setUsers)}
                      style={{
                        backgroundColor: "red",
                        cursor: "pointer",
                      }}
                    >
                      {user.isBlocked ? 'User is blocked' : 'No'}
                    </td>
                  )}
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
