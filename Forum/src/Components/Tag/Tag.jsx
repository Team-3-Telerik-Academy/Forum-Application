import { useContext, useEffect, useState } from "react";
import Button from "../Button/Button";
import {
  addTagPost,
  deleteTagPost,
  getTagsOfAPost,
} from "../../services/posts.service";
import { useNavigate } from "react-router-dom";
import EditTag from "../EditTag/EditTag";
import AppContext from "../../AppContext/AppContext";
import PropTypes from "prop-types";
import "./Tag.css";

/**
 * Renders a Tag component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.postId - The ID of the post.
 * @param {string} props.postAuthor - The author of the post.
 * @param {function} props.changePost - A function to trigger post change.
 * @returns {JSX.Element} The rendered Tag component.
 */
const Tag = ({ postId, postAuthor, changePost }) => {
  const [tags, setTags] = useState(null);
  const [tag, setTag] = useState("");
  const [tagError, setTagError] = useState("");
  const [addTag, setAddTag] = useState(false);
  const [editTags, setEditTags] = useState(false);

  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    getTagsOfAPost(postId).then(setTags);
  }, [tag, tags]);

  const searchByTag = (tag) => {
    navigate(`/search/${tag}`);
  };

  const addNewTag = () => {
    if (!tag) {
      setTagError("Tag can't be empty!");
      return;
    }

    if (/[A-Z]/.test(tag)) {
      setTagError("Tag can contain only lowercase letters and numbers!");
      return;
    }

    if (tag.startsWith("#")) {
      setTagError("Tag can't start with #!");
      return;
    }

    if (tags && Object.values(tags).includes(tag)) {
      setTagError("Tag already exists!");
      return;
    }

    addTagPost(postId, tag).then(() => {
      setTag("");
      setAddTag(false);
    });
  };

  const deleteTag = (tagId) => {
    deleteTagPost(postId, tagId).then(() => {
      const newTags = { ...tags };
      delete newTags[tagId];
      setTags(newTags);
      changePost(true);
    });
  };

  return (
    <>
      {tags && (
        <div className="single-post-tags-content">
          <div id="tags-title-and-tags">
            <h3>Tags:</h3>
            {Object.keys(tags).map((key) =>
              editTags ? (
                <EditTag
                  key={key}
                  tagId={key}
                  initialContent={tags[key]}
                  postId={postId}
                  deleteTag={deleteTag}
                />
              ) : (
                <span onClick={() => searchByTag(tags[key])} key={key}>
                  {tags[key]}
                </span>
              )
            )}
          </div>
          {postAuthor === userData?.username || userData?.admin ? (
            addTag ? (
              <div id="add-tag-content">
                {tagError && <div className="error">{tagError}</div>}
                <textarea
                  name="tag"
                  id="tag"
                  cols="15"
                  rows="1"
                  value={tag}
                  onChange={(e) => {
                    setTag(e.target.value);
                    setTagError("");
                  }}
                />
                <Button
                  onClick={addNewTag}
                  id={"add-tag-button"}
                  color={"#d98f40"}
                >
                  Add
                </Button>
                <Button
                  onClick={() => {
                    setAddTag(false);
                    setTag("");
                  }}
                  id={"add-tag-button"}
                  color={"#d98f40"}
                >
                  Back
                </Button>
              </div>
            ) : editTags ? (
              <Button
                onClick={() => setEditTags(false)}
                width={"100px"}
                color={"#d98f40"}
              >
                Done Editing
              </Button>
            ) : (
              <div id="tag-buttons">
                <Button
                  onClick={() => setAddTag(true)}
                  id={"add-tag-button"}
                  color={"#d98f40"}
                >
                  Add New Tag
                </Button>
                <Button onClick={() => setEditTags(true)} color={"#d98f40"}>
                  Edit Tags
                </Button>
              </div>
            )
          ) : null}
        </div>
      )}
    </>
  );
};

Tag.propTypes = {
  postId: PropTypes.string,
  postAuthor: PropTypes.string,
  changePost: PropTypes.func,
};

export default Tag;
