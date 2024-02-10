import { useEffect, useState } from "react";
import { getPostsByCategory } from "../../../services/posts.service";
import { NavLink, useParams } from "react-router-dom";
import Header from "../../Header/Header";
import "./Posts.css";
import { useNavigate } from "react-router-dom";

//to write the view
const Posts = () => {
  const { type } = useParams();
  const [posts, setPosts] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getPostsByCategory(type).then(setPosts);
  }, []);

  return (
    <div id="post-content">
      <Header magnifiedGlassColor="#d98f40" />
      <div className="title">
        <span>{type.charAt(0).toUpperCase() + type.slice(1)} category</span>
        <hr />
        <div id="posts-count">
          Posts <div id="count">{posts?.length}</div>
        </div>
      </div>

      <div className="post-main">
        <div className="post-header">
          <label id="label-sortBy" htmlFor="sortBy">
            Sort by
          </label>
          <select name="sortBy" id="sortBy">
            <option value="">Start Date</option>
            <option value="">Title</option>
            <option value="">Most viewed</option>
            <option value="">Most replied</option>
          </select>
        </div>
        {posts?.map((post) => {
          return (
            <div className="post-main-content" key={post.id}>
              <div className="title-author">
                <NavLink to="">{post.title}</NavLink>
                <span>
                  By {post.author}, {post.createdOn}
                </span>
              </div>
              <div className="replies-views">
                <div className="left">
                  <span>0 replies</span>
                  <span>427 views</span>
                </div>
                <div className="right">
                  <span>{post.author}</span>
                  <span>{post.createdOn}</span>
                </div>
              </div>
            </div>
          );
        })}
        <div className="post-footer"></div>
      </div>
    </div>
  );
};

export default Posts;
