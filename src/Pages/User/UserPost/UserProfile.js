import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import AuthContext from "../../../Context/AuthContext";
import PostCard from "./PostCard";
import { Button, Badge } from "react-bootstrap";
import LoadingSpinner from "../../../Components/Common/LoadingSpinner";

const UserProfile = () => {
    const { users } = useContext(AuthContext);


    const currentUser = users;
    const { userId, postId } = useParams();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [highlightedPost, setHighlightedPost] = useState(null);
    const [isFollowed, setIsFollowed] = useState(user?.isFollowed || false);

    const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);


    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         console.log("id", userId);

    //         const userRes = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`);
    //         const userData = await userRes.json();
    //         setUser(userData);
    //         console.log('data user at profile', userData);

    //     };


    //     const fetchUserPosts = async () => {
    //         try {
    //             const postRes = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/user/${userId}`);
    //             const result = await postRes.json();

    //             if (!Array.isArray(result)) {
    //                 console.error("Expected array, got:", result);
    //                 return;
    //             }

    //             const highlight = postId ? result.find(p => p._id === postId) : null;
    //             const rest = postId ? result.filter(p => p._id !== postId) : result;

    //             setHighlightedPost(highlight);
    //             setPosts(rest);
    //         } catch (error) {
    //             console.error("Failed to fetch posts:", error);
    //         }
    //     };

    //     const checkFollowStatus = async () => {
    //         try {
    //             const token = localStorage.getItem("token");
    //             if (!token) return;
    
    //             const followStatusResponse = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}/isFollowing`, {
    //                 method: 'GET',
    //                 credentials: 'include',
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             });
    
    //             const { isFollowing } = await followStatusResponse.json();
    //             console.log("fl", isFollowing);
                
    //             setIsFollowed(isFollowing); // ✅ update local state
    //         } catch (error) {
    //             console.error("Error checking follow status:", error);
    //         }
    //     };


    //     fetchUserData();
    //     fetchUserPosts();
    //     checkFollowStatus();
    // }, [userId, postId]);


    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log("id", userId);
    
                const userRes = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`);
                if (!userRes.ok) throw new Error("Failed to fetch user data");
                const userData = await userRes.json();
                setUser(userData);
                console.log('data user at profile', userData);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Unable to load user profile.");
            } finally {
                setLoading(false);
            }
        };
    
        const fetchUserPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                const postRes = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/user/${userId}`);
                if (!postRes.ok) throw new Error("Failed to fetch posts");
                const result = await postRes.json();
    
                if (!Array.isArray(result)) {
                    throw new Error("Unexpected post data format.");
                }
    
                const highlight = postId ? result.find(p => p._id === postId) : null;
                const rest = postId ? result.filter(p => p._id !== postId) : result;
    
                setHighlightedPost(highlight);
                setPosts(rest);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
                setError("Unable to load posts.");
            } finally {
                setLoading(false);
            }
        };
    
        const checkFollowStatus = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
    
                const followStatusResponse = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}/isFollowing`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                const { isFollowing } = await followStatusResponse.json();
                console.log("fl", isFollowing);
    
                setIsFollowed(isFollowing);
            } catch (error) {
                console.error("Error checking follow status:", error);
            }
        };
    
        fetchUserData();
        fetchUserPosts();
        checkFollowStatus();
    }, [userId, postId]);

    
    const handleFollow = async (id) => {

        // handle follow/unfollow logic
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("User not authenticated.");
      
            // Step 1: Check if the user is already following the target user
            const followStatusResponse = await fetch(`${process.env.REACT_APP_API_URL}/user/${id}/isFollowing`, {
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${id}/follow`, {
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
            // sendMessage("followStatus", data);
      
          } catch (error) {
            console.error('Error following/unfollowing user:', error);
          }
    };

    //reload for feed
    const reloadFeed = async () => {
        window.location.reload();        
      };

      if (loading) {
        return <LoadingSpinner />;
      }
     

      if (error) {
        return (
          <div>
            <p className="text-danger">{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        );
      }
      

      
      

    return (
        <div className="container mt-4">
            {/* User Info */}
            <div className="d-flex align-items-center mb-3">
                <img
                    src={user?.userImage || "/avatar.png"}
                    className="rounded-circle"
                    alt="User"
                    width={100}
                    height={100}
                />
                <div className="ms-2">
                    <h5 className="mb-0">{user?.updateFullName || user?.displayName || user?.username}</h5>
                    <small className="text-muted">@{user?.updateFullName || user?.displayName}</small>
                </div>
                

                {/* Follow or Followers Count */}
                <div className="d-flex flex-column  justify-content-center ms-auto">
                
                   
                        <Badge bg="info" className="ms-auto ">
                            Followers: {user?.followers?.length || user?.followerCount || 0}
                        </Badge>
                        
               
                        <Button
                            variant={isFollowed ? "outline-secondary" : "outline-primary"}
                            size="sm"
                            className=""
                            onClick={async (e) => {
                                e.stopPropagation();
                                await handleFollow(user._id);
                                setIsFollowed(prev => !prev);
                            }}
                        >
                            {isFollowed ? "Unfollow" : "Follow"}
                            {/* <-- ✅ */}
                        </Button>

                        </div>

                
            </div>

            {/* Highlighted Post */}
            {highlightedPost && (
                <div className="mb-4 border border-primary rounded p-3 bg-light">
                    <PostCard
                        postCreator={user}
                        post={highlightedPost}
                        currentUser={currentUser}
                        
                    />
                </div>
            )}

            {/* Other Posts */}
            {posts.map(post => (
                <PostCard
                    key={post._id}
                    postCreator={user}
                    post={post}
                    currentUser={currentUser}
                    
                />

            ))}
        </div>
    );
};
export default UserProfile;
