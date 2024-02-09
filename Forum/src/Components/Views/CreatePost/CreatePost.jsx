import { NavLink } from "react-router-dom";
import "./CreatePost.css";
import Header from "../../Header/Header";
import { useContext, useState } from "react";
import AppContext from "../../../AppContext/AppContext";
import { addTweet } from "../../../services/tweets.service";

const CreatePost = () => {
  const { userData } = useContext(AppContext);
  const [post, setPost] = useState({
    title: "",
    content: "",
    category: '',
  });

  const createPost = async () => {
    await addTweet(post.title, post.content, post.category, userData.handle);
    setPost({
        title: '',
        content: '',
        category: '',
    })
  }

  const updatePost = (prop) => (e) => {
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
      <div id="create-post-content">
        <div>
          <label htmlFor="title">Title:</label> <br />
          <input value={post.title} onChange={updatePost('title')} type="text" name="title" id="title" />
        </div>
        <div>
          <label htmlFor="content">Content:</label> <br />
          <textarea value={post.content} onChange={updatePost('content')} name="content" id="content" cols="30" rows="10"></textarea>
        </div>
        <div>
          <label htmlFor="categories">Category:</label> <br />
          <select value={post.category} onChange={updatePost('category')} id="categories" name="categories">
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
        {/* <NavLink onClick={addTweet(post.title, post.content, post.category, user)} id="create-post-button">Create Post</NavLink> */}
        <button onClick={createPost} id="create-post-button">Create Post</button>
      </div>
    </div>
  );
};

export default CreatePost;
