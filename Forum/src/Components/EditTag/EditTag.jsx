import { useState } from "react";
import Button from "../Button/Button";
import { editTagPost } from "../../services/posts.service";
import PropTypes from "prop-types";
import './EditTag.css';

/**
 * EditTag component for editing a tag.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.postId - The ID of the post.
 * @param {string} props.tagId - The ID of the tag.
 * @param {string} props.initialContent - The initial content of the tag.
 * @param {Function} props.deleteTag - The function to delete the tag.
 * @returns {JSX.Element} The rendered EditTag component.
 */
const EditTag = ({ postId, tagId, initialContent, deleteTag }) => {
  const [content, setContent] = useState(initialContent);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const editTag = () => {
    editTagPost(postId, tagId, content);
  };

  return (
    <div id="edit-or-delete-single-tag">
      <textarea
        value={content}
        onChange={handleContentChange}
        onBlur={editTag}
        rows="1"
      />
      <Button onClick={() => deleteTag(tagId)}>X</Button>
    </div>
  );
};

EditTag.propTypes = {
  postId: PropTypes.string,
  tagId: PropTypes.string,
  initialContent: PropTypes.string,
  deleteTag: PropTypes.func,
};

export default EditTag;
