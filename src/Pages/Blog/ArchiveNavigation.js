

import React from "react";
import './Blog.css'; // Assuming you have a CSS file for styling

const ArchiveNavigation = ({ months, expandedMonths, onToggleMonth }) => { 


  return (
    <div className="archive-navigation">
      <h2 className="text-center mb-3">Archive</h2>
      <>
        {months.map(({ _id, posts }) => (
         
          
          <div key={_id}>
            <div 
              className="month-header"
              onClick={() => onToggleMonth(_id)}
            >
              {new Date(_id).toLocaleString("default", { month: "long", year: "numeric" })}
              <span>{expandedMonths.includes(_id) ? "▼" : "▶"}</span>
            </div>

            {expandedMonths.includes(_id) && (
              <div className="archived-posts">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <div key={post._id} className="post">
                      {post.status === "archived" && (
                        <>
                         <h4>{post.title}</h4>
                      <p>{post.content}</p>
                      <p><strong>Likes:</strong> {post.likes.length}</p>
                      <p><strong>Comments:</strong> {post.comments.length}</p>
                        </>
                       
                     
                      )}
                     
                    </div>
                  ))
                ) : (
                  <p>No archived posts for this month.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </>
    </div>
  );
};

export default ArchiveNavigation;
// client/src/components/ArchiveNavigation.js


