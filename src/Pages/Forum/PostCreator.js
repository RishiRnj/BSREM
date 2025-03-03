// its perfectly working

// import React, { useState } from 'react';
// import { Modal, Button, Form, Card, Spinner, ProgressBar, ListGroup, InputGroup } from "react-bootstrap";
// import { FaImage } from 'react-icons/fa';
// import { BsCardImage } from "react-icons/bs";
// import Cropper from 'react-cropper';
// import 'cropperjs/dist/cropper.css';

// const PostCreator = ({ onPostCreated }) => {
//   const [postContent, setPostContent] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [imageSrc, setImageSrc] = useState(null); // Initially no placeholder
//   const [fileInput, setFileInput] = useState(null);


//   const handleImageSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setImageSrc(event.target.result); // Update preview
//       };
//       reader.readAsDataURL(file); // Read the file
//     } else {
//       setImageSrc(null); // Reset if no file selected
//     }
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!postContent.trim() && !imageSrc) return; // Ensure at least one of content or image is provided
//     setLoading(true);

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("Missing user authentication details.");

//       const formData = new FormData(); // Create a formData object
//       formData.append('content', postContent);
//       if (fileInput.files[0]) formData.append('userUpload', fileInput.files[0]);

//       const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts`, {
//         method: 'POST',
//         credentials: 'include', // Important for cookies or sessions
//         headers: {
//           Authorization: `Bearer ${token}`, // Note: Do not set 'Content-Type' with FormData
//         },
//         body: formData, // Send FormData
//       });

//       if (!response.ok) throw new Error('Failed to create post');

//       const newPost = await response.json();
//       onPostCreated(newPost); // Notify parent of the new post
//       setPostContent('');
//       setImageSrc(null); // Reset image preview
//     } catch (error) {
//       console.error('Error creating post:', error);
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <>

//       <Card style={{ width: '19rem' }}>
//         {/* Image placeholder */}
//         <Card.Img variant="top" src={imageSrc} style={{ display: imageSrc ? 'block' : 'none' }} />

//         <Card.Body className="p-2">
//           <Card.Text className="mb-1">
//             <Form.Control
//               name="content"
//               as="textarea"
//               placeholder="Write something..."
//               type="text"
//               value={postContent}
//               onChange={(e) => setPostContent(e.target.value)}
//             />
//           </Card.Text>

//           <div className="d-flex align-items-center justify-content-center">
//             {/* File input (hidden) */}
//             <input
//               type="file"
//               ref={(input) => setFileInput(input)}
//               style={{ display: 'none' }}
//               accept="image/*"
//               onChange={handleImageSelect}
//             />

//             {/* Icon to trigger file input */}
//             <a
//               href="#"
//               onClick={(e) => {
//                 e.preventDefault();
//                 fileInput.click(); // Trigger file input
//               }}
//               style={{
//                 color: "#000",
//                 margin: "0 10px",
//                 display: "flex",
//                 alignItems: "center",
//               }}
//             >
//               <BsCardImage style={{ fontSize: "34px", color: "#000" }} />
//             </a>

//             {/* Submit Button */}
//             <Button
//               className=""
//               variant="primary"
//               size="lg"
//               onClick={handleSubmit}
//               disabled={loading || !postContent.trim()}
//               style={{
//                 cursor: loading ? 'not-allowed' : 'pointer',
//                 padding: '0px 10px',
//                 pointerEvents: loading ? 'none' : 'auto',
//               }}
//             >
//               {loading ? (
//                 <span>
//                   <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
//                   Posting...
//                 </span>
//               ) : (
//                 'Post'
//               )}
//             </Button>
//           </div>
//         </Card.Body>
//       </Card>


//     </>

//   );
// };

// export default PostCreator;



