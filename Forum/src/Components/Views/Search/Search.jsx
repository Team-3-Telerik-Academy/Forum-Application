import "./Search.css";
import { useContext, useEffect, useState } from "react";
import {
  getAllPosts,
} from "../../../services/posts.service";
import { useParams } from "react-router-dom";
import PostsTemplate from "../../PostsTemplate/PostsTemplate";
import Header from "../../Header/Header";
import Sort from "../../Sort/Sort";
import AppContext from "../../../AppContext/AppContext";
import { handleDeletePost, handleDislikePost, handleLikePost } from "../../../helpers/like-dislike-delete-functions";

const Search = () => {
  const [posts, setPosts] = useState(null);
  const [selected, setSelected] = useState("");
  const [postsChange, setPostsChange] = useState(false);
  const { searchTerm } = useParams();
  const { userData } = useContext(AppContext);

  useEffect(() => {
    getAllPosts().then((allPosts) => {
      const result = allPosts.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setPosts(result);
    });
  }, [postsChange, searchTerm]);

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

  const handleChange = (e) => {
    setSelected(e.target.value);
  };

  return (
    <div className="search-content">
      <Header magnifiedGlassColor="#d98f40" inputColor={'#d98f40'} />
      <div id="search-content-title">
        <h2>Search the Community</h2>
        <p>
          Showing {posts?.length} results for &apos;{searchTerm}&apos;:
        </p>
      </div>
      <div className="search-post-main">
        <Sort selected={selected} handleChange={handleChange} />
        {posts?.map((post) => (
          <PostsTemplate
            key={post.id}
            post={post}
            likePost={() => handleLikePost(post.id, userData, setPostsChange, postsChange)}
            dislikePost={() => handleDislikePost(post.id, userData, setPostsChange, postsChange)}
            deletePost={() => handleDeletePost(post.id, userData, setPostsChange, postsChange)}
          />
        ))}
        <div className="post-footer"></div>
      </div>
    </div>
  );
};

export default Search;
