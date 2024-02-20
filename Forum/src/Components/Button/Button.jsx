import "./Button.css";
import PropTypes from 'prop-types';

const Button = ({ children, onClick, id, width }) => {
  return (
    <button onClick={onClick} style={{width: width }} id={id} className='button'>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  id: PropTypes.string,
  width: PropTypes.string,
}

export default Button;