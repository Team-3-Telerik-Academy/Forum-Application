import PropTypes from 'prop-types';
import './HomePostsTemplate.css';

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
