

// client/src/components/BlogPage.js
import React, { useState, useEffect, useContext } from 'react';
import PostForm from './PostForm.js';
import ArchiveNavigation from './ArchiveNavigation';
import AuthContext from "../../Context/AuthContext.js";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import './Blog.css'; // Assuming you have a CSS file for styling
import Post from './Post.js';
import { Col, Row } from 'react-bootstrap';
import { useWebSocket } from "../../Context/WebSocketProvider";
console.log("Post Component:", Post);


const Blog = () => {
  const [userRole, setUserRole] = useState(null);
  const [postsByMonth, setPostsByMonth] = useState([]);
  const [activePosts, setActivePosts] = useState([]);
  const [activeMonth, setActiveMonth] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [archivedPosts, setArchivedPosts] = useState([]);
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMonths, setExpandedMonths] = useState([]);
  const { realTimeData, sendMessage, blogPosts, setBlogPosts } = useWebSocket();

  console.log("Blog posts:", blogPosts); // Debugging: Check if updates are reflected

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedUser = jwtDecode(token);
          if (decodedUser.exp < Date.now() / 1000) {
            localStorage.removeItem('token');
            localStorage.setItem("redirectAfterLogin", location.pathname);
            navigate('/login', { replace: true });
            return;
          }
          setUserRole(decodedUser.role);
        } catch (error) {
          console.error('Error decoding token:', error);
        }

      } else {
        setUserRole("guest");
      }
      fetchPostsByMonth();
      fetchAllPosts();
    };
    fetchInitialData();
  }, []);

  const fetchPostsByMonth = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/blogPost/by-month`);
      const data = await response.json();
      if (data.success) setPostsByMonth(data.postsByMonth);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchAllPosts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/blogPost/all`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      // if (data.success) setActivePosts(data.posts);
      if (data.success) setBlogPosts(data.posts);
      console.log("Fetched all posts:", data.posts);

    } catch (error) {
      console.error("Error fetching all posts:", error);
    }
  };

  const handleCreatePost = async (postData) => {
    // Don't serialize FormData into JSON

    console.log("FormData contents:");
    postData.forEach((value, key) => {
      console.log(key, ":", value);
    });

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/blogPost/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: postData,
      });
      const data = await response.json();

      // if (data.success) fetchPostsByMonth();
      if (data.success) {
        setBlogPosts((prev) => [data.post, ...prev]); // Add new post
        fetchAllPosts(); // Fetch all posts to update the list
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleAddComment = async (postId, content) => {
    const commentData = {
      content: content.trim(), // Trim here for consistency
    };
  
    try {
      if (!postId || !content.trim()) return;
      console.log("Sending comment request for postId:", postId); // ✅ Debugging
  
      const headers = {
        'Content-Type': 'application/json' // Add this header
      };
      
      const token = localStorage.getItem("token");
      if (token) headers["Authorization"] = `Bearer ${token}`;
  
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/blogPost/comment/${postId}`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(commentData), // Stringify here
      });
          const data = await response.json();
      if (data.success) {
        setBlogPosts((prev) =>
          prev.map((post) =>
            post._id === postId ? { ...post, comments: [...post.comments, data.comment] } : post
          )
        );
      }
  
      // ... rest of your code
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const headers = {};
      const token = localStorage.getItem("token");

      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/blogPost/like/${postId}`, {
        method: "POST",
        headers,
        credentials: "include",  // Ensure cookies are sent
      });

      const data = await response.json();

      if (data.success) {
        setBlogPosts((prev) =>
          prev.map((post) =>
            post._id === postId ? { ...post, likes: data.post.likes } : post
          )
        );
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };




  const handleToggleMonth = (month) => {
    setExpandedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  };


  return (
    <div className="blog-container">
      <h1 className='text-center p-2 b-head'>Discussion Room</h1>
      <div className='border border-2 border-dark rounded-3 bg-primary-subtle mx-2'>
        <>
          <h2 className='text-center'>Recent Posts</h2>

          <Post
            blogPost={blogPosts}
            onAddComment={handleAddComment}
            onLikePost={handleLikePost}
          />

        </>


        <Row className='p-4'>
          <Col className='border border-2 border-dark rounded-3 bg-dark-subtle p-4 b-arch' sm>
            <ArchiveNavigation
              months={postsByMonth}
              expandedMonths={expandedMonths}
              onToggleMonth={handleToggleMonth}
            />
          </Col>
        </Row>

      </div>

      <div className=''>
        {['admin', 'moderator'].includes(userRole) && <PostForm onCreatePost={handleCreatePost} />}</div>




      <div className='' style={{ marginBottom: "" }}>
        <p style={{ margin: "50px" }}>next</p>
      </div>     


    </div>
  );
};

export default Blog;
