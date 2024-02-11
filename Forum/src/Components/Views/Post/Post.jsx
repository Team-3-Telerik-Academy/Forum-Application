import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById } from "../../../services/posts.service";
import { getUserByHandle } from "../../../services/users.service";
import "./Post.css";
import Header from "../../Header/Header";
import Button from "../../Button/Button";
import AppContext from "../../../AppContext/AppContext";

const Post = () => {
  const [post, setPost] = useState(null);
  const [postAuthor, setPostAuthor] = useState(null);
  const [comment, setComment] = useState('');
  const { id } = useParams();
  const { userData } = useContext(AppContext);

  useEffect(() => {
    getPostById(id).then(setPost);
  }, []);

  useEffect(() => {
    if (post) {
      getUserByHandle(post.author).then(setPostAuthor);
    }
  }, [post]);

  return (
    <div id="single-post-view">
      <Header magnifiedGlassColor="#d98f40" />
      <div id="single-post-title">
        <div id="title-and-buttons">
          <h1>{post?.title}</h1>
          <span id="single-post-buttons">
            <Button color={"#d98f40"}>Like</Button>
            {userData?.handle === postAuthor?.handle && (
              <>
                <Button color={"#d98f40"}>Edit</Button>
                <Button color={"#d98f40"}>Delete</Button>
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
        <div id="single-post-left-side">
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
        <div id="single-post-right-side">
          <span>Posted {post?.createdOn.toLocaleDateString()}</span>
          <p>{post?.content}</p>
          <div id="single-post-comments-content">
            <h3>Comments:</h3>
            <div id="single-post-comment">Comment 1</div>
            <div id="single-post-comment">Comment 2</div>
            <div id="single-post-comment">Comment 3</div>
          </div>
        </div>
      </div>
      <div id="single-post-create-comment">
        <textarea value={comment} onChange={setComment} name="comment" id="" cols="30" rows="10"></textarea>
        <Button color={"#d98f40"}>Add Comment</Button>
      </div>
    </div>
  );
};

export default Post;
