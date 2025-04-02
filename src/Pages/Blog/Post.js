// client/src/components/Post.js
import React, { useState, useRef, useEffect } from 'react';
import CommentList from './CommentList';
import { Card, Row, Col, Form, InputGroup, Button, Modal } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import { TwitterTweetEmbed } from "react-twitter-embed";
import { CgComment } from "react-icons/cg";
import { BiLike } from "react-icons/bi";



const Post = ({ blogPost, onAddComment, onLikePost }) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [commentContents, setCommentContents] = useState({});
  const playerRefs = useRef({}); // Store refs for each video

  console.log("Post Component:", blogPost);



  if (!Array.isArray(blogPost) || blogPost.length === 0) {
    return <div>No posts available.</div>;
  }

  const enableCommentList = (id) => {
    console.log("Comment List ID:", id);
    setShowComments((prev) => (prev === id ? false : id)); // Toggle comment list for the clicked post
  }


  const handleCommentChange = (postId, value) => {
    setCommentContents(prev => ({ ...prev, [postId]: value }));  // ✅ Store comment per post
    console.log("Comment Contents:", commentContents); // Debugging: Check comment contents
  };

  const handleCommentSubmit = (e, postId) => {
    e.preventDefault();
    if (commentContents[postId]?.trim() && onAddComment) {
      onAddComment(postId, commentContents[postId]);
      setCommentContents(prev => ({ ...prev, [postId]: "" }));  // ✅ Clear only this post's comment input
    }
  };

  const extractYouTubeID = (url) => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]+)/
    );
    return match ? match[1] : null;
  };

  const extractTweetID = (url) => {
    // This regex will match all three types of Twitter URLs you provided
    const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
    return match ? match[1] : null;
  };

  const renderContent = (content) => {
    const words = content.split(/\s+/).map((word, index) => {
      if (word.startsWith("http")) {
        const ytID = extractYouTubeID(word);
        if (ytID) {
          return (

            <ReactPlayer key={index} url={word} width="100%" controls />



          );
        }

        const tweetID = extractTweetID(word);
        if (tweetID) {
          return (
            <div key={index} className="tweet-container">
              <TwitterTweetEmbed
                tweetId={tweetID}
                options={{ theme: 'dark' }} // Match your dark theme
              />
            </div>
          );
        }




        return (
          <a key={index} href={word} target="_blank" rel="noopener noreferrer">
            {word}
          </a>
        );
      }
      return word + " ";
    });

    return <p >{words}</p>;
  };

  return (
    <>
      <div >

        {blogPost.map((post) => (
          <div className='col' key={post._id}>
            <Card className='p-3 border border-2 border-dark rounded-3 bg-secondory-subtle blog-card'>
              <Row>
                <Col sm>
                  <div className='pContent'>
                    {post.imageUrl && (
                      <Card.Img
                        src={post.imageUrl}
                        alt="Post Media"
                        width={450}

                        height={300}
                        style={{ objectFit: "cover" }}

                      //className="card-img-top"

                      />

                    )}

                    {post.videoUrl && (

                      <ReactPlayer
                        // ref={(el) => (playerRefs.current[index] = el)}
                        className="card-img-top"
                        url={post.videoUrl}
                        playing={false} // We control play/pause manually
                        controls={true}
                        width="100%"
                      />


                    )}







                    {renderContent(post.content)}</div>

                </Col>

                <Col sm>
                  <div className="post-actions">
                    <div>
                      <Card.Text>
                        <div className="b-title mb-2">
                          <div className="author"><span className='text-muted'>Title: </span> <span >{post?.title}</span></div>
                          <div className="author"><span className='text-muted' >Category: </span> <span>{post?.category}</span></div>
                        </div>
                      </Card.Text>
                    </div>
                    <div className="post-text d-flex flex-row border border-2 border-dark rounded-3 bg-primary-subtle" style={{ overflow: "auto", marginBottom: "10px" }}>

                     {post?.contentText}
                    </div>


                    <div className="post-actions d-flex justify-content-between gap-2">

                      <div className="d-flex flex-row gap-2 ">
                        <Button variant='secondary' onClick={() => onLikePost(post._id)}>Like <BiLike /> ({post.likes.length})</Button>

                        <Button variant='outline-secondary' onClick={() => enableCommentList(post._id)}>Comment <CgComment /> ({post?.comments?.length})</Button>
                      </div>

                      <div className="post-meta d-flex flex-column align-items-end">
                        <div className="author">{post?.authorName}</div>
                        {/* <div className="date">{new Date(post.createdAt).toLocaleDateString()}</div> */}
                        <div className="date">
                          {new Intl.DateTimeFormat('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          }).format(new Date(post.createdAt))}
                        </div>
                      </div>
                    </div>
                    {showComments === post._id && (
                      <Modal show={showComments === post._id}
                      onHide={() => setShowComments(false)}
                      centered>
                      <Modal.Header closeButton>
                        <Modal.Title>Comments</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        
                            <div className="mt-2">
                              <Form onSubmit={(e) => handleCommentSubmit(e, post._id)} className="comment-form">
                                <InputGroup>
                                  <Form.Control
                                    as="textarea"
                                    rows={1}
                                    placeholder="Add a comment..."
                                    value={commentContents[post._id] || ""}
                                    onChange={(e) => handleCommentChange(post._id, e.target.value)}  // ✅ Track per post
                                  />
                                  <Button type="submit" disabled={!commentContents[post._id]?.trim()}>Comment</Button>
                                </InputGroup>
                              </Form>
            
                            </div>
            
            
                            {/* Render comments */}
                            {Array.isArray(post.comments) && post.comments.length > 0 ? (
                              <div>
                                {post.comments.map((comment, index) => (
                                  <InputGroup key={index} className='mt-1'>
                                    <InputGroup.Text style={{minWidth:'120px', paddingLeft:'10px', fontWeight:'bold'}}>{comment.authorName ? comment.authorName : comment.guestName}</InputGroup.Text> {/* Assuming each comment has a 'userName' field */}
                                    <Form.Control
                                      placeholder="Comment"
                                      aria-label="Comment"
                                      aria-describedby="basic-addon1"
                                      value={comment.content}
                                      readOnly
                                      disabled
                                    />
                                    {/* {comment.content} */}

                                  </InputGroup> // Assuming each comment has a 'content' field
                                ))}
                              </div>
                            ) : (
                              <p>No Comment</p>
                            )}
                         
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowComments(false)}>
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>
                    )}
                    
                  </div>
                </Col>
              </Row>


            </Card>
          </div>

        ))}


      </div>
      
    </>

  );
};

export default Post;