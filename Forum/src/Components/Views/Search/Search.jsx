import "./Search.css";
import { useContext, useEffect, useState } from "react";
import { getAllPosts } from "../../../services/posts.service";
import { useParams } from "react-router-dom";
import PostsTemplate from "../../PostsTemplate/PostsTemplate";
import Header from "../../Header/Header";
import Sort from "../../Sort/Sort";
import AppContext from "../../../AppContext/AppContext";
import {
  handleDeletePost,
  handleDislikePost,
  handleLikePost,
} from "../../../helpers/like-dislike-delete-functions";
import {
  searchPostBy,
  setValue,
  sortPosts,
} from "../../../helpers/filter-sort-helpers";

const Search = () => {
  const [posts, setPosts] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState(null);
  const [selected, setSelected] = useState("");
  const [postsChange, setPostsChange] = useState(false);
  const [selectedValue, setSelectedValue] = useState("title");
  const [inputValue, setInputValue] = useState("");

  const { searchTerm } = useParams();
  const { userData } = useContext(AppContext);

  useEffect(() => {
    searchPostBy(inputValue, selectedValue, setFilteredPosts, posts);
  }, [inputValue, posts]);

  useEffect(() => {
    getAllPosts().then((allPosts) => {
      const fromTitle = allPosts.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const fromTags = allPosts.filter((post) => {
        if (post.tags) {
          return Object.values(post.tags).includes(searchTerm.toLowerCase());
        }
      });

      const result = Array.from(new Set([...fromTitle, ...fromTags]));
      setPosts(result);
    });
  }, [postsChange, searchTerm]);

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
    <div className="search-content">
      <Header magnifiedGlassColor="#d98f40" inputColor={"#d98f40"} />
      <div id="search-content-title">
        <h2>Search the Community</h2>
        <p>
          Showing {posts?.length} results for &apos;{searchTerm}&apos;:
        </p>
      </div>
      <div className="search-post-main">
        <Sort
          selected={selected}
          handleChange={setValue(setSelected)}
          selectedValue={selectedValue}
          setSelectedValue={setValue(setSelectedValue)}
          inputValue={inputValue}
          handleInputValue={setValue(setInputValue)}
        />
        {(inputValue ? filteredPosts : posts)?.map((post) => (
          <PostsTemplate
            key={post.id}
            post={post}
            likePost={() =>
              handleLikePost(post.id, userData, setPostsChange, postsChange)
            }
            dislikePost={() =>
              handleDislikePost(post.id, userData, setPostsChange, postsChange)
            }
            deletePost={() =>
              handleDeletePost(post.id, userData, setPostsChange, postsChange)
            }
          />
        ))}
        <div className="post-footer"></div>
      </div>
    </div>
  );
};

export default Search;
