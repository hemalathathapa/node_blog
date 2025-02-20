import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddBlog.css"; // Import the external CSS file

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // Handle Blog Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Title and Content are required!");
      return;
    }

    setLoading(true); // Show loading state

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post("http://localhost:5000/blogs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        alert("Blog added successfully!");
        navigate("/"); // ✅ Navigate immediately after success
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error adding blog:", error.response?.data || error.message);
    } finally {
      setLoading(false); // ✅ Set loading state after navigation
    }
  };

  return (
    <div className="add-blog-container">
      <h2 className="add-blog-title">Write Your Blog</h2>
      <form onSubmit={handleSubmit} className="add-blog-form">
        <input
          type="text"
          placeholder="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="add-blog-input"
        />
        <textarea
          placeholder="Content"
          required
          rows="5"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="add-blog-textarea"
        ></textarea>

        {/* Image Upload Input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="add-blog-file-input"
        />

        <button type="submit" className="add-blog-button" disabled={loading}>
          {loading ? "Submitted!" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
