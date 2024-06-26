import "./Comment.css";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppContext from "../../AppContext/AppContext";
import {
  deleteCommentPost,
  dislikeComment,
  editCommentPost,
  likeComment,
  stopDislikingComment,
  stopLikingComment,
} from "../../services/posts.service";
import Button from "../Button/Button";
import { getUserByUsername } from "../../services/users.service";

/**
 * Renders a comment component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.comment - The comment object.
 * @param {string} props.commentId - The comment ID.
 * @returns {JSX.Element} The rendered Comment component.
 */
const Comment = ({ comment, commentId }) => {
  const [editedComment, setEditedComment] = useState("");
  const [isCommentEdited, setIsCommentEdited] = useState(null);
  const [author, setAuthor] = useState(null);

  const { id } = useParams();
  const { userData } = useContext(AppContext);

  useEffect(() => {
    getUserByUsername(comment.username).then((result) =>
      setAuthor(result.val())
    );
  }, []);

  const deleteComment = (commentId) => {
    deleteCommentPost(id, commentId, userData.username);
  };

  const editComment = (commentId) => {
    editCommentPost(id, commentId, editedComment);
    setIsCommentEdited(null);
    setEditedComment("");
  };

  const handleLikeComment = (commentId) => {
    likeComment(id, userData.username, commentId);
  };

  const handleStopLikingComment = (commentId) => {
    stopLikingComment(id, userData.username, commentId);
  };

  const handleDislikeComment = (commentId) => {
    dislikeComment(id, userData.username, commentId);
  };

  const handleStopDislikingComment = (commentId) => {
    stopDislikingComment(id, userData.username, commentId);
  };

  return (
    <>
      {isCommentEdited === commentId ? (
        <div key={commentId} className="single-post-comment">
          <textarea
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
            cols="30"
            rows="10"
          />
          {userData?.username === author?.username && (
            <>
              <Button
                id="edit-comment-button"
                onClick={() => editComment(commentId)}
                color={"#d98f40"}
              >
                Done
              </Button>
              <Button
                onClick={() => deleteComment(commentId)}
                color={"#d98f40"}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      ) : (
        <div key={commentId} className="single-post-comment">
          <div>
            <p>{comment.content}</p>
            <div id="like-dislike-comment">
              {comment.likes !== 0 &&
              Object.keys(comment.likedBy).includes(userData?.username) ? (
                <img
                  onClick={() => handleStopLikingComment(commentId)}
                  src="/src/Images/full-like.png"
                  alt="like"
                />
              ) : (
                <img
                  onClick={() => handleLikeComment(commentId)}
                  src="/src/Images/empty-like.png"
                  alt="like"
                />
              )}
              <span>{comment.likes}</span>
              {comment.dislikes !== 0 &&
              Object.keys(comment.dislikedBy).includes(userData?.username) ? (
                <img
                  onClick={() => handleStopDislikingComment(commentId)}
                  src="/src/Images/full-dislike.png"
                  alt="dislike"
                />
              ) : (
                <img
                  onClick={() => handleDislikeComment(commentId)}
                  src="/src/Images/empty-dislike.png"
                  alt="dislike"
                />
              )}
              <span>{comment.dislikes}</span>
            </div>
          </div>
          {userData?.username === author?.username ? (
            <>
              <Button
                id="edit-comment-button"
                onClick={() => {
                  setIsCommentEdited(commentId);
                  setEditedComment(comment.content);
                }}
                color={"#d98f40"}
              >
                Edit
              </Button>
              <Button
                onClick={() => deleteComment(commentId)}
                color={"#d98f40"}
              >
                Delete
              </Button>
            </>
          ) : userData?.admin && <Button id={'delete-comment-admin'} onClick={() => deleteComment(commentId)} color={"#d98f40"}>
          Delete
        </Button>}
          <span>
            {author?.firstName} {author?.lastName}
          </span>
        </div>
      )}{" "}
    </>
  );
};

Comment.propTypes = {
  comment: PropTypes.object,
  commentId: PropTypes.string,
  index: PropTypes.number,
};

export default Comment;
