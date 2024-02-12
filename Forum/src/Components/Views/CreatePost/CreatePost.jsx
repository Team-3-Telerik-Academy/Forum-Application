import { NavLink } from "react-router-dom";
import "./CreatePost.css";
import Header from "../../Header/Header";
import { useContext, useState } from "react";
import AppContext from "../../../AppContext/AppContext";
import { addPost } from "../../../services/posts.service";

const CreatePost = () => {
  const { userData } = useContext(AppContext);
  const [post, setPost] = useState({
    title: "",
    content: "",
    category: "",
  });
  const [error, setError] = useState("");

  const createPost = async () => {

    if (post.title.length < 16 || post.title.length > 64) {
      setError("Title should be between 16 and 64 characters long!");
      return;
    }

    if (post.content.length < 32 || post.content.length > 8192) {
      setError("Content should be between 32 and 8192 characters long!");
      return;
    }

    if (!post.category) {
      setError("Category is required!");
      return;
    }

    await addPost(post.title, post.content, post.category, userData.username);
    setPost({
      title: "",
      content: "",
      category: "",
    });
  };

  const updatePost = (prop) => (e) => {
    setError("");
    setPost({
      ...post,
      [prop]: e.target.value,
    });
  };

  return (
    <div id="all-content">
      <div id="header">
        <Header />
      </div>
      <div id="over-the-form">
        <div id="create-post-content">
          {error && <div className="error">{error}</div>}
          <div>
            <label htmlFor="title">Title:</label>
            <input
              value={post.title}
              onChange={updatePost("title")}
              type="text"
              name="title"
              id="title"
            />
          </div>
          <div>
            <label htmlFor="content">Content:</label>
            <textarea
              value={post.content}
              onChange={updatePost("content")}
              name="content"
              id="content"
              cols="30"
              rows="10"
            ></textarea>
          </div>
          <div>
            <label htmlFor="categories" id="categories">
              Category:
            </label>
            <select
              value={post.category}
              onChange={updatePost("category")}
              id="categories"
              name="categories"
            >
              <option value="">Please choose...</option>
              <option value="art">Art</option>
              <option value="gaming">Gaming</option>
              <option value="photography">Photography</option>
              <option value="lego">Lego</option>
            </select>
          </div>
          <NavLink className="close-create-post-button" to={"/home"}>
            X
          </NavLink>
          <button onClick={createPost} id="create-post-button">
            Create Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;