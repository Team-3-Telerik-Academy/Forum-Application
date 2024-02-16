import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPostsByCategory } from "../../../services/posts.service";
import { useParams } from "react-router-dom";
import Header from "../../Header/Header";
import "./Posts.css";
import AppContext from "../../../AppContext/AppContext";
import PostsTemplate from "../../PostsTemplate/PostsTemplate";
import Sort from "../../Sort/Sort";
import {
  handleDeletePost,
  handleDislikePost,
  handleLikePost,
} from "../../../helpers/like-dislike-delete-functions";
import { searchPostBy, setValue, sortPosts } from "../../../helpers/filter-sort-helpers";

const Posts = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const { userData } = useContext(AppContext);
  const [posts, setPosts] = useState();
  const [filteredPosts, setFilteredPosts] = useState(null);
  const [selected, setSelected] = useState("");
  const [postsChange, setPostsChange] = useState(false);
  const [selectedValue, setSelectedValue] = useState("title");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    searchPostBy(inputValue, selectedValue, setFilteredPosts, posts);
  }, [inputValue, posts]);

  useEffect(() => {
    if (
      type !== "gaming" &&
      type !== "art" &&
      type !== "lego" &&
      type !== "photography"
    ) {
      return navigate("*");
    }
  }, []);

  useEffect(() => {
    getPostsByCategory(type).then(setPosts);
  }, [postsChange]);

  useEffect(() => {
    if (selected && sortPosts(selected)) {
      if (inputValue) {
        setFilteredPosts([...filteredPosts].sort(sortPosts(selected)));
      } else {
        setPosts([...posts].sort(sortPosts(selected)));
      }
    }
  }, [selected]);

  return (
    <div className="post-content">
      <Header magnifiedGlassColor="#d98f40" inputColor={"#d98f40"} />
      <div className="title">
        <span>{type.charAt(0).toUpperCase() + type.slice(1)} category</span>
        <hr />
        <div id="posts-count">
          Posts <div id="count">{posts?.length}</div>
        </div>
      </div>
      <div className="post-main">
        <Sort
          selected={selected}
          handleChange={setValue(setSelected)}
          selectedValue={selectedValue}
          setSelectedValue={setValue(setSelectedValue)}
          inputValue={inputValue}
          handleInputValue={setValue(setInputValue)}
        />
        {(inputValue ? filteredPosts : posts)?.map((post) => {
          return (
            <PostsTemplate
              key={post.id}
              post={post}
              likePost={() =>
                handleLikePost(post.id, userData, setPostsChange, postsChange)
              }
              dislikePost={() =>
                handleDislikePost(
                  post.id,
                  userData,
                  setPostsChange,
                  postsChange
                )
              }
              deletePost={() =>
                handleDeletePost(post.id, userData, setPostsChange, postsChange)
              }
            />
          );
        })}
        <div className="post-footer"></div>
      </div>
    </div>
  );
};

export default Posts;
