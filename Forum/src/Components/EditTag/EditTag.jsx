import { useState } from "react";
import Button from "../Button/Button";
import { editTagPost } from "../../services/posts.service";
import PropTypes from "prop-types";
import './EditTag.css';

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
