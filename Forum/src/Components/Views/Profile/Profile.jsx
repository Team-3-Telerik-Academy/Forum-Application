import "./Profile.css";
import { useEffect, useState } from "react";
import { getUserData, updateUserInfo } from "../../../services/users.service";
import Button from "../../Button/Button";
import { getPostsByAuthor } from "../../../services/posts.service";
import PostsTemplate from "../../PostsTemplate/PostsTemplate";
import {
  handleDeletePost,
  handleDislikePost,
  handleLikePost,
} from "../../../helpers/like-dislike-delete-functions";
import Sort from "../../Sort/Sort";
import Header from "../../Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import {
  searchPostBy,
  setValue,
  sortPosts,
} from "../../../helpers/filter-sort-helpers";
import UploadAvatar from "../../UploadAvatar/UploadAvatar";

const Profile = () => {
  const navigate = useNavigate();
  const { uid } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState(null);
  const [changeView, setChangeView] = useState(1);
  const [postsChange, setPostsChange] = useState(false);
  const [selected, setSelected] = useState("");
  const [selectedValue, setSelectedValue] = useState("title");
  const [inputValue, setInputValue] = useState("");

  const [profileInfo, setProfileInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    number: "",
  });

  const [editProfile, setEditProfile] = useState({
    firstName: false,
    lastName: false,
    email: false,
    number: false,
    avatar: false,
  });

  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    email: "",
    number: "",
  });

  useEffect(() => {
    getUserData(uid).then((result) => {
      if (!result.exists()) {
        return navigate("*");
      }

      setUser(result.val()[Object.keys(result.val())[0]]);
    });
  }, [postsChange, editProfile]);

  useEffect(() => {
    if (user) {
      getPostsByAuthor(user?.username).then((result) => setPosts(result));
    }
  }, [postsChange, user]);

  useEffect(() => {
    searchPostBy(inputValue, selectedValue, setFilteredPosts, posts);
  }, [inputValue, posts]);

  useEffect(() => {
    if (user) {
      setProfileInfo({
        ...profileInfo,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        number: user.number || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (selected && sortPosts(selected)) {
      if (inputValue) {
        setFilteredPosts([...filteredPosts].sort(sortPosts(selected)));
      } else {
        setPosts([...posts].sort(sortPosts(selected)));
      }
    }
  }, [selected]);

  const handleFirstNameChange = () => {
    if (profileInfo.firstName.length < 4 || profileInfo.firstName.length > 32) {
      setError({
        ...error,
        firstName: "First Name should be between 4 and 32 characters long!",
      });
      return;
    }

    updateUserInfo(user.username, "firstName", profileInfo.firstName).then(() =>
      setEditProfile({ ...editProfile, firstName: false })
    );
  };

  const handleLastNameChange = () => {
    if (profileInfo.lastName.length < 4 || profileInfo.lastName.length > 32) {
      setError({
        ...error,
        lastName: "Last Name should be between 4 and 32 characters long!",
      });
      return;
    }

    updateUserInfo(user.username, "lastName", profileInfo.lastName).then(() =>
      setEditProfile({ ...editProfile, lastName: false })
    );
  };

  const handleEmailChange = () => {
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const isValid = isValidEmail(profileInfo.email);

    if (!isValid) {
      setError({ ...error, email: "Email is not valid!" });
      return;
    }

    updateUserInfo(user.username, "email", profileInfo.email).then(() =>
      setEditProfile({ ...editProfile, email: false })
    );
  };

  const handlePhoneChange = () => {
    if (!profileInfo.number) {
      setError({ ...error, number: "Phone number cannot be empty" });
      return;
    }

    if (!/^\d+$/.test(profileInfo.number)) {
      setError({ ...error, number: "Phone number can only contain digits" });
      return;
    }

    if (profileInfo.number.length !== 10) {
      setError({ ...error, number: "Phone number must be 10 digits long" });
      return;
    }

    updateUserInfo(user.username, "number", profileInfo.number).then(() => {
      user.number = profileInfo.number;
      setEditProfile({ ...editProfile, number: false });
    });
  };

  const deleteNumber = () => {
    setEditProfile({ ...editProfile, number: true });
    updateUserInfo(user.username, "number", null).then(() => {
      setProfileInfo({ ...profileInfo, number: "" });
      setEditProfile({ ...editProfile, number: false });
    });
  };

  return (
    <div id="user-profile">
      <Header magnifiedGlassColor="#d98f40" inputColor={"#d98f40"} />
      <div id="profile-header">
        <div id="username-and-avatar">
          {user?.avatar && (
            <img
              id="little-avatar-display"
              src={user?.avatar}
              alt={user?.username}
            />
          )}

          <h1>{user?.username}</h1>
        </div>
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
              <Sort
                selected={selected}
                handleChange={setValue(setSelected)}
                selectedValue={selectedValue}
                setSelectedValue={setValue(setSelectedValue)}
                inputValue={inputValue}
                handleInputValue={setValue(setInputValue)}
              />
              {(inputValue ? filteredPosts : posts)?.map((post) => (
                <PostsTemplate
                  key={post?.id}
                  post={post}
                  likePost={() =>
                    handleLikePost(post.id, user, setPostsChange, postsChange)
                  }
                  dislikePost={() =>
                    handleDislikePost(
                      post.id,
                      user,
                      setPostsChange,
                      postsChange
                    )
                  }
                  deletePost={() =>
                    handleDeletePost(post.id, user, setPostsChange, postsChange)
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
                    <strong>Username:</strong> <br /> {user?.username}
                  </p>
                  <hr />
                  <p className="info">
                    {error.firstName && (
                      <span className="error">{error.firstName}</span>
                    )}
                    <strong>First Name:</strong> <br />
                    {editProfile.firstName ? (
                      <>
                        <input
                          type="text"
                          value={profileInfo.firstName}
                          onChange={(e) => {
                            setProfileInfo({
                              ...profileInfo,
                              firstName: e.target.value,
                            });
                            setError({ ...error, firstName: "" });
                          }}
                          name="firstName"
                          id="firstName"
                        />
                        <Button
                          onClick={handleFirstNameChange}
                          color={"#d98f40"}
                        >
                          Done
                        </Button>
                      </>
                    ) : (
                      <>
                        {user?.firstName}
                        <Button
                          onClick={() =>
                            setEditProfile({ ...editProfile, firstName: true })
                          }
                          color={"#d98f40"}
                        >
                          Edit
                        </Button>
                      </>
                    )}
                  </p>
                  <hr />
                  <p className="info">
                    {error.lastName && (
                      <span className="error">{error.lastName}</span>
                    )}
                    <strong>Last Name:</strong> <br />
                    {editProfile.lastName ? (
                      <>
                        <input
                          type="text"
                          value={profileInfo.lastName}
                          onChange={(e) => {
                            setProfileInfo({
                              ...profileInfo,
                              lastName: e.target.value,
                            });
                            setError({ ...error, lastName: "" });
                          }}
                          name="secondName"
                          id="secondName"
                        />
                        <Button
                          onClick={handleLastNameChange}
                          color={"#d98f40"}
                        >
                          Done
                        </Button>
                      </>
                    ) : (
                      <>
                        {user?.lastName}
                        <Button
                          onClick={() =>
                            setEditProfile({ ...editProfile, lastName: true })
                          }
                          color={"#d98f40"}
                        >
                          Edit
                        </Button>
                      </>
                    )}
                  </p>
                  <hr />
                  <p className="info">
                    {error.email && (
                      <span className="error">{error.email}</span>
                    )}
                    <strong>Email Address:</strong> <br />
                    {editProfile.email ? (
                      <>
                        <input
                          type="text"
                          value={profileInfo.email}
                          onChange={(e) => {
                            setProfileInfo({
                              ...profileInfo,
                              email: e.target.value,
                            });
                            setError({ ...error, email: "" });
                          }}
                          name="email"
                          id="email"
                        />
                        <Button onClick={handleEmailChange} color={"#d98f40"}>
                          Done
                        </Button>
                      </>
                    ) : (
                      <>
                        {user?.email}
                        <Button
                          onClick={() =>
                            setEditProfile({ ...editProfile, email: true })
                          }
                          color={"#d98f40"}
                        >
                          Edit
                        </Button>
                      </>
                    )}
                  </p>
                  <hr />
                  {user?.admin && (
                    <p className="info">
                      {error.number && (
                        <span className="error">{error.number}</span>
                      )}
                      <strong>Phone Number:</strong> <br />
                      {editProfile.number ? (
                        <>
                          <input
                            type="text"
                            value={profileInfo.number}
                            onChange={(e) => {
                              setProfileInfo({
                                ...profileInfo,
                                number: e.target.value,
                              });
                              setError({ ...error, number: "" });
                            }}
                            name="phone"
                            id="phone"
                          />
                          <Button onClick={handlePhoneChange} color={"#d98f40"}>
                            Done
                          </Button>
                        </>
                      ) : (
                        <>
                          {user?.number}
                          <Button
                            onClick={() =>
                              setEditProfile({ ...editProfile, number: true })
                            }
                            color={"#d98f40"}
                          >
                            Edit
                          </Button>
                          {user.number && (
                            <Button
                              id={"delete-number-button"}
                              onClick={deleteNumber}
                              color={"#d98f40"}
                            >
                              Delete
                            </Button>
                          )}
                        </>
                      )}
                    </p>
                  )}
                </div>
                <UploadAvatar
                  updateInfo={() =>
                    setEditProfile((prev) => ({
                      ...prev,
                      avatar: !prev.avatar,
                    }))
                  }
                  user={user}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
