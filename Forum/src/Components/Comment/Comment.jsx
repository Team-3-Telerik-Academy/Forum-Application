import './Comment.css';
import PropTypes from 'prop-types';
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import AppContext from '../../AppContext/AppContext';
import { deleteCommentPost, dislikeComment, editCommentPost, likeComment, stopDislikingComment, stopLikingComment } from '../../services/posts.service';
import Button from '../Button/Button';


const Comment = ({comment, commentId, index}) => {
  const [editedComment, setEditedComment] = useState("");
  const [isCommentEdited, setIsCommentEdited] = useState(null);

  const { id } = useParams();
  const { userData } = useContext(AppContext);

    const deleteComment = (commentId) => {
        deleteCommentPost(id, commentId, userData.username);
      };
    
      const editComment = (commentId) => {
        editCommentPost(id, commentId, editedComment);
        setIsCommentEdited(null);
        setEditedComment("");
      };
    
      const handleLikeComment = (commentId) => {
        likeComment(id, userData.username, commentId)
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
        isCommentEdited === commentId ? (
          <div key={commentId} className="single-post-comment">
            <textarea
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
              cols="30"
              rows="10"
            />
            {userData?.username === comment.username && (
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
            <span>
              {comment.firstName}
              {comment.lastName}
            </span>
          </div>
        ) : (
          <div key={commentId} className="single-post-comment">
            <div>
              {index + 1}. {comment.content}
              <div id="like-dislike-comment">
                {comment.likes !== 0 &&
                Object.keys(comment.likedBy).includes(
                  userData?.username
                ) ? (
                  <img
                    onClick={() => handleStopLikingComment(commentId)}
                    src="/src/Images/full-like.svg"
                    alt="like"
                  />
                ) : (
                  <img
                    onClick={() => handleLikeComment(commentId)}
                    src="/src/Images/empty-like.svg"
                    alt="like"
                  />
                )}
                <span>{comment.likes}</span>
                {comment.dislikes !== 0 &&
                Object.keys(comment.dislikedBy).includes(
                  userData?.username
                ) ? (
                  <img
                    onClick={() =>
                      handleStopDislikingComment(commentId)
                    }
                    src="/src/Images/full-dislike.svg"
                    alt="dislike"
                  />
                ) : (
                  <img
                    onClick={() => handleDislikeComment(commentId)}
                    src="/src/Images/empty-dislike.svg"
                    alt="dislike"
                  />
                )}
                <span>{comment.dislikes}</span>
              </div>
            </div>
            {userData?.username === comment.username && (
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
            )}
            <span>
              {comment.firstName}
              {comment.lastName}
            </span>
          </div>
        )
    )
}

Comment.propTypes = {
    comment: PropTypes.object,
    commentId: PropTypes.string,
    index: PropTypes.number,
}

export default Comment;