// tested and okey 23-01-2024 ==16.34
// import React, { useState, useRef, useEffect } from 'react';
// import { Card, Button, Form } from "react-bootstrap";
// import {  BsCrop, BsFillSendFill, BsCamera, BsCameraReels  } from "react-icons/bs";
// import { FaCamera, FaVideo } from "react-icons/fa";
// import Cropper from "react-cropper";
// import "cropperjs/dist/cropper.css";
// import { useWebSocket } from '../../Context/WebSocketProvider';


// const PostCreator = ({ onPostCreated }) => {
//   const [postContent, setPostContent] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [imageSrc, setImageSrc] = useState(null); // Original image
//   const [croppedImage, setCroppedImage] = useState(null); // Cropped image
//   const [showCropper, setShowCropper] = useState(false); // Show/hide cropper
//   const cropperRef = useRef(null); // Ref for Cropper component
//   const fileInputRef = useRef(null); // Ref for file input
//   const { realTimeData, sendMessage  } = useWebSocket();
//   const [showPostModal, setShowPostModal] = useState(false); // State to control the modal

//    useEffect(() => {
//     console.log("Real-time from post updates:", realTimeData);
//   }, [realTimeData]);



//   // Handle image selection
//   const handleImageSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setImageSrc(event.target.result);
//         setShowCropper(true); // Show cropper after selecting an image
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle cropping
//   const handleCrop = () => {
//     const cropper = cropperRef.current?.cropper;
//     if (cropper) {
//       const croppedDataUrl = cropper.getCroppedCanvas({
//         width: 400,
//         height: 250,
//       }).toDataURL(); // Cropped image as base64
//       setCroppedImage(croppedDataUrl);
//       setImageSrc(croppedDataUrl); // Replace original image with cropped one
//       setShowCropper(false); // Hide cropper
//     }
//   };

//   // Handle post submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!postContent.trim()) return; // Ensure content or image is provided
//     setLoading(true);

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("Missing user authentication details.");

//       const formData = new FormData();
//       formData.append("content", postContent);

//       // Append cropped image as Blob
//       if (croppedImage) {
//         const blob = await fetch(croppedImage).then((res) => res.blob());
//         formData.append("userUpload", blob, "croppedImage.png");
//       }

//       const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts`, {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       if (!response.ok) throw new Error("Failed to create post");

//       const newPost = await response.json();

//       onPostCreated(newPost); // Notify parent of the new post
//       //sendMessage("newPost", newPost);
//     console.log("ne", newPost);

//       setPostContent('');
//       setImageSrc(null);
//       setCroppedImage(null);
//       setShowPostModal(false)
//     } catch (error) {
//       console.error("Error creating post:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card style={{ width: "19rem" }}>
//       {/* Image Placeholder */}
//       {imageSrc && !showCropper && (
//         <Card.Img
//           variant="top"
//           src={imageSrc}
//           style={{ maxHeight: "250px", objectFit: "contain" }}
//         />
//       )}

//       {/* Cropper */}
//       {showCropper && (
//         <Cropper
//           src={imageSrc}
//           style={{ height: 300, width: "100%" }}
//           initialAspectRatio={16 / 10} // Aspect ratio of 400x250
//           guides={true}
//           viewMode={1}
//           dragMode="move"
//           cropBoxResizable={false}
//           cropBoxMovable={true}
//           autoCropArea={1}
//           background={false}
//           ref={cropperRef}
//         />
//       )}



//       <Card.Body>
//         {/* Textarea */}
//         <Form.Control
//           as="textarea"
//           placeholder="Write something..."
//           value={postContent}
//           onChange={(e) => setPostContent(e.target.value)}
//         />



//         {/* Buttons */}
//         <div className="d-flex flex-column align-items-center mt-3">
//           {/* File Input */}
//           <input
//             type="file"
//             ref={fileInputRef}
//             style={{ display: "none" }}
//             accept="image/*"
//             onChange={handleImageSelect}
//           />



