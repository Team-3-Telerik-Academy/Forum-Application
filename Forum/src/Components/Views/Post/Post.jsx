import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addCommentPost,
  addTagPost,
  deletePost,
  dislikePost,
  editPost,
  getCommentsOfAPost,
  getPostById,
  likePost,
} from "../../../services/posts.service";
import { getUserByUsername } from "../../../services/users.service";
import "./Post.css";
import Header from "../../Header/Header";
import Button from "../../Button/Button";
import AppContext from "../../../AppContext/AppContext";
import Comment from "../../Comment/Comment";
import Tag from "../../Tag/Tag";

const Post = () => {
  const [post, setPost] = useState(null);
  const [toPostEdit, setToPostEdit] = useState(false);
  const [error, setError] = useState("");
  const [postAuthor, setPostAuthor] = useState(null);
  const [comments, setComments] = useState(null);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [tag, setTag] = useState("");
  const [tagError, setTagError] = useState("");
  const [addTag, setAddTag] = useState(false);
  const [changePost, setChangePost] = useState(false);

  const { id } = useParams();
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    getPostById(id).then((result) => {
      if (!result) {
        navigate("*");
      }

      setPost(result);
    });
  }, [tag, changePost]);

  useEffect(() => {
    if (post) {
      getUserByUsername(post.author).then((snapshot) =>
        setPostAuthor(snapshot.val())
      );
    }
    getCommentsOfAPost(id).then(setComments);
  }, [comment, post, comments]);

  const addNewTag = () => {
    if (!tag) {
      setTagError("Tag can't be empty!");
      return;
    }

    if (/[A-Z]/.test(tag)) {
      setTagError("Tag can contain only lowercase letters and numbers!");
      return;
    }

    if (post.tags && Object.values(post.tags).includes(tag)) {
      setTagError("Tag already exists!");
      return;
    }

    addTagPost(id, tag).then(() => {
      setTag("");
      setAddTag(false);
      setChangePost(false);
    });
  };

  const addComment = () => {
    addCommentPost(
      userData.username,
      id,
      comment,
      userData.firstName,
      userData.lastName
    ).then(() => setComment(""));
  };

  const deletePostHandle = () => {
    deletePost(id, postAuthor.username).then(() => navigate(-1));
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

  const dislikePostHandle = () => {
    dislikePost(userData.username, id).then(() => {
      return setPost({
        ...post,
        likes: post.likes - 1,
        likedBy: { ...post.likedBy, [userData.username]: null },
      });
    });
  };

  const likePostHandle = () => {
    likePost(userData.username, id).then(() => {
      return setPost({
        ...post,
        likes: post.likes + 1,
        likedBy: { ...post.likedBy, [userData.username]: true },
      });
    });
  };

  return (
    <div id="single-post-view">
      <Header inputColor={"#CD4D95"} />
      <div id="single-post-title">
        {error && <div className="error">{error}</div>}
        <div id="title-and-buttons">
          {toPostEdit ? (
            <textarea
              value={post?.title}
              onChange={updatePost("title")}
              type="text"
              cols="94"
              rows="1"
            />
          ) : (
            <h1>{post?.title}</h1>
          )}
          <span id="single-post-buttons">
            {post?.likedBy && post?.likedBy[userData?.username] ? (
              <Button onClick={dislikePostHandle} color={"#CD4D95"}>
                Dislike
              </Button>
            ) : (
              <Button onClick={likePostHandle} color={"#CD4D95"}>
                Like
              </Button>
            )}
            {userData?.username === postAuthor?.username ? (
              <>
                {toPostEdit ? (
                  <Button onClick={editPostHandle} color={"#CD4D95"}>
                    Done
                  </Button>
                ) : (
                  <Button onClick={() => setToPostEdit(true)} color={"#CD4D95"}>
                    Edit
                  </Button>
                )}
                <Button onClick={deletePostHandle} color={"#CD4D95"}>
                  Delete
                </Button>
                {!post?.tags && (
                  <Button
                    width={"115px"}
                    onClick={() => setAddTag(true)}
                    id={"add-tag-button"}
                    color={"#CD4D95"}
                  >
                    Add New Tag
                  </Button>
                )}
              </>
            ) : (
              userData?.admin && (
                <>
                  <Button onClick={deletePostHandle} color={"#CD4D95"}>
                    Delete
                  </Button>
                  {!post?.tags && (
                    <Button
                      width={"115px"}
                      onClick={() => setAddTag(true)}
                      id={"add-tag-button"}
                      color={"#d98f40"}
                    >
                      Add New Tag
                    </Button>
                  )}
                </>
              )
            )}
          </span>
        </div>
        <hr />
        <span>
          <strong>By {post?.author}</strong> <br />
          {post?.createdOn.toLocaleString("bg-BG", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          <br />
          {post?.likes} likes
        </span>
        {addTag && !post.tag && (
          <div id="add-first-tag-content">
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
              id={"add-first-tag-button"}
              color={"#CD4D95"}
            >
              Add
            </Button>
          </div>
        )}
      </div>
      <div id="single-post-content">
        <div className="single-post-left-side">
          <h3>{postAuthor?.username}</h3>
          {postAuthor?.avatar && (
            <img
              id="single-post-avatar"
              src={postAuthor.avatar}
              alt={postAuthor.username}
            />
          )}
          <h4>
            {postAuthor?.firstName} {postAuthor?.lastName}
          </h4>
          <span>
            <img src="/src/Images/post-icon.png" alt="post-image" />
            {postAuthor?.posts ? Object.keys(postAuthor.posts).length : 0} posts
          </span>
          <span>{postAuthor?.comments} comments</span>
          <span>
            {postAuthor?.likedPosts ? postAuthor.likedPosts : 0} liked posts
          </span>
        </div>
        <div className="single-post-right-side">
          <span>Posted {post?.createdOn.toLocaleDateString("BG-bg")}</span>
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
          {comments && (
            <div id="single-post-comments-content">
              <h3>Comments:</h3>
              {Object.keys(comments).map((commentId) => (
                <Comment
                  comment={comments[commentId]}
                  commentId={commentId}
                  key={commentId}
                />
              ))}
            </div>
          )}
          {post?.tags && (
            <Tag
              changePost={setChangePost}
              postId={id}
              postAuthor={post?.author}
            />
          )}
        </div>
      </div>
      <div id="single-post-create-comment">
        {commentError && <div className="comment-error">{commentError}</div>}
        {userData?.isBlocked ? null : (
          <>
            {" "}
            <textarea
              value={comment}
              onChange={(e) => {
                setComment(e.target.value), setCommentError("");
              }}
              name="comment"
              id=""
              cols="30"
              rows="10"
            ></textarea>
            <Button onClick={addComment} color={"#CD4D95"}>
              Add Comment
            </Button>{" "}
          </>
        )}

        {/* <textarea
          value={comment}
          onChange={(e) => {
            setComment(e.target.value), setCommentError("");
          }}
          name="comment"
          id=""
          cols="30"
          rows="10"
        ></textarea>
        <Button onClick={addComment} color={"#CD4D95"}>
          Add Comment
        </Button> */}
      </div>
    </div>
  );
};

export default Post;
