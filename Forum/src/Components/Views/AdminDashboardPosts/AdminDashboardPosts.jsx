import AdminDashboardHeader from "../AdminDashboardHeader/AdminDashboardHeader";
import { getAllPosts } from "../../../services/posts.service";
import { useEffect, useState } from "react";
import { deletePost } from "../../../services/posts.service";

const AdminDashboardPosts = () => {
  const [posts, setPosts] = useState(null);
  const [selected, setSelected] = useState("author");
  const [value, setValue] = useState("");

  const handleInputValue = (e) => {
    setValue(e.target.value);
  };

  const handleSelected = (e) => {
    setSelected(e.target.value);
  };

  useEffect(() => {
    getAllPosts().then((data) => setPosts(Object.values(data)));
  }, []);

  const searchPostsBy = (value, selected, fn) => {
    getAllPosts()
      .then((data) => Object.values(data))
      .then((data) => {
        return data.filter((user) =>
          user[selected]?.toLowerCase().includes(value)
        );
      })
      .then((data) => fn(data));
  };

  useEffect(() => {
    searchPostsBy(value, selected, setPosts);
  }, [value]);

  return (
    <div className="dashboard">
      <AdminDashboardHeader postsNavColor="#d98f40" postsFontColor="black" />
      <div className="dashboard-main">
        <div className="search-box">
          <div className="panel-selected">
            <span>Posts</span>
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
              <option className="option-search-by" value="author">
                Author
              </option>
              <option className="option-search-by" value="category">
                Category
              </option>
              <option className="option-search-by" value="title">
                Title
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
                <th>Author</th>
                <th>Category</th>
                <th>Title</th>
                <th>Created on</th>
                {/* <th>Admin</th> */}
                <th>Delete Post</th>
              </tr>
            </thead>
            <tbody>
              {posts?.map((post) => (
                <tr key={post.id}>
                  <td>{post.author}</td>
                  <td>{post.category}</td>
                  <td>{post.title}</td>
                  <td>
                    {post.createdOn.toLocaleString("bg-BG", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  {/* <td>No</td> */}
                  <td
                    onClick={() => deletePost(post.id, posts, setPosts)}
                    className="block-cell"
                    style={{
                      backgroundColor: "red",
                      cursor: "pointer",
                    }}
                  >
                    Delete
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

export default AdminDashboardPosts;
