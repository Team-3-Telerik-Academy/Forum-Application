import "./Button.css";
import PropTypes from 'prop-types';

const Button = ({ color, children }) => {
  return (
    <button style={{ backgroundColor: color }} className="button">
      {children}
    </button>
  );
};

Button.propTypes = {
  color: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
}

export default Button;