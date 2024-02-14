import PropTypes from 'prop-types';
import './HomePostsTemplate.css';

const HomePostsTemplate = ({post}) => {
  return (
    <div className="single-post">
      <h3>Title: {post.title}</h3>
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
        {/* <br /> */}
        {/* {post.category} category */}
        {/* {post.views} views */}
        <br />
        {post.likes} likes
      </span>
    </div>
  );
};

HomePostsTemplate.propTypes = {
    post: PropTypes.object,
}

export default HomePostsTemplate;