//           {/* Apply Crop Button */}
//           {showCropper && (
//             <Button
//               className="crp mt-2"
//               variant="success"
//               onClick={handleCrop}
//             >
//               <BsCrop /> Apply Crop
//             </Button>
//           )}
//         </div>

//         <div className="d-flex gap-3 mt-3">
//           {/* Choose Image Button */}
//           <Button
//             variant="outline-primary"
//             className="flex-fill"
//             onClick={() => fileInputRef.current.click()}
//           >
//             <FaCamera />
//           </Button>

//           {/* Choose Image Button */}
//           <Button
//             variant="outline-success"
//             className="flex-fill"
//             onClick={() => fileInputRef.current.click()}
//           >
//             <FaVideo />
//           </Button>

//           {/* Submit Button */}
//           <Button
//             variant="primary"
//             style={{ width: "100px" }}
//             className="flex-fill"
//             onClick={handleSubmit}
//             disabled={loading || (!postContent.trim())}
//           >
//             {loading ? (
//               <span>
//                 <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
//                 Posting...
//               </span>
//             ) : (
//               <>
//                 <BsFillSendFill /> Post
//               </>
//             )}
//           </Button>
//         </div>


//       </Card.Body>

//     </Card>
//   );
// };

// export default PostCreator;



//25/01/25 --12:15
// import React, { useState, useRef, useEffect } from 'react';
// import { Card, Button, Form, ToastContainer } from "react-bootstrap";
// import { BsCrop, BsFillSendFill } from "react-icons/bs";
// import { FaCamera, FaVideo } from "react-icons/fa";
// import Cropper from "react-cropper";
// import "cropperjs/dist/cropper.css";
// import { useWebSocket } from '../../Context/WebSocketProvider';


// const PostCreator = ({ onPostCreated }) => {
//   const [postContent, setPostContent] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [imageSrc, setImageSrc] = useState(null); // Original image
//   const [croppedImage, setCroppedImage] = useState(null); // Cropped image
//   const [videoSrc, setVideoSrc] = useState(null); // Video source
//   const [showCropper, setShowCropper] = useState(false); // Show/hide cropper
//   const cropperRef = useRef(null); // Ref for Cropper component
//   const fileInputRef = useRef(null); // Ref for file input
//   const videoInputRef = useRef(null); // Ref for video input
//   const { realTimeData, sendMessage } = useWebSocket();
//   const [showPostModal, setShowPostModal] = useState(false); // State to control the modal
//   const [uploadedFileType, setUploadedFileType] = useState(null); // 'image' or 'video'


//   useEffect(() => {
//     console.log("Real-time from post updates:", realTimeData);
//   }, [realTimeData]);

//   // Handle image selection
//   const handleImageSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (uploadedFileType === 'video') {
//         alert("You cannot upload both an image and a video.");
//         return;
//       }

//       // Allowed MIME types
//     const allowedTypes = ["image/jpeg", "image/png"];

//     if (!allowedTypes.includes(file.type)) {
//       alert("Only JPG and PNG files are allowed.");
//       return;
//     }
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setImageSrc(event.target.result);
//         setShowCropper(true); // Show cropper after selecting an image
//         setUploadedFileType('image'); // Set uploaded file type to image
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle video selection
//   const handleVideoSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (uploadedFileType === 'image') {
//         alert("You cannot upload both an image and a video.");
//         return;
//       }
//       const videoUrl = URL.createObjectURL(file); // Create a temporary video URL
//       setVideoSrc(videoUrl);
//       setUploadedFileType('video'); // Set uploaded file type to video
//       console.log("Video",videoUrl);

//     }
//   };








//   // Handle cropping
//   const handleCrop = () => {
//     const cropper = cropperRef.current?.cropper;
//     if (cropper) {
//       const croppedDataUrl = cropper.getCroppedCanvas({
//         width: 1920,
//         height: 1080,
//       }).toDataURL(); // Cropped image as base64
//       setCroppedImage(croppedDataUrl);
//       setImageSrc(croppedDataUrl); // Replace original image with cropped one
//       setShowCropper(false); // Hide cropper
//     }
//   };

