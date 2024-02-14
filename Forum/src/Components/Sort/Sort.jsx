import PropTypes from "prop-types";
import './Sort.css';

const Sort = ({ selected, handleChange }) => {
  return (
    <>
      <div className="post-header">
        <label id="label-sortBy" htmlFor="sortBy">
          Sort by
        </label>
        <select
          value={selected}
          name="sortBy"
          id="sortBy"
          onChange={handleChange}
        >
          <option value="newest">Newest to oldest</option>
          <option value="oldest">Oldest to newest</option>
          <option value="title">Title A-Z</option>
          <option value="title-ZA">Title Z-A</option>
          <option value="viewed">Most viewed</option>
          <option value="replied">Most replied</option>
        </select>
      </div>
    </>
  );
};

Sort.propTypes = {
  selected: PropTypes.string,
  handleChange: PropTypes.func,
};

export default Sort;
