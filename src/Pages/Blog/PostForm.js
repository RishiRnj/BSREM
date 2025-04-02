import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Form, InputGroup, Button, Modal } from 'react-bootstrap';
import { BsCrop, BsFillSendFill, BsPencilSquare } from "react-icons/bs";
import { FaAd, FaCamera, FaEdit, FaVideo } from "react-icons/fa";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import './Blog.css'; // Assuming you have a CSS file for styling
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';


const PostForm = ({ onCreatePost }) => {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        contentText: "",
        category: "",
        authorName: "", // Author will be set from the token
        image: null,
        video: null,
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [previewVideo, setPreviewVideo] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();


    const [imageSrc, setImageSrc] = useState(null); // Original image
    const [croppedImage, setCroppedImage] = useState(null); // Cropped image
    const [videoSrc, setVideoSrc] = useState(null); // Video source
    const [showCropper, setShowCropper] = useState(false); // Show/hide cropper
    const cropperRef = useRef(null); // Ref for Cropper component
    const fileInputRef = useRef(null); // Ref for file input
    const videoInputRef = useRef(null); // Ref for video input

    const [showPostForm, setShowPostForm] = useState(false); // State to control the modal
    const [showPostMOdal, setShowPostModal] = useState(false); // State to control the modal
    const [uploadedFileType, setUploadedFileType] = useState(null); // 'image' or 'video'
    const [errorMessage, setErrorMessage] = useState(""); // Error message


    // Assuming the token is stored in localStorage or can be accessed via a global state (context, redux, etc.)

    const fetchName = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp < Date.now() / 1000) {
                    localStorage.removeItem('token');
                    localStorage.setItem("redirectAfterLogin", location.pathname);
                    navigate('/login', { replace: true });
                    return;
                }

                // Determine which name to use (with fallback logic)
                const name = decodedToken.updateFullName || decodedToken.displayName || decodedToken.username;

                setFormData((prev) => ({
                    ...prev,
                    authorName: name,
                }));
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
    };

    // Call fetchName only once when the component mounts or when the token changes
    useEffect(() => {
        fetchName();
    }, []); // Empty array ensures this runs only once, after the first render

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        console.log(" sasss", formData, formData.authorName);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type.startsWith("image/")) {
            setPreviewImage(URL.createObjectURL(file));
            setFormData((prev) => ({ ...prev, image: file, video: null }));
            setPreviewVideo(null);
        } else if (file.type.startsWith("video/")) {
            setPreviewVideo(URL.createObjectURL(file));
            setFormData((prev) => ({ ...prev, video: file, image: null }));
            setPreviewImage(null);
        } else {
            alert("Unsupported file type! Please upload an image or a video.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title) {
            alert("Title is required.");
            return;
        }
        if (!formData.contentText) {
            alert("Content Text is required.");
            return;
        }
        if (!formData.category) {
            alert("Category is required.");
            return;
        }
        if (!formData.authorName) {
            alert("Author Name is required.");
            return;
        }

        setLoading(true);

        const postData = new FormData();
        postData.append("title", formData.title);
        postData.append("content", formData.content);
        postData.append("contentText", formData.contentText);
        postData.append("category", formData.category);
        postData.append("authorName", formData.authorName); // Include author in postData

        // Append cropped image as Blob
      if (croppedImage) {
        const blob = await fetch(croppedImage).then((res) => res.blob());
        postData.append("image", blob, "croppedImage.png");
      }

      // Append video file
      if (videoSrc) {
        const videoFile = videoInputRef.current.files[0];
        postData.append("video", videoFile, videoFile.name);
      }
        // if (formData.image) postData.append("image", formData.image);
        // if (formData.video) postData.append("video", formData.video);
        console.log("post data in post form", postData);

        try {
            await onCreatePost(postData);
            setFormData({ title: "", content: "", category: "", image: null, video: null });
            setImageSrc(null);
      setCroppedImage(null);
      setVideoSrc(null);
      setUploadedFileType(null); // Reset file type after successful post
      setShowPostModal(false);
        } catch (error) {
            console.error("Error creating post:", error);
        } finally {
            setLoading(false);
        }
    };


    // Handle image selection
    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (uploadedFileType === 'video') {
                alert("You cannot upload both an image and a video.");
                resetInput();
                return;
            }

            // Allowed MIME types
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp", "image/bmp"];

            if (!allowedTypes.includes(file.type)) {
                alert("Only JPG and PNG files are allowed.");
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                setImageSrc(event.target.result);
                setShowCropper(true); // Show cropper after selecting an image
                setUploadedFileType('image'); // Set uploaded file type to image
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle video selection
    const handleVideoSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (uploadedFileType === "image") {
                setErrorMessage("You cannot upload both an image and a video.");
                resetInput();
                return;
            }

            const MAX_SIZE_MB = 105;
            const MAX_DURATION_SECONDS = 600; // 10 minutes

            // Check file size
            const fileSizeMB = file.size / (1024 * 1024);
            if (fileSizeMB > MAX_SIZE_MB) {
                setErrorMessage(`File size exceeds ${MAX_SIZE_MB} MB.`);
                resetInput();
                return;
            }

            // Check video duration
            const videoElement = document.createElement("video");
            videoElement.preload = "metadata";

            videoElement.onloadedmetadata = () => {
                window.URL.revokeObjectURL(videoElement.src); // Clean up URL object
                const duration = videoElement.duration; // Duration in seconds

                if (duration > MAX_DURATION_SECONDS) {
                    setErrorMessage(`Video duration exceeds ${MAX_DURATION_SECONDS / 60} minutes.`);
                    resetInput();
                } else {
                    setVideoSrc(file);
                    setUploadedFileType("video");
                    setErrorMessage("");
                }
            };

            videoElement.onerror = () => {
                setErrorMessage("Unable to read video file. Please upload a valid video.");
                resetInput();
            };

            videoElement.src = URL.createObjectURL(file);
        }
    };

    const resetInput = () => {
        if (videoInputRef.current) {
            videoInputRef.current.value = null; // Reset the input field
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = null; // Reset the input field
        }
        setImageSrc(null); // Reset the image source
        setVideoSrc(null);
        setUploadedFileType(null);

    };

    const handleCrop = () => {
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            const croppedDataUrl = cropper.getCroppedCanvas({
                width: 1920,
                height: 1080,
            }).toDataURL(); // Cropped image as base64
            setCroppedImage(croppedDataUrl);
            setImageSrc(croppedDataUrl); // Replace original image with cropped one
            setShowCropper(false); // Hide cropper
        }
    };

    return (
        <>
            <Box sx={{
                position: 'fixed',
                bottom: "100px", // Space for footer
                right: '16px',
                pointerEvents: 'auto',
              }}>
                <Fab  color="primary" aria-label="add" onClick={() => setShowPostModal(true)} sx={{ position: 'fixed', top: 80, right: 5, fontSize:"20px", zIndex: 1 }}>
                    <BsPencilSquare/>
                </Fab>

            </Box>
            {/* <button
                onClick={() => {
                    // setShowPostForm(!showPostForm); // Toggle visibility of post form
                    setShowPostModal(true); // Show modal
                }}
            >
                {showPostForm ? "Hide Post Container" : "Show Post Container"}
            </button> */}


            <Modal show={showPostMOdal} onHide={() => { setShowPostModal(false); resetInput() }} centered >

                <Modal.Header closeButton onClick={() => { setShowPostModal(false); resetInput() }}>
                    <Modal.Title>Create a New Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    {loading && (
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(255, 255, 255, 0.7)", // semi-transparent overlay
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 999,
                            }}
                        >
                            <span className="spinner-border text-primary" role="status" aria-hidden="true"></span>
                        </div>
                    )}

                    {/* <Form onSubmit={handleSubmit} className="post-form"> */}
                    <InputGroup className="mb-1">
                        <InputGroup.Text>Title</InputGroup.Text>
                        <Form.Control
                            type="text"
                            name="title"
                            placeholder="Title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>

                    {/* Media Placeholder */}
                    {imageSrc && !showCropper && (
                        <Card.Img
                            variant="top"
                            src={imageSrc}
                            // style={{ objectFit: "contain" }}
                            style={{ maxHeight: "250px", objectFit: "contain" }}
                        />
                    )}

                    {videoSrc && (
                        <video
                            src={videoSrc}
                            controls
                            style={{ maxHeight: "250px", objectFit: "contain", width: "100%" }}
                        />
                    )}

                    {/* Cropper */}
                    {showCropper && (
                        <Cropper
                            src={imageSrc}
                            // style={{ height: 300, width: "100%" }}
                            style={{ width: "100%" }}
                            initialAspectRatio={16 / 10} // Aspect ratio of 400x250
                            guides={true}
                            viewMode={1}
                            dragMode="move"
                            cropBoxResizable={false}
                            cropBoxMovable={true}
                            autoCropArea={1}
                            background={false}
                            ref={cropperRef}
                        />
                    )}

                    <InputGroup className="mb-1">
                        <InputGroup.Text>Content Link</InputGroup.Text>
                        <Form.Control
                            as="textarea"
                            name="content"
                            placeholder="Enter content link..."
                            rows={1}
                            value={formData.content}
                            onChange={handleChange}
                            
                        />
                    </InputGroup>
                    <InputGroup className="mb-1">
                        <InputGroup.Text>Content Text</InputGroup.Text>
                        <Form.Control
                            as="textarea"
                            name="contentText"
                            placeholder="Write your post..."
                            value={formData.contentText}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>

                    <InputGroup className="mb-1">
                        <InputGroup.Text>Image/Video</InputGroup.Text>
                        <Form.Control


                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={handleImageSelect}

                        />
                        <Form.Control
                            type="file"
                            ref={videoInputRef}
                            style={{ display: "none" }}
                            accept="video/*"
                            onChange={handleVideoSelect}
                        />

                        {/* Apply Crop Button */}
                        {showCropper && (
                            <Button className="crp" variant="success"
                                onClick={handleCrop}
                            >
                                <BsCrop /> Apply Crop
                            </Button>
                        )}



                        {/* Choose Image Button */}
                        <Button
                            variant="outline-primary"
                            className="flex-fill"
                            onClick={() => fileInputRef.current.click()}
                        // disabled={uploadedFileType === 'video'}
                        >
                            <FaCamera />
                        </Button>

                        {/* Choose Video Button */}
                        <Button
                            variant="outline-success"
                            className="flex-fill"
                            onClick={() => videoInputRef.current.click()}
                        //disabled={uploadedFileType === 'image'}
                        >
                            <FaVideo />

                        </Button>




                    </InputGroup>

                    <InputGroup className="mb-2">
                        <InputGroup.Text>Category</InputGroup.Text>
                        <Form.Control
                            as={"select"}
                            name="category"
                            placeholder="Category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="General">General</option>
                            <option value="Science & Technology">Science & Technology</option>
                            <option value="Business & Economy">Business & Economy</option>
                            <option value="Politics & Society">Politics & Society</option>
                            <option value="Culture & Arts">Culture & Arts</option>

                            <option value="Environment">Environment</option>
                            <option value="Finance">Finance</option>
                            <option value="News">News</option>
                            <option value="Education">Education</option>
                            <option value="Health">Health</option>
                            <option value="Lifestyle">Lifestyle</option>
                            <option value="Travel">Travel</option>

                            <option value="Entertainment">Entertainment</option>
                            <option value="Sports">Sports</option>

                            <option value="Events">Events</option>
                            <option value="Personal Stories">Personal Stories</option>

                            <option value="Relationships">Relationships</option>
                            <option value="Self-Improvement">Self-Improvement</option>


                            <option value="Opinion">Opinion</option>
                            <option value="Reviews">Reviews</option>
                            <option value="Interviews">Interviews</option>

                            <option value="History">History</option>
                            <option value="Hinduism & Spiritual">Hinduism & Spiritual</option>
                            <option value="Sanatana Tradition">Sanatana Tradition</option>

                        </Form.Control>
                    </InputGroup>

                    {errorMessage && <div className="text-danger">{errorMessage}</div>}

                </Modal.Body>
                <Modal.Footer>

                    <Button variant="secondary" onClick={() => { setShowPostModal(false); resetInput() }}>
                        Close
                    </Button>

                    <Button variant="primary" onClick={handleSubmit} type="submit" disabled={loading}>
                        {loading ? "Posting..." : "Create Post"} <BsFillSendFill className="send-icon" />
                    </Button>
                </Modal.Footer>
            </Modal>


        </>
    );
};

export default PostForm;
