

import React, { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext();

let ws; // Declare WebSocket at the module level
let reconnectTimeout; // To store the reconnect timeout reference

export const WebSocketProvider = ({ children }) => {
  const [realTimeData, setRealTimeData] = useState([]);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);


  const reconnectInterval = 5000; // Interval for reconnection attempts in milliseconds

  const connectWebSocket = () => {

    const token = localStorage.getItem('token'); // Retrieve token from storage
    // ws = new WebSocket(
    //   process.env.NODE_ENV === "production"
    //     ? `${process.env.REACT_APP_API_URL_P}?token=${token}`
    //     : `${process.env.REACT_APP_API_URL}?token=${token}`
    // );

    const wsUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_WS_URL_P // Should be wss:// in .env
    : process.env.REACT_APP_WS_URL;  // Should be ws:// for local dev

const ws = new WebSocket(`${wsUrl}?token=${token}`);
console.log("WebSocket URL:", `${wsUrl}?token=${token}`);



    ws.onopen = () => {
      console.log("WebSocket connection established");
      clearTimeout(reconnectTimeout); // Clear the reconnect timeout on successful connection
    };

    ws.onmessage = (event) => {
      const { eventType, data } = JSON.parse(event.data);
      console.log("WebSocket Event Received:", eventType, data);

      if (eventType === "newPost") {
        // setPosts((prevPosts) => [data, ...prevPosts]);
        setPosts((prevPosts) => {
          // Ensure the broadcasted post includes followerCount
          const updatedPost = {
            ...data,
            user: {
              ...data.user,
              followerCount: data.followerCount || 0,
              isFollowed: data.user.isFollowed || false, // Use broadcasted isFollowed
            },
          };

          return [updatedPost, ...prevPosts];
        });


      } else if (eventType === "repost") {
        setPosts((prevPosts) => {
          const {
            repostedPost,
            repostedPostId,
            repostedPostCount,
            originalPostId,
            originalPostCount,
            followerCount,
          } = data;

          // Update posts based on repost logic
          const updatedPosts = prevPosts.map((post) => {
            if (post._id === originalPostId) {
              return { ...post, repostCount: originalPostCount };
            } else if (post._id === repostedPostId) {
              return { ...post, repostCount: repostedPostCount, followerCount };
            }
            return post;
          });

          // Add the new repost to the top of the list
          console.log("update repost", updatedPosts);

          return [repostedPost, ...updatedPosts];
        });
      } else if (eventType === "likePost") {
        setPosts((prevPosts) => {
          const { _id: postId, likes } = data;
          return prevPosts.map((post) =>
            post._id === postId ? { ...post, likes } : post
          );
        });
      } else if (eventType === "newComment") {
        console.log("newComment event data:", data);
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === data.postId
              ? { ...post, comments: [...post.comments, data.comment] }
              : post
          )
        );
      } else if (eventType === "commentLike") {
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post._id === data.postId) {
              const updatedComments = post.comments.map((comment) =>
                comment._id === data.commentId
                  ? { ...comment, likes: data.likes }
                  : comment
              );
              return { ...post, comments: updatedComments };
            }
            return post;
          })
        );
      } else if (eventType === "followStatus") {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.user._id === data.targetUserId
              ? {
                ...post,
                user: {
                  ...post.user,
                  followersCount: data.followersCount, // Update followers count
                  isFollowed: data.action === "follow", // Update follow status
                },
              }
              : post
          )
        );
      } else if (eventType === 'share') {
        setPosts((prevPosts) => prevPosts.map((post) =>
          post._id === data.postId
            ? { ...post, shareCount: data.updatedShareCount }
            : post
        ));
      } else if (eventType === "bookmarkUpdate") {
        setPosts((prevPosts) => {
          const { postId, updatedBookmarkCount } = data;

          return prevPosts.map((post) => {
            if (post._id === postId) {
              return { ...post, bookmarkCount: updatedBookmarkCount };
            }
            return post;
          });
        });
      } else if (eventType === "reportUpdate") {
        setPosts((prevPosts) => {
          const { postId, updatedReportCount, isReported } = data;

          return prevPosts.map((post) => {
            if (post._id === postId) {
              return { ...post, reportCount: updatedReportCount, isReported };
            }
            return post;
          });
        });
      } else if (eventType === "commentReportUpdate") {
        setPosts((prevPosts) => {
          const { postId, commentId, updatedReportCount, isReported } = data;

          return prevPosts.map((post) => {
            if (post._id === postId) {
              const updatedComments = post.comments.map((comment) => {
                if (comment._id === commentId) {
                  return { ...comment, reportCount: updatedReportCount, isReported };
                }
                return comment;
              });

              return { ...post, comments: updatedComments };
            }
            return post;
          });
        });
      } else if (eventType === "filteredPost") {
        setPosts((prevPosts) => {
          const exists = prevPosts.some((post) => post._id === data._id);
          return exists ? prevPosts : [data, ...prevPosts];
        });

      } else if (eventType === 'userSuggestionFollowStatus') {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === data.targetUserId
              ? {
                ...user,
                followers: user.isFollowed ? user.followers - 1 : user.followers + 1,
                isFollowed: data.action === 'follow',
              }
              : user
          )
        );
      } else if (eventType === "NEW_POST") {
        console.log("New blog post received:", data);
        // setBlogPosts((prev) => [data, ...prev]); // Add new post to the top
        setBlogPosts((prev) => {
          const exists = prev.some((post) => post._id === data._id);
          return exists ? prev : [data, ...prev];
        });

      } else if (eventType === "POST_LIKE_UPDATE") {
        // console.log("New blog post received:", data);
        // setBlogPosts((prev) =>
        //   prev.map((post) => 
        //     post._id === data.postId ? { ...post, likes: data.likes } : post
        //   )
        // );  BLOG_POST_COMMENT

        console.log("Post like update received:", data);
        setBlogPosts((prev) =>
          prev.map((post) =>
            post._id === data.postId ? { ...post, likes: data.likes } : post
          )
        );
      } else if (eventType === "BLOG_POST_COMMENT") {       
        console.log("New comment received:", data);
        setBlogPosts((prev) =>
            prev.map((post) =>
                post._id === data.postId
                    ? { ...post, comments: [...post.comments, data.comment] } // ✅ Append comment instead of replacing
                    : post
            )
        );
    }
    









    };

    ws.onclose = () => {
      console.log("WebSocket connection closed. Attempting to reconnect...");
      reconnectTimeout = setTimeout(connectWebSocket, reconnectInterval); // Retry connection after a delay
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

  };


  useEffect(() => {
    connectWebSocket();

    // Cleanup WebSocket connection and reconnection timer on unmount
    return () => {
      if (ws) ws.close();
      clearTimeout(reconnectTimeout);
    };
  }, []);

  const sendMessage = (eventType, data) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ eventType, data }));
    } else if (ws && ws.readyState === WebSocket.CONNECTING) {
      ws.onopen = () => {
        ws.send(JSON.stringify({ eventType, data }));
      };
    } else {
      console.error("WebSocket is not open. Unable to send message.");
    }
  };

  return (
    <WebSocketContext.Provider value={{ realTimeData, sendMessage, posts, setPosts, users, setUsers, blogPosts, setBlogPosts }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);




