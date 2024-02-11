import "./Button.css";
import PropTypes from 'prop-types';

const Button = ({ color, children, onClick, id }) => {
  return (
    <button onClick={onClick} style={{ backgroundColor: color }} id={id} className='button'>
      {children}
    </button>
  );
};

Button.propTypes = {
  color: PropTypes.string,
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  id: PropTypes.string,
}

export default Button;