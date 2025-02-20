import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./navbar";
import Home from "./Home";
import AddBlog from "./AddBlog";
import ViewBlogs from "./ViewBlogs"; // Import BlogList

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddBlog />} />
        <Route path="/blogs" element={<ViewBlogs />} /> {/* New Route for Blogs */}
      </Routes>
    </Router>
  );
};

export default App;