//   // Handle post submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!postContent.trim()){
//       alert("Please type something for your post.");
//       return;
//     } 

//     // if (!imageSrc && !videoSrc) {
//     //   alert("Your post without any media");      
//     // } else if (imageSrc && !videoSrc){
//     //   alert("Your post with an Image");   
//     // } else if (!imageSrc && videoSrc){
//     //   alert("Your post with Vido");   
//     // }
//     setLoading(true);

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("Missing user authentication details.");

//       const formData = new FormData();
//       formData.append("content", postContent);

//       // Append cropped image as Blob
//       if (croppedImage) {
//         const blob = await fetch(croppedImage).then((res) => res.blob());
//         formData.append("userUpload", blob, "croppedImage.png");
//       }

//       // Append video file
//       if (videoSrc) {
//         const videoFile = videoInputRef.current.files[0];
//         formData.append("userUpload", videoFile, videoFile.name);
//       }

//       const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts`, {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       if (!response.ok) throw new Error("Failed to create post");

//       const newPost = await response.json();
//       onPostCreated(newPost); // Notify parent of the new post

//       setPostContent('');
//       setImageSrc(null);
//       setCroppedImage(null);
//       setVideoSrc(null);
//       setUploadedFileType(null); // Reset file type after successful post
//       setShowPostModal(false);
//     } catch (error) {
//       console.error("Error creating post:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (


//     <>
//     <Card style={{ width: "19rem" }}>
//       {/* Media Placeholder */}
//       {imageSrc && !showCropper && (
//         <Card.Img
//           variant="top"
//           src={imageSrc}
//           style={{  objectFit: "contain" }}
//           // style={{ maxHeight: "250px", objectFit: "contain" }}
//         />
//       )}
//       {videoSrc && (
//         <video
//           src={videoSrc}
//           controls
//           style={{ maxHeight: "250px", objectFit: "contain", width: "100%" }}
//         />
//       )}

//       {/* Cropper */}
//       {showCropper && (
//         <Cropper
//           src={imageSrc}
//           // style={{ height: 300, width: "100%" }}
//           style={{  width: "100%" }}
//           initialAspectRatio={16 / 10} // Aspect ratio of 400x250
//           guides={true}
//           viewMode={1}
//           dragMode="move"
//           cropBoxResizable={false}
//           cropBoxMovable={true}
//           autoCropArea={1}
//           background={false}
//           ref={cropperRef}
//         />
//       )}

//       <Card.Body>
//         {/* Textarea */}
//         <Form.Control
//           as="textarea"
//           required
//           placeholder="Write something..."
//           value={postContent}
//           onChange={(e) => setPostContent(e.target.value)}
//         />

//         {/* Buttons */}
//         <div className="d-flex flex-column align-items-center mt-3">
//           {/* File Inputs */}
//           <input
//             type="file"
//             ref={fileInputRef}
//             style={{ display: "none" }}
//             accept="image/*"
//             onChange={handleImageSelect}
//           />
//           <input
//             type="file"
//             ref={videoInputRef}
//             style={{ display: "none" }}
//             accept="video/*"
//             onChange={handleVideoSelect}
//           />

//           {/* Apply Crop Button */}
//           {showCropper && (
//             <Button className="crp mt-2" variant="success" onClick={handleCrop}>
//               <BsCrop /> Apply Crop
//             </Button>
//           )}
//         </div>

//         <div className="d-flex gap-3 mt-3">
//           {/* Choose Image Button */}
//           <Button
//             variant="outline-primary"
//             className="flex-fill"
//             onClick={() => fileInputRef.current.click()}
//             disabled={uploadedFileType === 'video'}
//           >
//             <FaCamera />
//           </Button>

