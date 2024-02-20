import PropTypes from "prop-types";
import "./PostsTemplate.css";
import { NavLink } from "react-router-dom";

/**
 * Renders a template for displaying a post.
 *
 * @component
 * @param {Object} post - The post object containing post details.
 * @param {string} post.id - The unique identifier of the post.
 * @param {string} post.title - The title of the post.
 * @param {string} post.author - The author of the post.
 * @param {Date} post.createdOn - The date and time when the post was created.
 * @param {number} post.likes - The number of likes the post has received.
 * @param {Object} post.comments - The comments associated with the post.
 * @returns {JSX.Element} The rendered template for displaying a post.
 */
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
