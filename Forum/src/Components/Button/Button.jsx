import "./Button.css";
import PropTypes from 'prop-types';

/**
 * Button component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The content of the button.
 * @param {function} props.onClick - The function to be called when the button is clicked.
 * @param {string} props.id - The id of the button.
 * @param {string} props.width - The width of the button.
 * @returns {JSX.Element} The rendered Button component.
 */
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