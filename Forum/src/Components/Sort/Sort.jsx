import PropTypes from "prop-types";
import "./Sort.css";

/**
 * Sort component for sorting and searching posts.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.selected - The currently selected sort option.
 * @param {function} props.handleChange - The function to handle sort option change.
 * @param {string} props.selectedValue - The currently selected search option.
 * @param {function} props.setSelectedValue - The function to handle search option change.
 * @param {string} props.inputValue - The current search input value.
 * @param {function} props.handleInputValue - The function to handle search input change.
 * @returns {JSX.Element} The rendered Sort component.
 */
const Sort = ({
  selected,
  handleChange,
  selectedValue,
  setSelectedValue,
  inputValue,
  handleInputValue,
}) => {
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
        </select>
        <div className="searchBy-box">
          <label htmlFor="search-by" id="search-by-label">
            Search by
          </label>
          <select
            value={selectedValue}
            onChange={setSelectedValue}
            name="search-by"
            id="search-by"
          >
            <option className="option-search-by" value="title">
              Title
            </option>
            <option className="option-search-by" value="author">
              Author
            </option>
          </select>
          <input
            value={inputValue}
            onChange={handleInputValue}
            type="text"
            name="search-by-input"
            id="search-by-input"
          />
        </div>
      </div>
    </>
  );
};

Sort.propTypes = {
  selected: PropTypes.string,
  handleChange: PropTypes.func,
  selectedValue: PropTypes.string,
  setSelectedValue: PropTypes.func,
  inputValue: PropTypes.string,
  handleInputValue: PropTypes.func,
};

export default Sort;
