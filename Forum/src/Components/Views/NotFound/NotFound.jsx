import { NavLink } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div id='not-found-background'>
      <div className="mars"></div>
      <img
        src="https://assets.codepen.io/1538474/404.svg"
        className="logo-404"
      />
      <img
        src="https://assets.codepen.io/1538474/meteor.svg"
        className="meteor"
      />
      <p className="not-found-title">Oh no!</p>
      <p className="subtitle">
        You’re either misspelling the URL <br /> or requesting a page that&apos;s no
        longer here.
      </p>
      <div align="center">
        <NavLink className="btn-back" to={'./home'}>
          Back to home
        </NavLink>
      </div>
    </div>
  );
};

export default NotFound;
