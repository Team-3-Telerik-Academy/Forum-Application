import AdminDashboardHeader from "../AdminDashboardHeader/AdminDashboardHeader";
import { getBlockedUsers } from "../../../services/users.service";
import { unblockUser } from "../../../services/users.service";
import { useEffect, useState } from "react";

const AdminDashboardBlockedUsers = () => {
  const [users, setUsers] = useState(null);
  const [selected, setSelected] = useState("firstName");
  const [value, setValue] = useState("");

  const handleInputValue = (e) => {
    setValue(e.target.value);
  };

  const handleSelected = (e) => {
    setSelected(e.target.value);
  };

  useEffect(() => {
    getBlockedUsers().then((data) => setUsers(Object.values(data)));
  }, []);

  const handleUnblockUsers = async (users, fn, user) => {
    const result = await unblockUser(users, fn, user)
    return result
  }

  const searchUserBy = (value, selected, fn) => {
    getBlockedUsers()
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
      <AdminDashboardHeader blockedUsersNavColor="#d98f40" blockedUsersFontColor="black" />
      <div className="dashboard-main">
        <div className="search-box">
          <div className="panel-selected">
            <span>Blocked Users</span>
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
                {/* <th>Admin</th> */}
                <th>Unblock User</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.uid}>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  {/* <td>No</td> */}
                  <td
                    onClick={() => handleUnblockUsers(users, setUsers, user)}
                    className="block-cell"
                    style={{
                      backgroundColor: "#89C623",
                      cursor: "pointer",
                    }}
                  >
                    Unblock
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardBlockedUsers;
