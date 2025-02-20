import { useEffect, useState } from "react";
import axios from "axios";
import "./ViewBlogs.css";

const ViewBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/blogs");
        setBlogs(response.data);
  
        const initialExpanded = {};
        const likesData = {};
  
        // Fetch likes for each blog
        await Promise.all(
          response.data.map(async (blog) => {
            try {
              const likeRes = await axios.get(`http://localhost:5000/likes/${blog.id}`);
              likesData[blog.id] = likeRes.data.likes;
            } catch (error) {
              console.error(`Error fetching likes for blog ${blog.id}:`, error);
            }
          })
        );
  
        setExpanded(initialExpanded);
        setLikes(likesData); // Set likes from the database
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
  
    fetchBlogs();
  }, []);
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/blogs");
        setBlogs(response.data);

        // Initialize expanded state (all collapsed)
        const initialExpanded = {};
        response.data.forEach((_, index) => {
          initialExpanded[index] = false;
        });
        setExpanded(initialExpanded);

        // Load likes and comments from localStorage
        const storedLikes = JSON.parse(localStorage.getItem("likes")) || {};
        const storedComments = JSON.parse(localStorage.getItem("comments")) || {};
        setLikes(storedLikes);
        setComments(storedComments);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  // Toggle Read More / Read Less
  const toggleReadMore = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Handle Like
  const handleLike = (index) => {
    const updatedLikes = { ...likes, [index]: (likes[index] || 0) + 1 };
    setLikes(updatedLikes);
    localStorage.setItem("likes", JSON.stringify(updatedLikes));
  };
  

  // Handle Comment Submission
  const handleCommentSubmit = (index, event) => {
    event.preventDefault();
    const commentText = event.target.comment.value.trim();
    if (!commentText) return;

    const updatedComments = {
      ...comments,
      [index]: [...(comments[index] || []), commentText],
    };
    setComments(updatedComments);
    localStorage.setItem("comments", JSON.stringify(updatedComments));
    event.target.reset();
  };

  return (
    <div>
      {blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        blogs.map((blog, index) => (
          <div key={index} className="blog-card">
            <h3>{blog.title}</h3>

            {/* Blog Image */}
            {blog.image && (
              <img
                src={`http://localhost:5000/uploads/${blog.image}`}
                alt="Blog"
                width="200"
              />
            )}

            {/* Blog Content Preview */}
            <p>
              {expanded[index]
                ? blog.content // Show full content when expanded
                : `${blog.content.slice(0, 100)}...`} {/* Show preview if not expanded */}
            </p>

            {/* Read More / Read Less Button */}
            {blog.content.length > 100 && (
              <button onClick={() => toggleReadMore(index)} className="read-more-btn">
                {expanded[index] ? "Read Less" : "Read More"}
              </button>
            )}

            {/* Likes & Comments Section */}
            <div className="blog-actions">
              <button onClick={() => handleLike(index)} className="like-btn">
                ❤️ {likes[index] || 0}
              </button>

              <span className="comment-icon">💬 {comments[index]?.length || 0}</span>
            </div>

            {/* Comments Section */}
            <div className="comments-section">
              <h4>Comments:</h4>
              <ul>
                {comments[index]?.map((comment, i) => (
                  <li key={i}>{comment}</li>
                ))}
              </ul>
              <form onSubmit={(event) => handleCommentSubmit(index, event)}>
                <input
                  type="text"
                  name="comment"
                  placeholder="Add a comment..."
                  className="comment-input"
                />
                <button type="submit" className="comment-btn">Post</button>
              </form>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ViewBlogs;
