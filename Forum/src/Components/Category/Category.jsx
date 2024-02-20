import "./Category.css";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPostsByCategory } from "../../services/posts.service";

/**
 * Renders a category component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.image - The image source for the category.
 * @param {string} props.name - The name of the category.
 * @param {string} props.color - The background color of the category.
 * @returns {JSX.Element} The rendered Category component.
 */
const Category = ({ image, name, color }) => {
  const [postLength, setPostLength] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getPostsByCategory(name).then((array) => setPostLength(array.length));
  }, []);

  return (
    <div
      onClick={() => navigate(`/post-category/${name.toLowerCase()}`)}
      id="category-content"
    >
      <div id="image-content">
        <img src={image} alt="gaming" />
        <div style={{ backgroundColor: color }} id="category-name">
          <span>{name}</span>
          <span id="posts">
            {postLength} <br /> posts
          </span>
        </div>
      </div>
    </div>
  );
};

Category.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default Category;
