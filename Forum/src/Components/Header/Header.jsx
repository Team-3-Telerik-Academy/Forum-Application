import Button from "../Button.jsx/Button";
import "./Header.css";

const Header = () => {
  return (
    <div className="header-content">
      <span>GAMING FORUM 2024</span>
      <div className="button-content">
        <Button color={"#CD4D95"}>Sign in</Button>
        <Button color={"#1BB76E"}>Sign up</Button>
      </div>
    </div>
  );
};

export default Header;
