import "./Header.css";
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <div className="header-content">
      <div id="logo">
      <img src="/src/Images/logo.png" alt="logo" />
      {/* <span>GAMING FORUM 2024</span> */}
      </div>
      <div className="button-content">
        {/* <Button color={"#CD4D95"}>Sign in</Button> */}
        {/* <Button color={"#89C623"}>Sign up</Button> */}
        <NavLink style={{ backgroundColor: "#CD4D95" }} to={'/sign-in'}>Sign in</NavLink>
        <NavLink style={{ backgroundColor: "#89C623" }} to={'/sign-up'}>Sign up</NavLink>
      </div>
    </div>
  );
};

export default Header;
