import PropTypes from "prop-types";
import "./PostsTemplate.css";
import { NavLink } from "react-router-dom";

const PostsTemplate = ({ post }) => {
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
            <span>{post.likes} likes</span>
            <span>
              {post.comments ? Object.keys(post.comments).length : 0} replies
            </span>
          </div>
          <div className="right">
            <span>{post.author} </span>
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
};

export default PostsTemplate;