//           {/* Choose Video Button */}
//           <Button
//             variant="outline-success"
//             className="flex-fill"
//             onClick={() => videoInputRef.current.click()}
//             disabled={uploadedFileType === 'image'}
//           >
//             <FaVideo />
//           </Button>

//           {/* Submit Button */}



//             <Button
//               id='postBtn'
//               variant="primary"
//               style={{ width: "100px" }}
//               className="flex-fill"
//               onClick={               
//                 handleSubmit
//               }
//               disabled={loading}
//             >
//               {loading ? (
//                 <span>
//                   <span
//                     className="spinner-border spinner-border-sm me-1"
//                     role="status"
//                     aria-hidden="true"
//                   ></span>
//                   Posting...
//                 </span>
//               ) : (
//                 <>
//                   <BsFillSendFill /> Post
//                 </>
//               )}
//             </Button>
//           </div>

//       </Card.Body>

//     </Card>


//     <ToastContainer />
//     </>
//   );
// };

// export default PostCreator;


import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Form, ToastContainer } from "react-bootstrap";
import { BsCrop, BsFillSendFill } from "react-icons/bs";
import { FaCamera, FaVideo } from "react-icons/fa";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useWebSocket } from '../../Context/WebSocketProvider';





const PostCreator = ({ onPostCreated }) => {
  const [postContent, setPostContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState(null); // Original image
  const [croppedImage, setCroppedImage] = useState(null); // Cropped image
  const [videoSrc, setVideoSrc] = useState(null); // Video source
  const [showCropper, setShowCropper] = useState(false); // Show/hide cropper
  const cropperRef = useRef(null); // Ref for Cropper component
  const fileInputRef = useRef(null); // Ref for file input
  const videoInputRef = useRef(null); // Ref for video input
  const { realTimeData, sendMessage } = useWebSocket();
  const [showPostModal, setShowPostModal] = useState(false); // State to control the modal
  const [uploadedFileType, setUploadedFileType] = useState(null); // 'image' or 'video'
  const [errorMessage, setErrorMessage] = useState(""); // Error message





  useEffect(() => {
    console.log("Real-time from post updates:", realTimeData);
  }, [realTimeData]);

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (uploadedFileType === 'video') {
        alert("You cannot upload both an image and a video.");
        return;
      }

      // Allowed MIME types
      const allowedTypes = ["image/jpeg", "image/png"];

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

      const MAX_SIZE_MB = 15;
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
    setVideoSrc(null);
    setUploadedFileType(null);
    
  };

  // const handleVideoSelect = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     if (uploadedFileType === "image") {
  //       setErrorMessage("You cannot upload both an image and a video.");
  //       resetInput();
  //       return;
  //     }
  
  //     const MAX_SIZE_MB = 30;
  //     const MAX_DURATION_SECONDS = 120; // 2 minutes
  //     const SMALL_FILE_SIZE_MB = 10;
  //     const SMALL_FILE_MAX_DURATION_SECONDS = 600; // 10 minutes
  
  //     // Check file size
  //     const fileSizeMB = file.size / (1024 * 1024);
  
  //     if (fileSizeMB > MAX_SIZE_MB) {
  //       setErrorMessage(`File size exceeds ${MAX_SIZE_MB} MB.`);
  //       resetInput();
  //       return;
  //     }
  
  //     // Check video duration
  //     const videoElement = document.createElement("video");
  //     videoElement.preload = "metadata";
  
  //     videoElement.onloadedmetadata = () => {
  //       window.URL.revokeObjectURL(videoElement.src); // Clean up URL object
  //       const duration = videoElement.duration; // Duration in seconds
  
  //       if (
  //         (fileSizeMB > SMALL_FILE_SIZE_MB && duration > MAX_DURATION_SECONDS) || // Large file duration check
  //         (fileSizeMB <= SMALL_FILE_SIZE_MB && duration > SMALL_FILE_MAX_DURATION_SECONDS) // Small file duration check
  //       ) {
  //         setErrorMessage(
  //           `Video duration exceeds the allowed limit. ${
  //             fileSizeMB > SMALL_FILE_SIZE_MB
  //               ? `Max duration: ${MAX_DURATION_SECONDS / 60} minutes for files larger than ${SMALL_FILE_SIZE_MB} MB.`
  //               : `Max duration: ${SMALL_FILE_MAX_DURATION_SECONDS / 60} minutes for files smaller than ${SMALL_FILE_SIZE_MB} MB.`
  //           }`
  //         );
  //         resetInput();
  //       } else {
  //         setVideoSrc(file);
  //         setUploadedFileType("video");
  //         setErrorMessage("");
  //       }
  //     };
  
  //     videoElement.onerror = () => {
  //       setErrorMessage("Unable to read video file. Please upload a valid video.");
  //       resetInput();
  //     };
  
  //     videoElement.src = URL.createObjectURL(file);
  //   }
  // };
  
  // const resetInput = () => {
  //   if (videoInputRef.current) {
  //     videoInputRef.current.value = null; // Reset the input field
  //   }
  //   setVideoSrc(null);
  //   setUploadedFileType(null);
  // };
  



  // Handle cropping
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

  // Handle post submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postContent.trim()) {
      alert("Please type something for your post.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Missing user authentication details.");

      const formData = new FormData();
      formData.append("content", postContent);

      // Append cropped image as Blob
      if (croppedImage) {
        const blob = await fetch(croppedImage).then((res) => res.blob());
        formData.append("userUpload", blob, "croppedImage.png");
      }

      // Append video file
      if (videoSrc) {
        const videoFile = videoInputRef.current.files[0];
        formData.append("userUpload", videoFile, videoFile.name);
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create post");

      const newPost = await response.json();
      onPostCreated(newPost); // Notify parent of the new post

      setPostContent('');
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

  return (


    <>
      <Card style={{ width: "19rem" }}>

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


        {/* Media Placeholder */}
        {imageSrc && !showCropper && (
          <Card.Img
            variant="top"
            src={imageSrc}
            style={{ objectFit: "contain" }}
          // style={{ maxHeight: "250px", objectFit: "contain" }}
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

        <Card.Body>
          {/* Textarea */}
          <Form.Control
            as="textarea"
            required
            placeholder="Write something..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />

          {/* Buttons */}
          <div className="d-flex flex-column align-items-center mt-3">
            {/* File Inputs */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageSelect}
            />
            <input
              type="file"
              ref={videoInputRef}
              style={{ display: "none" }}
              accept="video/*"
              onChange={handleVideoSelect}
            />

            {/* Apply Crop Button */}
            {showCropper && (
              <Button className="crp mt-2" variant="success" onClick={handleCrop}>
                <BsCrop /> Apply Crop
              </Button>
            )}
          </div>

          <div className="d-flex gap-3 mt-3">
            {/* Choose Image Button */}
            <Button
              variant="outline-primary"
              className="flex-fill"
              onClick={() => fileInputRef.current.click()}
              disabled={uploadedFileType === 'video'}
            >
              <FaCamera />
            </Button>

            {/* Choose Video Button */}
            <Button
              variant="outline-success"
              className="flex-fill"
              onClick={() => videoInputRef.current.click()}
              disabled={uploadedFileType === 'image'}
            >
              <FaVideo />

            </Button>

            {/* Submit Button */}



            <Button
              id='postBtn'
              variant="primary"
              style={{ width: "100px" }}
              className="flex-fill"
              onClick={
                handleSubmit
              }
              disabled={loading}
            >
              {loading ? (
                <span>
                  <span
                    className="spinner-border spinner-border-sm me-1"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Posting...
                </span>
              ) : (
                <>
                  <BsFillSendFill /> Post
                </>
              )}
            </Button>
          </div>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        </Card.Body>

      </Card>
    </>
  );
};

export default PostCreator;




