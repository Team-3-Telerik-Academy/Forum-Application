import "./Button.css";
import PropTypes from 'prop-types';

const Button = ({ color, children, onClick }) => {
  return (
    <button onClick={onClick} style={{ backgroundColor: color }} className='button'>
      {children}
    </button>
  );
};

Button.propTypes = {
  color: PropTypes.string,
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
}

export default Button;