import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addCommentPost,
  deleteCommentPost,
  deletePost,
  dislikePost,
  editCommentPost,
  editPost,
  getCommentsOfAPost,
  getPostById,
  likePost,
} from "../../../services/posts.service";
import { getUserByHandle } from "../../../services/users.service";
import "./Post.css";
import Header from "../../Header/Header";
import Button from "../../Button/Button";
import AppContext from "../../../AppContext/AppContext";

const Post = () => {
  const [post, setPost] = useState(null);
  const [toPostEdit, setToPostEdit] = useState(false);
  const [error, setError] = useState("");
  const [postAuthor, setPostAuthor] = useState(null);
  const [comments, setComments] = useState(null);
  const [comment, setComment] = useState("");
  const [editedComment, setEditedComment] = useState("");
  const [isCommentEdited, setIsCommentEdited] = useState(null);

  const { id } = useParams();
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    getPostById(id)
      .then(setPost)
      .catch(() => navigate("*"));
  }, []);

  useEffect(() => {
    getCommentsOfAPost(id).then(setComments);
  }, [comment]);

  useEffect(() => {
    if (post) {
      getUserByHandle(post.author).then(setPostAuthor);
    }
  }, [post]);

  const addComment = () => {
    addCommentPost(
      userData.handle,
      id,
      comment,
      userData.firstName,
      userData.lastName
    ).then(() => setComment(""));
  };

  const deleteComment = (commentId) => {
    deleteCommentPost(id, commentId);
    setComments({ ...comments, [commentId]: null });
  };

  const editComment = (commentId) => {
    editCommentPost(id, commentId, editedComment);
    setComments({
      ...comments,
      [commentId]: { ...comments[commentId], content: editedComment },
    });
    setIsCommentEdited(null);
    setEditedComment("");
  };

  const deletePostHandle = () => {
    navigate(-1);
    deletePost(id);
  };

  const updatePost = (prop) => (e) => {
    setError("");
    setPost({
      ...post,
      [prop]: e.target.value,
    });
  };

  const editPostHandle = () => {
    if (post.title.length < 16 || post.title.length > 64) {
      setError("Title should be between 16 and 64 characters long!");
      return;
    }

    if (post.content.length < 32 || post.content.length > 8192) {
      setError("Content should be between 32 and 8192 characters long!");
      return;
    }

    setToPostEdit(false);
    editPost(id, post.title, post.content);
  };

  const dislikeHandle = () => {
    dislikePost(userData?.handle, id);
    setPost({
      ...post,
      likes: post.likes - 1,
      likedBy: { ...post.likedBy, [userData?.handle]: null },
    });
  };

  const likeHandle = () => {
    likePost(userData?.handle, id);
    setPost({
      ...post,
      likes: post.likes + 1,
      likedBy: { ...post.likedBy, [userData?.handle]: true },
    });
  };

  return (
    <div id="single-post-view">
      <Header magnifiedGlassColor="#d98f40" />
      <div id="single-post-title">
        {error && <div className="error">{error}</div>}
        <div id="title-and-buttons">
          {toPostEdit ? (
            <textarea
              value={post?.title}
              onChange={updatePost("title")}
              type="text"
              cols="100"
              rows="1"
            />
          ) : (
            <h1>{post?.title}</h1>
          )}
          <span id="single-post-buttons">
            {post?.likedBy && post?.likedBy[userData?.handle] ? (
              <Button onClick={dislikeHandle} color={"#d98f40"}>
                Dislike
              </Button>
            ) : (
              <Button onClick={likeHandle} color={"#d98f40"}>
                Like
              </Button>
            )}
            {userData?.handle === postAuthor?.handle && (
              <>
                {toPostEdit ? (
                  <Button onClick={editPostHandle} color={"#d98f40"}>
                    Done
                  </Button>
                ) : (
                  <Button onClick={() => setToPostEdit(true)} color={"#d98f40"}>
                    Edit
                  </Button>
                )}
                <Button onClick={deletePostHandle} color={"#d98f40"}>
                  Delete
                </Button>
              </>
            )}
          </span>
        </div>
        <hr />
        <span>
          <strong>By {post?.author}</strong> <br />
          {post?.createdOn.toLocaleDateString()}
        </span>
      </div>
      <div id="single-post-content">
        <div className="single-post-left-side">
          <h3>{postAuthor?.handle}</h3>
          <h4>
            {postAuthor?.firstName} {postAuthor?.lastName}
          </h4>
          <span>
            <img src="/src/Images/post-icon.png" alt="post-image" />
            15 posts
          </span>
          <span>15 comments</span>
          <span>15 likes</span>
        </div>
        <div className="single-post-right-side">
          <span>Posted {post?.createdOn.toLocaleDateString()}</span>
          {toPostEdit ? (
            <textarea
              value={post?.content}
              onChange={updatePost("content")}
              cols="106"
              rows="10"
            />
          ) : (
            <p>{post?.content}</p>
          )}
          <div id="single-post-comments-content">
            <h3>Comments:</h3>
            {comments &&
              Object.keys(comments).map((commentId, index) => {
                return isCommentEdited === commentId ? (
                  <div key={commentId} className="single-post-comment">
                    <textarea
                      value={editedComment}
                      onChange={(e) => setEditedComment(e.target.value)}
                      cols="30"
                      rows="10"
                    />
                    {userData?.handle === comments[commentId].handle && (
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
                      {comments[commentId].firstName}{" "}
                      {comments[commentId].lastName}
                    </span>
                  </div>
                ) : (
                  <div key={commentId} className="single-post-comment">
                    <p>
                      {index + 1}. {comments[commentId].content}
                    </p>
                    {userData?.handle === comments[commentId].handle && (
                      <>
                        <Button
                          id="edit-comment-button"
                          onClick={() => {
                            setIsCommentEdited(commentId);
                            setEditedComment(comments[commentId].content);
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
                      {comments[commentId].firstName}{" "}
                      {comments[commentId].lastName}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div id="single-post-create-comment">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          name="comment"
          id=""
          cols="30"
          rows="10"
        ></textarea>
        <Button onClick={addComment} color={"#d98f40"}>
          Add Comment
        </Button>
      </div>
    </div>
  );
};

export default Post;
