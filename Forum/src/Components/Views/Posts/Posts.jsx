import { useEffect, useState } from "react";
import { getPostsByCategory } from "../../../services/posts.service";
import { NavLink, useParams } from "react-router-dom";
import Header from "../../Header/Header";
import "./Posts.css";

const Posts = () => {
  const { type } = useParams();
  const [posts, setPosts] = useState();
  const [selected, setSelected] = useState("");

  const handleChange = (e) => {
    setSelected(e.target.value);
  };

  useEffect(() => {
    getPostsByCategory(type).then(setPosts);
  }, []);

  useEffect(() => {
    if (selected === "title") {
      const sortByTitle = [...posts].sort((a, b) => {
        return a.title > b.title ? 1 : -1;
      });
      setPosts(sortByTitle);
    } else if (selected === "newest") {
      const sortByDate = [...posts].sort((a, b) => {
        return a.createdOn - b.createdOn;
      });
      setPosts(sortByDate);
    } else if (selected === "oldest") {
      const sortByDate = [...posts].sort((a, b) => {
        return b.createdOn - a.createdOn;
      });
      setPosts(sortByDate);
    }
    // by Viewed and Replies
  }, [selected]);

  return (
    <div className="post-content">
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
          <select
            value={selected}
            name="sortBy"
            id="sortBy"
            onChange={handleChange}
          >
            <option value="newest">Newest to oldest</option>
            <option value="oldest">Oldest to newest</option>
            <option value="title">Title</option>
            <option value="viewed">Most viewed</option>
            <option value="replied">Most replied</option>
          </select>
        </div>
        {posts?.map((post) => {
          return (
            <div className="post-main-content" key={post.id}>
              <div className="title-author">
                <NavLink to={`/post/${post.id}`}>{post.title}</NavLink>
                <span>
                  By {post.author},
                  {post.createdOn.toLocaleString("bg-BG", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="replies-views">
                <div className="left">
                  <span>0 replies</span>
                  <span>427 views</span>
                </div>
                <div className="right">
                  <span>{post.author}</span>
                  <span>
                    {post.createdOn.toLocaleString("bg-BG", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
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
