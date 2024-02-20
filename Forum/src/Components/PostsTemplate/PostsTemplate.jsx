import PropTypes from "prop-types";
import "./PostsTemplate.css";
import { NavLink } from "react-router-dom";
import Button from "../Button/Button";
import { useContext } from "react";
import AppContext from "../../AppContext/AppContext";

const PostsTemplate = ({ post, likePost, dislikePost, deletePost }) => {
  const { userData } = useContext(AppContext);

  return (
    <NavLink to={`/post/${post.id}`}>
      <div className="post-main-content">
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
              <span>{post.likes} likes <br /> <br /> {post.comments ? Object.keys(post.comments).length : 0} replies </span>
            {/* <div> */}
              {/* <span>
                {post.comments ? Object.keys(post.comments).length : 0} replies
              </span> */}
            {/* </div> */}
            {/* {post.likedBy ? (
              post.likedBy.includes(userData?.username) ? (
                <Button onClick={dislikePost} color={"#d98f40"}>
                  Dislike
                </Button>
              ) : (
                <Button onClick={likePost} color={"#d98f40"}>
                  Like
                </Button>
              )
            ) : (
              <Button onClick={likePost} color={"#d98f40"}>
                Like
              </Button>
            )} */}
          </div>
          <div className="right">
            <span>
              {post.author}{" "}
              {/* {(post.author === userData?.username || userData?.admin) && (
                <Button
                  onClick={deletePost}
                  color={"#d98f40"}
                  // color={"red"}
                >
                  Delete
                </Button>
              )} */}
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
    </NavLink>
  );
};

PostsTemplate.propTypes = {
  post: PropTypes.object,
  likePost: PropTypes.func,
  dislikePost: PropTypes.func,
  deletePost: PropTypes.func,
};

export default PostsTemplate;
