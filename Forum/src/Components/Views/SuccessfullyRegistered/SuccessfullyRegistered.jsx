import { useNavigate } from "react-router-dom";
import "./SuccessfullyRegistered.css";
import { useEffect } from "react";

const SuccessfullyRegistered = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/sign-in');
    }, 2000);
  }, [])

  return (
    <div id="background">
      <div id="success">
        <div id="success-top">
          <img src="/src/Images/success-check-mark.svg" alt="" />
          <span>Success</span>
        </div>
        <div id="success-bottom">
          <p>Your account has been successfully created! <br/> You will be redirected to the Sign In page!</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessfullyRegistered;
