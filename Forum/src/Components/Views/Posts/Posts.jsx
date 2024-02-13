import { useContext, useEffect, useState } from "react";
import {
  deletePost,
  dislikePost,
  getPostsByCategory,
  likePost,
} from "../../../services/posts.service";
import { NavLink, useParams } from "react-router-dom";
import Header from "../../Header/Header";
import "./Posts.css";
import Button from "../../Button/Button";
import AppContext from "../../../AppContext/AppContext";

const Posts = () => {
  const { type } = useParams();
  const { userData } = useContext(AppContext);
  const [posts, setPosts] = useState();
  const [selected, setSelected] = useState("");
  const [postsChange, setPostsChange] = useState(false);

  const handleChange = (e) => {
    setSelected(e.target.value);
  };

  useEffect(() => {
    getPostsByCategory(type).then(setPosts);
  }, [postsChange]);

  useEffect(() => {
    const sortPosts = () => {
      switch (selected) {
        case "title":
          return (a, b) => a.title.localeCompare(b.title);
        case "title-ZA":
          return (a, b) => b.title.localeCompare(a.title);
        case "newest":
          return (a, b) => a.createdOn - b.createdOn;
        case "oldest":
          return (a, b) => b.createdOn - a.createdOn;
        default:
          return null;
      }
    };

    if (selected && sortPosts()) {
      setPosts([...posts].sort(sortPosts()));
    }
  }, [selected]);

  const handleLikePost = (postId) => {
    likePost(userData.username, postId).then(() =>
      setPostsChange(!postsChange)
    );
  };

  const handleDislikePost = (postId) => {
    console.log(postId);
    dislikePost(userData.username, postId).then(() =>
      setPostsChange(!postsChange)
    );
  };

  const handleDeletePost = (postId) => {
    deletePost(postId, userData.username).then(() => setPostsChange(!postsChange));
  };

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
            <option value="title">Title A-Z</option>
            <option value="title-ZA">Title Z-A</option>
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
                  <span>
                    {post.comments ? Object.keys(post.comments).length : 0}{" "}
                    replies
                  </span>
                  {post.likedBy ? (
                    post.likedBy.includes(userData?.username) ? (
                      <Button
                        onClick={() => handleDislikePost(post.id)}
                        color={"#d98f40"}
                      >
                        Dislike
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleLikePost(post.id)}
                        color={"#d98f40"}
                      >
                        Like
                      </Button>
                    )
                  ) : (
                    <Button
                      onClick={() => handleLikePost(post.id)}
                      color={"#d98f40"}
                    >
                      Like
                    </Button>
                  )}
                </div>
                <div className="right">
                  <span>
                    {post.author}{" "}
                    {post.author === userData?.username && (
                      <Button
                        onClick={() => handleDeletePost(post.id)}
                        color={"#d98f40"}
                      >
                        Delete
                      </Button>
                    )}
                  </span>
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
