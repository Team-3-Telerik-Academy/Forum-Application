import { useContext, useEffect, useState } from "react";
import {
  getPostsByCategory,
} from "../../../services/posts.service";
import { useParams } from "react-router-dom";
import Header from "../../Header/Header";
import "./Posts.css";
import AppContext from "../../../AppContext/AppContext";
import PostsTemplate from "../../PostsTemplate/PostsTemplate";
import Sort from "../../Sort/Sort";
import { handleDeletePost, handleDislikePost, handleLikePost } from "../../../helpers/like-dislike-delete-functions";

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
        case "oldest":
          return (a, b) => a.createdOn - b.createdOn;
        case "newest":
          return (a, b) => b.createdOn - a.createdOn;
        default:
          return null;
      }
    };

    if (selected && sortPosts()) {
      setPosts([...posts].sort(sortPosts()));
    }
  }, [selected]);

  return (
    <div className="post-content">
      <Header magnifiedGlassColor="#d98f40" inputColor={'#d98f40'}/>
      <div className="title">
        <span>{type.charAt(0).toUpperCase() + type.slice(1)} category</span>
        <hr />
        <div id="posts-count">
          Posts <div id="count">{posts?.length}</div>
        </div>
      </div>
      <div className="post-main">
        <Sort selected={selected} handleChange={handleChange} />
        {posts?.map((post) => {
          return (
            <PostsTemplate
              key={post.id}
              post={post}
              likePost={() => handleLikePost(post.id, userData, setPostsChange, postsChange)}
              dislikePost={() => handleDislikePost(post.id, userData, setPostsChange, postsChange)}
              deletePost={() => handleDeletePost(post.id, userData, setPostsChange, postsChange)}
            />
          );
        })}
        <div className="post-footer"></div>
      </div>
    </div>
  );
};

export default Posts;
