import "./Menu.css";
import { logout } from "../firebase";

const Menu = () => {
  return (
    <div className="menu-container">
      <div className="welcome">Welcome to chess!</div>
      <button className="menu-button" onClick={logout}>
        Logout
      </button>
      {/* <button className="menu-button">Create Room</button>
          <button className="menu-button">Join Room</button> */}
    </div>
  );
};

export default Menu;
