import "./Button.css";

const Button = ({ color, children }) => {
  return (
    <button style={{ backgroundColor: color }} className="button">
      {children}
    </button>
  );
};

export default Button;
