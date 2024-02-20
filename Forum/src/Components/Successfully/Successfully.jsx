import { useNavigate } from "react-router-dom";
import "./Successfully.css";
import { useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Renders a success message with a specified color and navigates to a specified page after a delay.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.page - The page to navigate to after the delay.
 * @param {string} props.color - The background color of the success message.
 * @param {ReactNode} props.children - The content to be displayed inside the success message.
 * @returns {JSX.Element} The rendered Successfully component.
 */
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
