import { useNavigate } from "react-router-dom";
import "./Successfully.css";
import { useEffect } from "react";
import PropTypes from "prop-types";

const Successfully = ({ page, color, children}) => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate(`/${page}`);
    }, 2000);
  }, [])

  return (
    <div id="background">
      <div id="success">
        <div style={{ backgroundColor: color }} id="success-top">
          <img src="/src/Images/success-check-mark.svg" alt="" />
          <span>Success</span>
        </div>
        <div id="success-bottom">
          <p>
            {children}
          </p>
        </div>
      </div>
    </div>
  );
};

Successfully.propTypes = {
  page: PropTypes.string,
  color: PropTypes.string,
  children: PropTypes.array,
};

export default Successfully;
