import PropTypes from 'prop-types';
import './HomePostsTemplate.css';

/**
 * Renders a template for displaying a home post.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.post - The post object containing post details.
 * @param {Function} props.goToSinglePost - The function to navigate to a single post.
 * @param {Object} props.cursor - The CSS cursor style for the post title.
 * @returns {JSX.Element} The rendered HomePostsTemplate component.
 */
const HomePostsTemplate = ({post, goToSinglePost, cursor}) => {
  return (
    <div className="single-post">
      <h3 style={cursor} onClick={() => goToSinglePost(post.id)}>{post.title}</h3>
      <p>
        By {post.author},{" "}
        {new Date(post.createdOn).toLocaleString("bg-BG", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <span>
        {post?.comments ? Object.keys(post.comments).length : 0} replies
        <br />
        {post.likes} likes
      </span>
    </div>
  );
};

HomePostsTemplate.propTypes = {
    post: PropTypes.object,
    goToSinglePost: PropTypes.func,
    cursor: PropTypes.object,
}

export default HomePostsTemplate;
