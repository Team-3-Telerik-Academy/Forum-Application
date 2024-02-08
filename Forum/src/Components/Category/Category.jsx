import "./Category.css";
import PropTypes from 'prop-types';

const Category = ({ image, name, posts, color}) => {
  return (
    <div id="category-content">
      <div id="image-content">
        <img src={image} alt="gaming" />
        <div style={{ backgroundColor: color }} id="category-name">
          <span>{name}</span>
          <span id="posts">{posts} <br/> posts</span>
        </div>
      </div>
    </div>
  );
};

Category.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  posts: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
}

export default Category;