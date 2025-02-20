import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="navbar-title">The Blog World</h1>
      <div className="navbar-links">
        <Link to="/add" className="navbar-button">+ Add Blog</Link>
        <Link to="/blogs" className="navbar-button">View Existing Blogs</Link>
      </div>
    </nav>
  );
};

export default Navbar;
