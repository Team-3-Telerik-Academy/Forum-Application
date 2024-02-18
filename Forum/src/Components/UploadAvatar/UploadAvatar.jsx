import { useRef } from "react";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import Button from "../Button/Button";
import PropTypes from "prop-types";
import { updateUserInfo } from "../../services/users.service";
import "./UploadAvatar.css";

const storage = getStorage();

const UploadAvatar = ({ user, updateInfo }) => {
  const fileInput = useRef();

  const handleUploadClick = () => {
    fileInput.current.click();
  };

  const handleFileChange = (event) => {
    if (user.avatar) {
      deleteAvatar();
    }

    const file = event.target.files[0];
    const storageRef = ref(storage, "avatars/" + user.username);

    uploadBytes(storageRef, file)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          updateUserInfo(user.username, "avatar", downloadURL);
        }).then(updateInfo);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteAvatar = () => {
    const avatarRef = ref(storage, "avatars/" + user.username);

    deleteObject(avatarRef)
      .then(() => {
        console.log("Avatar deleted successfully");
        updateUserInfo(user.username, "avatar", null);
      }).then(updateInfo)
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div id="change-info-right-side">
      <span className="info">
        <strong>Profile Picture:</strong>
        {user.avatar && (
          <>
            <Button
              id={"delete-profile-picture"}
              onClick={deleteAvatar}
              color={"#d98f40"}
            >
              Delete
            </Button>
            <img src={user.avatar} alt={user.username} />
          </>
        )}
        <input
          type="file"
          ref={fileInput}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Button
          id={user?.avatar ? "upload-profile-picture" : 'upload-button-top'}
          onClick={handleUploadClick}
          color={"#d98f40"}
        >
          Upload
        </Button>
      </span>
    </div>
  );
};

UploadAvatar.propTypes = {
  user: PropTypes.object,
  updateInfo: PropTypes.func,
};

export default UploadAvatar;
