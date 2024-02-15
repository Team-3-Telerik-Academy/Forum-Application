import { useParams } from "react-router-dom";
import "./Profile.css";
import { useContext, useEffect, useState } from "react";
import { getUserData } from "../../../services/users.service";
import Button from "../../Button/Button";
import { getPostsByAuthor } from "../../../services/posts.service";
import PostsTemplate from "../../PostsTemplate/PostsTemplate";
import {
  handleDeletePost,
  handleDislikePost,
  handleLikePost,
} from "../../../helpers/like-dislike-delete-functions";
import AppContext from "../../../AppContext/AppContext";
import Sort from "../../Sort/Sort";
import Header from "../../Header/Header";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [comments, setComments] = useState(null);
  const [changeView, setChangeView] = useState(1);
  const [postsChange, setPostsChange] = useState(false);
  const [commentsChange, setCommentsChange] = useState(false);
  const [selected, setSelected] = useState("");
  const { userData } = useContext(AppContext);

  const [firstName, setFirstName] = useState(userData?.firstName);
  const [firstNameEdit, setFirstNameEdit] = useState(false);
  const [secondName, setSecondName] = useState(userData?.secondName);
  const [secondNameEdit, setSecondNameEdit] = useState(false);
  const [email, setEmail] = useState(userData?.email);
  const [emailEdit, setEmailEdit] = useState(false);
  const [phone, setPhone] = useState(userData?.number || null);
  const [phoneEdit, setPhoneEdit] = useState(false);

  const { uid } = useParams();

  useEffect(() => {
    getUserData(uid).then((result) =>
      setUser(result.val()[Object.keys(result.val())[0]])
    );
  }, [uid]);

  useEffect(() => {
    if (user) {
      getPostsByAuthor(user?.username).then((result) => setPosts(result));
    }
  }, [user, postsChange, commentsChange]);

  useEffect(() => {
    const sortPosts = () => {
      switch (selected) {
        case "title":
          return (a, b) => a.title.localeCompare(b.title);
        case "title-ZA":
          return (a, b) => b.title.localeCompare(a.title);
        case "oldest":
          return (a, b) => a.createdOn - b.createdOn;
        case "newest":
          return (a, b) => b.createdOn - a.createdOn;
        default:
          return null;
      }
    };

    if (selected && sortPosts()) {
      setPosts([...posts].sort(sortPosts()));
    }
  }, [selected]);

  const handleChange = (e) => {
    setSelected(e.target.value);
  };

  const handleFirstNameChange = () => {};

  return (
    <div id="user-profile">
      <Header magnifiedGlassColor="#d98f40" inputColor={"#d98f40"} />
      <div id="profile-header">
        <h1>{user?.username}</h1>
        <div id="header-profile-info">
          <p className="info">
            Created posts <br />{" "}
            {user?.posts ? Object.keys(user.posts).length : 0}
          </p>
          <div className="vertical-line"></div>
          <p className="info">
            Liked posts <br /> {user?.likedPosts}
          </p>
          <div className="vertical-line"></div>
          <p className="info">
            Comments <br /> {user?.comments}
          </p>
          <div className="vertical-line"></div>
          <p className="info">
            Joined <br />{" "}
            {new Date(user?.createdOn).toLocaleString("bg-BG", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
      <div id="profile-main-content">
        <div id="profile-left-side">
          <Button
            id={changeView === 1 ? "active" : ""}
            onClick={() => setChangeView(1)}
          >
            My posts
          </Button>
          <Button
            id={changeView === 2 ? "active" : ""}
            onClick={() => setChangeView(2)}
          >
            Profile Info
          </Button>
        </div>
        <div id="profile-right-side">
          {changeView === 1 && (
            <div className="profile-posts-main">
              <Sort selected={selected} handleChange={handleChange} />
              {posts?.map((post) => (
                <PostsTemplate
                  key={post?.id}
                  post={post}
                  likePost={() =>
                    handleLikePost(
                      post.id,
                      userData,
                      setPostsChange,
                      postsChange
                    )
                  }
                  dislikePost={() =>
                    handleDislikePost(
                      post.id,
                      userData,
                      setPostsChange,
                      postsChange
                    )
                  }
                  deletePost={() =>
                    handleDeletePost(
                      post.id,
                      userData,
                      setPostsChange,
                      postsChange
                    )
                  }
                />
              ))}
              <div className="post-footer"></div>
            </div>
          )}
          {changeView === 2 && (
            <>
              <div id="profile-change-info">
                <div id="change-info-left-side">
                  <p className="info">
                    <strong>Username:</strong> <br /> {userData?.username}
                  </p>
                  <hr />
                  {firstNameEdit ? (
                    <input
                      type="text"
                      value={firstName}
                      onChange={setFirstName}
                      name="firstName"
                      id="firstName"
                    />
                  ) : (
                    <p className="info">
                      <strong>First Name:</strong> <br /> {userData?.firstName}
                      <Button
                        onClick={() => setFirstNameEdit(true)}
                        color={"#d98f40"}
                      >
                        Edit
                      </Button>
                    </p>
                  )}
                  <hr />
                  {secondNameEdit ? (
                    <input
                      type="text"
                      value={secondName}
                      onChange={setSecondName}
                      name="secondName"
                      id="secondName"
                    />
                  ) : (
                    <p className="info">
                      <strong>Last Name:</strong> <br /> {userData?.lastName}
                      <Button
                        onClick={() => setSecondNameEdit(true)}
                        color={"#d98f40"}
                      >
                        Edit
                      </Button>
                    </p>
                  )}
                  <hr />
                  {emailEdit ? (
                    <input
                      type="text"
                      value={email}
                      onChange={setEmail}
                      name="email"
                      id="email"
                    />
                  ) : (
                    <p className="info">
                      <strong>Email Address:</strong> <br /> {userData?.email}
                      <Button
                        onClick={() => setEmailEdit(true)}
                        color={"#d98f40"}
                      >
                        Edit
                      </Button>
                    </p>
                  )}
                  <hr />
                  {userData?.admin && <p className="info">
                      <strong>Phone Number:</strong> <br /> {userData?.number || ''}
                      <Button
                        onClick={() => setPhoneEdit(true)}
                        color={"#d98f40"}
                      >
                        Edit
                      </Button>
                    </p>}
                </div>
                <div id="change-info-right-side">
                  <span className="info">
                    <strong>Upload Profile Picture</strong>
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
