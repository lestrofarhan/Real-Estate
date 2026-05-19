import React, { useContext, useState } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  console.log("Navbar number: ", number)

  const handleNavigateClick = () => setOpen(false);

  return (
    <nav>
      <div className="left">
        <Link to="/" className="logo" onClick={handleNavigateClick}>
          <img src="/logo.png" alt="" />
          <span>lestroEstate</span>
        </Link>
        <Link to="/" onClick={handleNavigateClick}>
          Home
        </Link>
        <Link to="/about" onClick={handleNavigateClick}>
          About
        </Link>
        <Link to="/contact" onClick={handleNavigateClick}>
          Contact
        </Link>
        <Link to="/agents" onClick={handleNavigateClick}>
          Agents
        </Link>
      </div>
      <div className="right">
        {currentUser ? (
          <div className="user">
            <img src={currentUser?.avatar || "/noavatar.jpg"} alt="" />
            <span>{currentUser?.username}</span>
            <Link to="/profile" className="profile">
              {(number || 0) > 0 && (
                <div className="notification">{number || 0}</div>
              )}
              <span>Profile</span>
            </Link>
          </div>
        ) : (
          <>
            <Link
              onClick={() => {
                console.log("btn is clicked");
              }}
              to="/login"
            >
              Sign in
            </Link>
            <Link
              onClick={() => {
                console.log("btn is clicked");
              }}
              to="/register"
              className="register"
            >
              Sign up
            </Link>
          </>
        )}
        <div className="menuIcon">
          <img
            src="/menu.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
        <div className={open ? "menu active" : "menu"}>
          <Link to="/" onClick={handleNavigateClick}>
            Home
          </Link>
          <Link to="/about" onClick={handleNavigateClick}>
            About
          </Link>
          <Link to="/contact" onClick={handleNavigateClick}>
            Contact
          </Link>
          <Link to="/agents" onClick={handleNavigateClick}>
            Agents
          </Link>
          <Link to="/login" onClick={handleNavigateClick}>
            Sign in
          </Link>
          <Link to="/register" onClick={handleNavigateClick}>
            Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
