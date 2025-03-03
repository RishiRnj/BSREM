import React, { useEffect, useState, useContext, useRef, Suspense, lazy } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import NoticeBoard from '../../Components/Notice/NoticeBorad';
import AuthContext from "../../Context/AuthContext";
import ForumStat from "./ForumStatistics";
import { Modal, Button, Form, Spinner, ListGroup, Card, Image, Badge, ToastContainer } from "react-bootstrap";
import PostCreator from './PostCreator';
import Fab from '@mui/material/Fab';
import { FaPlus, FaThumbsUp, FaCommentAlt, FaShare, FaRegBookmark, FaBookmark, FaRegThumbsUp, } from "react-icons/fa";
import { BsRepeat, BsFillSendFill, BsExclamationDiamondFill, BsExclamationTriangleFill, BsExclamationTriangle } from "react-icons/bs";
import { useWebSocket } from "../../Context/WebSocketProvider";
import ShareModal from './ShareModal';
import { Player, BigPlayButton, LoadingSpinner, ControlBar, ForwardControl, PosterImage } from 'video-react';
import ReactPlayer from 'react-player';


const Posts = ({ filterByUser = true }) => {

    const { user } = useContext(AuthContext);
  const currentUser = user;
  const isAuthenticated = !!user;
  const userId = user?.id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notices, setNotices] = useState([]);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [showModal, setShowModal] = useState();
  //const [posts, setPosts] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false); // State to control the modal
  const [commentVisibility, setCommentVisibility] = useState({}); // Track comment visibility for each post
  const commentAreaRef = useRef({}); // Track refs for each comment area
  const [profileCompleted, setProfileCompleted] = useState(false);
  const location = useLocation();
  const [fullName, setFullName] = useState("");
  const { realTimeData, sendMessage, posts, setPosts } = useWebSocket();
  const [showShareModal, setShowShareModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const playerRefs = useRef({}); // Store refs for each video
  const [vidUrl, setVidUrl] = useState([]);



   //reload for feed
    const reloadFeed = async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated.");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts`, {
        method: 'GET',
        credentials: 'include', // Send cookies
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await response.json();
      setPosts(
        data.map((post) => ({
          ...post,
          user: {
            ...post.user,
            followersCount: post.user.followers?.length || 0,
            isFollowed: post.user.followers?.includes(currentUser?.id) || false,
          },
        }))
      );
      console.log("relod");
    };
  
    // Toggle comment visibility for a specific post
    const toggleCommentArea = (postId) => {
      setCommentVisibility((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));
    };
  
  
  
    const fetchPosts = async (filterByUser = true) => {
        setLoading(true);
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("Missing user authentication details.");
      
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts`, {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch posts");
          }
      
          const data = await response.json();
          if (!Array.isArray(data)) throw new Error("Unexpected data format received.");
      
          // Filter posts by current user's ID if required
          const filteredPosts = filterByUser
            ? data.filter((post) => post.user?._id === currentUser?.id)
            : data;
      
          setPosts(
            filteredPosts.map((post) => ({
              ...post,
              user: {
                ...post.user,
                followersCount: post.user.followers?.length || 0,
                isFollowed: post.user.followers?.includes(currentUser?.id) || false,
              },
            }))
          );
      
          setVidUrl(filteredPosts.map((post) => post.videoUrl));
          setShowPostModal(false);
        } catch (error) {
          console.error("Error fetching posts:", error.message);
        } finally {
          setLoading(false);
        }
      };
       
  
    
  
    useEffect(() => {
        fetchPosts(filterByUser);
      }, [filterByUser]);
      
  
   
  
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        Object.keys(commentAreaRef.current).forEach((postId) => {
          if (
            commentVisibility[postId] && // If comment area is visible
            commentAreaRef.current[postId] &&
            !commentAreaRef.current[postId].contains(event.target) // Click outside
          ) {
            setCommentVisibility((prev) => ({
              ...prev,
              [postId]: false,
            }));
          }
        });
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [commentVisibility]); // Empty dependency array to run only once
  
  
  
  
    //Show post Modal
    const handleNewPost = (newPost) => {
      reloadFeed();
      sendMessage("newPost", newPost);
      setShowPostModal(false) // Close the modal after posting
    };
  
  
  
    const CheckUserProfileBeforeProcced = async () => {
      try {
        setLoading(true); // Optional loading state for better UX
  
        // Step 1: Check if the user's profile is updated
        const isProfileUpdated = await checkUserProfile(); // Ensure `checkUserProfile` is async
  
        if (!isProfileUpdated) {
          const userResponse = window.confirm(
            "Your profile is not updated. Update your profile to post. Press OK to update your profile or Cancel to stay here."
          );
  
          if (userResponse) {
            navigateToProfileUpdate();
          }
          return; // Stop further execution if the profile isn't updated
        }
  
        // Step 2: Check if the user has followed at least 5 users
        const hasFollowedMinimumUsers = await checkUserFollowStatus(); // Ensure `checkUserFollowStatus` is async
  
        if (!hasFollowedMinimumUsers) {
          navigate('/user/Users-Suggestions-for/follow', {
            state: { from: window.location.pathname },
          });
          // Redirect to a separate page for user follow check
          return; // Stop further execution until the user meets the criteria
        }
  
        // Step 3: Proceed to open the post modal
        setShowPostModal(true);
      } catch (error) {
        console.error("Error checking user profile or follow status:", error);
      } finally {
        setLoading(false); // Reset loading state
      }
    };
  
    //check follow status
    const checkUserFollowStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found.");
  
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/follow/status`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const { followedCount } = await response.json(); // Destructure followedCount
          console.log("Followed Users Count:", followedCount);
          return followedCount >= 4; // Check if the count is >= 4 // Assume `followedCount` is the number of users the current user has followed
        } else {
          throw new Error("Failed to fetch follow status.");
        }
      } catch (error) {
        console.error("Error in checkUserFollowStatus:", error);
        return false; // Default to false if there's an error
      }
    };
  
  
    //navigate for Update profile
    const navigateToProfileUpdate = () => {
      // Use React Router for navigation
      if (!userId) throw new Error("Missing user authentication details.");
      navigate('/user/${userId}/update-profile', {
        state: { from: window.location.pathname },
      });
  
    };
  
  
    //check user Profile
    const checkUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found.");
  
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
          method: "GET",
          credentials: "include", // Necessary for cookies/session handling
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const userData = await response.json();
  
          return userData.isProfileCompleted; // Return the profile status
        } else {
          throw new Error("Failed to fetch user profile.");
        }
      } catch (error) {
        console.error("Error in checkUserProfile:", error);
        navigate("/forum"); // Redirect to a fallback route if needed
        return false; // Default to false if there's an error
      }
    };
  
  
  
    // handle Follow / Unfollow
    const handleFollow = async (userIdToFollow) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated.");
  
        // Step 1: Check if the user is already following the target user
        const followStatusResponse = await fetch(`${process.env.REACT_APP_API_URL}/user/${userIdToFollow}/isFollowing`, {
          method: 'GET',
          credentials: 'include', // Send cookies
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!followStatusResponse.ok) {
          throw new Error('Failed to fetch follow status.');
        }
  
        const { isFollowing } = await followStatusResponse.json();
  
        // Step 2: Alert if already following
        reloadFeed();
        if (isFollowing) {
          const confirmation = window.confirm(
            'You are already following this user. Do you want to unfollow them?'
          );
          if (!confirmation) return; // If the user cancels, exit the function
        }
  
        // Step 3: Proceed with follow/unfollow logic
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${userIdToFollow}/follow`, {
          method: 'POST',
          credentials: 'include', // Send cookies
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to follow/unfollow the user.');
        }
  
        const data = await response.json();
        console.log("Follow/unfollow successful", data);
  
        // Update `isFollowed` for the target user and reload the feed
        reloadFeed();
  
        // Optional: Send a WebSocket message to notify about the follow status change
        sendMessage("followStatus", data);
  
      } catch (error) {
        console.error('Error following/unfollowing user:', error);
      }
    };
  
  
    // post like 
    const handleLike = async (postId) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated.");
  
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/like`, {
          method: 'POST',
          credentials: 'include', // Send cookies
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to like the post.');
        }
  
        const updatedPost = await response.json();
        reloadFeed();
        // Update the like count in the local state
        sendMessage("likePost", updatedPost);
        // setPosts((prevPosts) =>
        //   prevPosts.map((post) =>
        //     post._id === postId ? { ...post, likes: updatedPost.likes } : post
        //   )
        // );
      } catch (error) {
        console.error('Error liking post:', error);
      }
    };
  
  
    //comment on a post
    const handleCommentSubmit = async (postId, commentText) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated.");
  
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/comment`, {
          method: "POST",
          credentials: 'include', // Send cookies
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: commentText }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to add comment.");
        }
  
        const updatedPost = await response.json();
  
        // Update the comments in the state
        reloadFeed();
        sendMessage("newComment", updatedPost);
        // setPosts((prevPosts) =>
        //   prevPosts.map((post) =>
        //     post._id === postId ? { ...post, comments: updatedPost.comments } : post
        //   )
        // );
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    };
  
  
    //Repost a post
    const handleRepost = async (postId) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated.");
  
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/repost`, {
          credentials: "include", // Necessary for cookies/session handling 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await response.json();
  
        console.log("Repost API Response:", data); // Log the entire API response
        if (!response.ok) throw new Error(data.message || "Failed to repost.");
  
        const updatedPost = {
          ...data,
          user: data.user, // Fallback to empty object if user is undefined
        };
        reloadFeed();
        sendMessage("repost", updatedPost);
  
  
      } catch (error) {
        console.error("Error reposting:", error.message);
      }
    };
  
  
    //like on comment
    const handleLikeComment = async (postId, commentId) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated.");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/posts/${postId}/comment/${commentId}/like`,
          {
            method: 'POST',
            credentials: 'include', // Send cookies
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const data = await response.json();
        if (response.ok) {
          // Update the likes count in your component state
          reloadFeed();
          sendMessage("commentLike", data)
  
        }
      } catch (error) {
        console.error('Error liking comment:', error);
      }
    };
  
  
    //Report a Post
    const handleReportPost = async (postId) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated.");
  
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/posts/${postId}/report`,
          {
            method: "POST",
            credentials: "include", // Necessary for cookies/session handling        
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to report post.");
  
        reloadFeed();
        // Update local state
        setIsReported(data.isReported);
  
        sendMessage("reportUpdate", data);
  
        console.log("Report action successful:", data);
      } catch (error) {
        console.error("Error reporting post:", error.message);
      }
    };
  
  
    //Report A comment
    const handleReportComment = async (postId, commentId) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated.");
  
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/posts/${postId}/comments/${commentId}/report`,
          {
            method: "POST",
            credentials: "include", // Necessary for cookies/session handling
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to report comment.");
  
        // Update local state
        setIsReported(data.isReported);
  
        // // Emit WebSocket event for real-time updates
        // socket.emit("commentReportUpdate", {
        //   postId,
        //   commentId,
        //   updatedReportCount: data.reportCount,
        //   isReported: data.isReported,
        // });
  
        sendMessage("commentReportUpdate", data)
        console.log("Comment reported successfully:", data);
      } catch (error) {
        console.error("Error reporting comment:", error.message);
      }
    };
  
  
    const handleBookmark = async (postId) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated.");
  
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/posts/${postId}/bookmark`,
          {
            method: "POST",
            credentials: "include", // Necessary for cookies/session handling        
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to bookmark post.");
        reloadFeed();
        setIsBookmarked(data.isBookmarked);
  
        sendMessage("bookmarkUpdate", data)
  
        console.log("Bookmark action successful:", data);
      } catch (error) {
        console.error("Error bookmarking post:", error.message);
      }
    };
  
  
    //auto play / pause when video on screened
    // useEffect(() => {
    //   const observers = [];
  
    //   posts.forEach((post, index) => {
    //     const playerElement = playerRefs.current[index]?.getInternalPlayer();
  
    //     if (!playerElement) return;
  
    //     const observer = new IntersectionObserver(
    //       (entries) => {
    //         entries.forEach((entry) => {
    //           if (entry.isIntersecting) {
    //             playerElement.play();
    //           } else {
    //             playerElement.pause();
    //           }
    //         });
    //       },
    //       {
    //         threshold: 0.5, // Video must be at least 50% visible
    //       }
    //     );
  
    //     // Observe the ReactPlayer DOM element
    //     observer.observe(playerElement);
    //     observers.push(observer);
    //   });
  
    //   // Cleanup observers on unmount
    //   return () => {
    //     observers.forEach((observer) => observer.disconnect());
    //   };
    // }, [posts]);



    useEffect(() => {
      const observers = [];

      // Ensure videos only play after a user interaction
      const handleUserInteraction = () => {
          document.removeEventListener("click", handleUserInteraction);
          document.removeEventListener("touchstart", handleUserInteraction);

          // Set up observers after user interaction
          posts.forEach((post, index) => {
              const playerElement = playerRefs.current[index]?.getInternalPlayer();
              if (!playerElement) return;

              const observer = new IntersectionObserver(
                  (entries) => {
                      entries.forEach((entry) => {
                          if (entry.isIntersecting) {
                              playerElement.play().catch((error) => {
                                  console.error("Playback error:", error);
                              });
                          } else {
                              playerElement.pause();
                          }
                      });
                  },
                  {
                      threshold: 0.5, // Video must be at least 50% visible
                  }
              );

              // Observe the ReactPlayer DOM element
              observer.observe(playerElement);
              observers.push(observer);
          });
      };

      // Listen for user interaction to start observers
      document.addEventListener("click", handleUserInteraction);
      document.addEventListener("touchstart", handleUserInteraction);

      // Cleanup observers on unmount
      return () => {
          observers.forEach((observer) => observer.disconnect());
          document.removeEventListener("click", handleUserInteraction);
          document.removeEventListener("touchstart", handleUserInteraction);
      };
  }, [posts, playerRefs]);
  
  
    if (loading) {
      return (
        <div className="loading-container"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1050,
          }}
        >
          <Spinner animation="border" role="status" >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }

   



    return (        
            <div >
              <Suspense fallback={<BigSpinner />}>
                {posts.length > 0 ? (
                    posts.map((post, index) => (
                        <div key={post?._id || index} className="post-card">            {/* 638 */}
                            <Card
                                className="p-3 userCon"                                
                            >
                                {/* User Info */}
                                <div className="d-flex align-items-center mb-3">
                                    <Image
                                        src={post.user?.userImage || post.originalCreator?.userImage || "/avatar.png"}
                                        roundedCircle
                                        width={40}
                                        height={40}
                                        alt="User Avatar"
                                        style={{objectFit: "cover"}}
                                    />
                                    <div className="ms-2">
                                        <strong>
                                            {post?.user?.updateFullName ||
                                                post?.user?.displayName || post?.user?.username ||
                                                post?.originalCreator?.updateFullName ||
                                                post?.originalCreator?.displayName || post?.originalCreator?.username ||
                                                fullName}
                                        </strong>
                                        <div className="text-muted" style={{ fontSize: "12px" }}>
                                            {new Date(post.createdAt).toLocaleString()}
                                        </div>
                                    </div>


                                    {post.user && currentUser?.id && (
                                        post.user?._id === currentUser.id ? (
                                            // Show followers count for the logged-in user
                                            <Badge bg="info" className="ms-auto">
                                                Followers: {post?.user?.followersCount || post?.user?.followerCount || 0}
                                                {/* Followers: {post.user.followersCount || 0} */}
                                            </Badge>
                                        ) : (
                                            // Show Follow/Unfollow button for other users
                                            <Button
                                                variant={post?.user?.isFollowed ? "outline-secondary" : "outline-primary"}
                                                size="sm"
                                                className="ms-auto"
                                                onClick={() => handleFollow(post.user?._id)}
                                            >
                                                {post.user?.isFollowed ? "Unfollow" : "Follow"}
                                            </Button>
                                        )
                                    )}

                                </div>

                                {/* Repost Info */}
                                {post.originalPost && post.originalCreator && (
                                    <Card.Text
                                        style={{
                                            fontStyle: "italic",
                                            color: "gray",
                                            textAlign: "center",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        Originally posted by{" "}
                                        <a
                                            href={`/user/${post.originalCreator._id}`}
                                            style={{ textDecoration: "none", color: "blue" }}
                                        >
                                            {post.originalCreator?.updateFullName || post.originalCreator?.username || post.originalCreator?.displayName || fullName || "Anonymous"}
                                        </a>{" "}
                                        on {new Date(post.originalPost.createdAt).toLocaleDateString()}.
                                        <br />
                                        <a
                                            href={`/post/${post.originalPost._id}`}
                                            className="original-post-link"
                                            style={{ color: "blue", textDecoration: "underline" }}
                                        >
                                            View Original Post
                                        </a>
                                    </Card.Text>
                                )}

                                {/* Post Content */}
                                <Card.Text>
                                <Suspense fallback={<BigSpinner />}>
                                    <strong>{post.content || "No content available"}</strong>
                                    </Suspense>
                                </Card.Text>
                                
                                {post.imageUrl && (
                                  <Suspense fallback={<AlbumsGlimmer />}>
                                    <Card.Img
                                        src={post.imageUrl}
                                        alt="Post Media"
                                        width={450}
                                        
                                        height={200}
                                        style={{ objectFit:"cover"}}
                                       
                                        //className="card-img-top"
                                        
                                    />
                                    </Suspense>
                                    
                                )}
                                {post.videoUrl && (
                                  <Suspense fallback={<AlbumsGlimmer />}>
                                    <ReactPlayer
                                        ref={(el) => (playerRefs.current[index] = el)}
                                        className="card-img-top"                                        
                                        url={post.videoUrl}
                                        playing={false} // We control play/pause manually
                                        controls={true}
                                        width="100%"
                                    />
                                    </Suspense>
                                  
                                )}
                                
                                


                                <div className="d-flex justify-content-around mt-3">
                                    {/* like button */}
                                    <Button
                                        title='Like this?'
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => handleLike(post._id)}>
                                        <FaThumbsUp />  {`${post.likes?.length}`} {/* Ensure fallback if likes is undefined */}
                                    </Button>


                                    {/* comment btn */}
                                    <Button
                                        title='Comment'
                                        variant="outline-secondary"
                                        onClick={() => toggleCommentArea(post._id)}
                                        size="sm"
                                    >
                                        <FaCommentAlt /> {` ${post?.comments?.length}`} {/* Display the number of comments */}
                                        {/* Comment */}
                                    </Button>



                                    {/* Repost btn */}
                                    {/* Add any action buttons here, repost  */}
                                    <Button
                                        title='Repost'
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => handleRepost(post._id)}
                                    >
                                        {/* <BsRepeat /> {post.originalPost?.repostCount || 0} */}
                                        <BsRepeat /> {post?.repostCount || 0}
                                    </Button>
                                   

                                    <Button
                                        title="Share"
                                        variant="outline-success"
                                        size="sm"
                                        onClick={() => setShowShareModal(true)}
                                    >
                                        <FaShare /> {post?.shareCount || 0}
                                    </Button>

                                    <ShareModal
                                        post={post}
                                        show={showShareModal}
                                        handleClose={() => setShowShareModal(false)}
                                    />


                                    {/* Bookmark btn */}
                                    <Button
                                        title={isBookmarked ? "Unbookmark" : "Bookmark"}
                                        variant="outline-info"
                                        size="sm"
                                        onClick={() => handleBookmark(post._id)}
                                    >
                                        {isBookmarked ? <FaBookmark /> : <FaRegBookmark />} {post?.bookmarkCount || 0}
                                    </Button>

                                    {/* Report post btn */}
                                    <Button
                                        title={isReported ? "Reported" : "Report this Post"}
                                        variant="outline-dark"
                                        size="sm"
                                        onClick={() => handleReportPost(post._id)}
                                    >
                                        {isReported ? <BsExclamationTriangle /> : <BsExclamationTriangleFill />} {post?.reportCount || 0}
                                    </Button>

                                </div>



                                {commentVisibility[post._id] && (
                                    <div ref={(el) => (commentAreaRef.current[post._id] = el)}
                                        className="mt-3">
                                        <Form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                const commentText = e.target.elements.commentText.value;
                                                handleCommentSubmit(post._id, commentText);
                                                e.target.reset(); // Clear the form
                                            }}>
                                            <Form.Group className="mb-2">
                                                <div className="d-flex align-items-center border border-primary rounded">
                                                    {/* Input Field */}
                                                    <Form.Control
                                                        name="commentText"
                                                        type="text"
                                                        placeholder="Add a comment..."
                                                        aria-label="Add a comment..."
                                                        aria-describedby="basic-verify"
                                                        style={{ flex: 1 }}
                                                    />

                                                    {/* Send Button */}
                                                    <button
                                                        type="submit"
                                                        variant='outline-primary'
                                                        title='Comment'
                                                        id="basic-verify"
                                                        disabled={loading}
                                                        className="basic-verify"
                                                        style={{
                                                            border: 'none',
                                                            backgroundColor: 'transparent',
                                                            color: loading ? 'green' : 'blue',
                                                            cursor: loading ? 'not-allowed' : 'pointer',
                                                            padding: '0px 10px',

                                                        }}
                                                    >
                                                        {loading ? (
                                                            <span>
                                                                <span
                                                                    className="spinner-border spinner-border-sm me-1"
                                                                    role="status"
                                                                    aria-hidden="true"
                                                                ></span>
                                                                Sending...
                                                            </span>
                                                        ) : (
                                                            <BsFillSendFill />
                                                        )}
                                                    </button>
                                                </div>
                                            </Form.Group>
                                        </Form>

                                        {/* Render comments */}
                                        <ListGroup variant="flush" className="mt-2">
                                            {post.comments.map((comment) => (
                                                <ListGroup.Item key={comment._id}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        {/* Left: User Image and Comment */}
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            {comment.user.userImage && (
                                                                <img
                                                                    src={comment.user.userImage}
                                                                    alt="User Avatar"
                                                                    title={comment.user.updateFullName || comment.user.username || comment.user.displayName || 'Anonymous'}
                                                                    style={{
                                                                        width: '40px',
                                                                        height: '40px',
                                                                        borderRadius: '50%',
                                                                        marginRight: '10px',
                                                                        objectFit: 'cover',
                                                                    }}
                                                                />
                                                            )}
                                                            <div>
                                                                <div>
                                                                    <strong>
                                                                        {comment.user.updateFullName || comment.user.displayName || comment.user.username || 'Anonymous'}
                                                                    </strong>: {comment.text}
                                                                </div>
                                                                <div className="text-muted" style={{ fontSize: "12px" }}>
                                                                    {new Date(post.createdAt).toLocaleString()}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Right: Like Button and Count */}
                                                        <div>
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <Button size="sm"
                                                                    onClick={() => handleLikeComment(post._id, comment._id)}>
                                                                    {comment.likes?.includes(currentUser.id) ? <FaRegThumbsUp /> : <FaThumbsUp />} {`${comment.likes?.length || 0}`}
                                                                </Button>

                                                                <Button
                                                                    title={isReported ? "Reported" : "Report this Comment"}
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => handleReportComment(post._id, comment._id)}
                                                                >
                                                                    <BsExclamationTriangleFill /> {comment?.reportCount || 0}
                                                                </Button>
                                                            </div>


                                                        </div>
                                                    </div>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </div>
                                )}
                            </Card>
                        </div>

                    ))
                ) : (
                  <AlbumsGlimmer/>
                
                )}
                </Suspense>
            </div>


        
    )
}

function BigSpinner() {
  return <h5>🌀 Loading...</h5>;
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}

export default Posts