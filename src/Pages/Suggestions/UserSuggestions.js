// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Select,
//   MenuItem,
//   Card,
//   CardContent,
//   Chip,
//   Avatar,
//   IconButton,
//   Divider,
//   InputLabel,
// } from "@mui/material";
// import { FaRegThumbsUp } from "react-icons/fa";
// import { IoMdSend } from "react-icons/io";
// import { ImAttachment } from "react-icons/im";

// const UserSuggestions = () => {

//   // Form state
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     type: "feature",
//     communitySubType: "", // New field for sub-category
//     title: "",
//     description: "",
//   });

//   // Suggestions list (mock data)
//   const [suggestions, setSuggestions] = useState([
//     {
//       id: 1,
//       name: "User123",
//       type: "feature",
//       title: "Dark Mode",
//       description: "Please add a dark theme option.",
//       upvotes: 24,
//       status: "under_review",
//     },
//     {
//       id: 2,
//       name: "Community",
//       type: "bug",
//       title: "Login Issue",
//       description: "The login button doesn’t work on mobile.",
//       upvotes: 15,
//       status: "planned",
//     },
//   ]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const newSuggestion = {
//       id: suggestions.length + 1,
//       name: formData.name || "Anonymous",
//       type: formData.type,
//       title: formData.title,
//       description: formData.description,
//       upvotes: 0,
//       status: "new",
//     };
//     setSuggestions([...suggestions, newSuggestion]);
//     setFormData({ ...formData, title: "", description: "", communitySubType: "" }); // Reset form
//   };

//   const handleUpvote = (id) => {
//     setSuggestions(
//       suggestions.map((suggestion) =>
//         suggestion.id === id
//           ? { ...suggestion, upvotes: suggestion.upvotes + 1 }
//           : suggestion
//       )
//     );
//   };
//   return (


//      <Box sx={{ maxWidth: 800, margin: "auto", p: 3 }}>
//       {/* Header */}
//       <Typography variant="h4" gutterBottom>
//         Share Your Ideas
//       </Typography>
//       <Typography color="text.secondary" align="center" gutterBottom>
//         Your feedback will help us improve! Suggest new features, report bugs, or share your ideas to build a sustainable society, making India a stronger nation.
//       </Typography>

//       {/* Submission Form */}
//       <Card variant="outlined" sx={{ mb: 4, p: 2 }}>
//         <CardContent>
//           <Typography variant="h6" gutterBottom>
//             Submit a Suggestion
//           </Typography>
//           <form onSubmit={handleSubmit}>
//             <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
//               <TextField
//                 name="name"
//                 label="Name (Optional)"
//                 value={formData.name}
//                 onChange={handleChange}
//                 fullWidth
//               />
//               <TextField
//                 name="email"
//                 label="Email (Optional)"
//                 value={formData.email}
//                 onChange={handleChange}
//                 fullWidth
//               />
//             </Box>
//             <Select
//               name="type"
//               value={formData.type}
//               onChange={handleChange}
//               fullWidth
//               sx={{ mb: 2 }}
//             >
//               <MenuItem value="feature">Feature Request</MenuItem>
//               <MenuItem value="bug">Bug Report</MenuItem>
//               <MenuItem value="community">Community Idea</MenuItem>
//             </Select>

//             {/* Conditional: Community Sub-Type Dropdown */}
//         {formData.type === "community" && (
//           <>
//             <InputLabel>Community Focus on</InputLabel>
//             <Select
//               name="communitySubType"
//               value={formData.communitySubType}
//               onChange={handleChange}
//               label="Community Focus on"
//               required
//               fullWidth
//               sx={{ mb: 2 }}
//             >
//               <MenuItem value="youth">Youth Empowerment</MenuItem>
//               <MenuItem value="women">Women Empowerment</MenuItem>
//               <MenuItem value="ews">Betterment of Economic Weaker Section</MenuItem>
//             </Select>
//             </>

//         )}







//             <TextField
//               name="title"
//               label="Suggestion Title"
//               value={formData.title}
//               onChange={handleChange}
//               fullWidth
//               required
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               name="description"
//               label="Detailed Description"
//               value={formData.description}
//               onChange={handleChange}
//               multiline
//               rows={4}
//               fullWidth
//               required
//               sx={{ mb: 2 }}
//             />
//             <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//               <Button startIcon={<ImAttachment />}>Attach File</Button>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 endIcon={<IoMdSend />}
//               >
//                 Submit
//               </Button>
//             </Box>
//           </form>
//         </CardContent>
//       </Card>

//       {/* Public Suggestion Board */}
//       <Typography variant="h5" gutterBottom>
//         Community Suggestions
//       </Typography>
//       <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
//         <Chip label="All" clickable />
//         <Chip label="Feature Requests" clickable />
//         <Chip label="Bugs" clickable />
//       </Box>

//       {suggestions.map((suggestion) => (
//         <Card key={suggestion.id} variant="outlined" sx={{ mb: 2 }}>
//           <CardContent>
//             <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//               <Typography variant="h6">{suggestion.title}</Typography>
//               <Chip
//                 label={
//                   suggestion.status === "under_review"
//                     ? "Under Review"
//                     : suggestion.status === "planned"
//                     ? "Planned"
//                     : "New"
//                 }
//                 color={
//                   suggestion.status === "under_review"
//                     ? "warning"
//                     : suggestion.status === "planned"
//                     ? "success"
//                     : "default"
//                 }
//               />
//             </Box>
//             <Typography color="text.secondary" gutterBottom>
//               by {suggestion.name} • {suggestion.type}
//             </Typography>
//             <Typography paragraph>{suggestion.description}</Typography>
//             <Box sx={{ display: "flex", alignItems: "center" }}>
//               <IconButton onClick={() => handleUpvote(suggestion.id)}>
//                 <FaRegThumbsUp />
//               </IconButton>
//               <Typography>{suggestion.upvotes}</Typography>
//             </Box>
//           </CardContent>
//         </Card>
//       ))}
//       <div>
//         <Typography variant="body2" color="text.secondary" align="center">
//           No more suggestions to show.
//         </Typography>
//       </div>
//     </Box>
//   )
// }

// export default UserSuggestions





import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Card,
  CardContent,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Modal,
  Fab,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { FaRegThumbsUp } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { ImAttachment } from "react-icons/im";
import { IoClose, IoAdd } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import { BsPlusCircle } from "react-icons/bs";
import { FaPaperclip } from 'react-icons/fa';

const UserSuggestions = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "feature",
    communitySubType: "",
    title: "",
    description: "",
    attachment: null
  });

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const fileInputRef = useRef(null);
  const [userName, setUserName] = useState("");
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const name = decoded.updateFullName || decoded.displayName || decoded.username;
        setUserName(name);
        setFormData(prev => ({ ...prev, name }));
      } catch (error) {
        console.error("Token decoding failed:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/suggestion`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setSuggestions(data.suggestions || data); // Handle both formats
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, []);


  const toggleDescription = (id) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };


  const handleAttachmentClick = (attachment) => {
    setSelectedAttachment(attachment);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      setFileType("image");
      setFilePreview(URL.createObjectURL(file));
    } else if (file.type.startsWith("video/")) {
      setFileType("video");
      setFilePreview(URL.createObjectURL(file));
    } else {
      alert("Please upload only images or videos");
      return;
    }

    setFormData({ ...formData, attachment: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("email", formData.email);
    formPayload.append("type", formData.type);
    formPayload.append("title", formData.title);
    formPayload.append("description", formData.description);

    if (formData.type === "community") {
      formPayload.append("communitySubType", formData.communitySubType);
    }

    if (formData.attachment) {
      formPayload.append("attachment", formData.attachment);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/suggestion`, {
        method: "POST",
        body: formPayload,
      });

      if (!response.ok) throw new Error("Submission failed");
      const newSuggestion = await response.json();

      setSuggestions(prev => [...prev, newSuggestion]);
      resetForm();
      setOpenModal(false);
    } catch (error) {
      console.error("Error submitting suggestion:", error);
      alert("Failed to submit suggestion. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/suggestion/${id}/upvote`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) throw new Error("Upvote failed");

      setSuggestions(prev => prev.map(suggestion =>
        suggestion._id === id
          ? { ...suggestion, upvotes: (suggestion.upvotes || 0) + 1 }
          : suggestion
      ));
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: userName || "",
      email: "",
      type: "feature",
      communitySubType: "",
      title: "",
      description: "",
      attachment: null
    });
    setFilePreview(null);
    setFileType(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "under-review": return "warning";
      case "planned": return "info";
      case "achieved": return "success";
      default: return "default";
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Community Suggestions
      </Typography>
      <Typography color="text.secondary" align="center" gutterBottom>
        Share your ideas to help us improve the platform and build a sustainable society.
      </Typography>

      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setOpenModal(true)}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <BsPlusCircle size={24} />
      </Fab>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 600 },
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Submit Your Suggestion</Typography>
            <IconButton onClick={() => setOpenModal(false)}>
              <IoClose />
            </IconButton>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              name="name"
              label="Your Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />

            <TextField
              name="email"
              label="Email (Optional)"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Suggestion Type *</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Suggestion Type *"
                required
              >
                <MenuItem value="feature">Feature Request</MenuItem>
                <MenuItem value="bug">Bug Report</MenuItem>
                <MenuItem value="community">Community Idea</MenuItem>
              </Select>
            </FormControl>

            {formData.type === "community" && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Community Focus *</InputLabel>
                <Select
                  name="communitySubType"
                  value={formData.communitySubType}
                  onChange={handleChange}
                  label="Community Focus *"
                  required
                >
                  <MenuItem value="youth">Youth Empowerment</MenuItem>
                  <MenuItem value="women">Women Empowerment</MenuItem>
                  <MenuItem value="ews">Economic Weaker Section</MenuItem>
                </Select>
              </FormControl>
            )}

            <TextField
              name="title"
              label="Suggestion Title *"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />

            <TextField
              name="description"
              label="Detailed Description *"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
              margin="normal"
              required
            />

            {/* File upload */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*, video/*"
              style={{ display: 'none' }}
            />

            <Button
              variant="outlined"
              startIcon={<ImAttachment />}
              onClick={() => fileInputRef.current.click()}
              sx={{ mt: 2 }}
            >
              Attach File (Image/Video)
            </Button>

            {filePreview && (
              <Box sx={{ mt: 2 }}>
                {fileType === "image" ? (
                  <img
                    src={filePreview}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: 200 }}
                  />
                ) : (
                  <video
                    src={filePreview}
                    controls
                    style={{ maxWidth: '100%', maxHeight: 200 }}
                  />
                )}
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                endIcon={<IoMdSend />}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      {loading && suggestions.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ mt: 4 }}>
          {suggestions?.map((suggestion) => (
            <Card key={suggestion?._id} sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">{suggestion?.title || "Untitled Suggestion"}</Typography>
                  <Chip
                    label={
                      suggestion?.status === "under-review" ? "Under Review" :
                        suggestion?.status === "planned" ? "Planned" :
                          suggestion?.status === "achieved" ? "Implemented" : "New"
                    }
                    color={getStatusColor(suggestion?.status)}
                    size="small"
                  />
                </Box>

                <Typography color="text.secondary" sx={{ mb: 1 }}>
                  by {suggestion?.name || "Anonymous"} • {new Date(suggestion?.createdAt).toLocaleDateString()}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>


                  {suggestion?.type === "community" && suggestion?.communitySubType && (
                    <Chip
                      label={
                        suggestion.communitySubType === "youth" ? "Youth Empowerment" :
                          suggestion.communitySubType === "women" ? "Women Empowerment" :
                            "Economic Weaker Section"
                      }
                      variant="outlined"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  )}


                </Box>

                {/* <Typography sx={{ mb: 2 }}>
                  {suggestion?.description}
                </Typography> */}
                <Box>
                  <Typography
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: expandedDescriptions[suggestion._id] ? 'unset' : 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      cursor: 'pointer'
                    }}
                    onClick={() => toggleDescription(suggestion._id)}
                  >
                    {suggestion?.description}
                  </Typography>
                  {suggestion?.description?.length > 80 && (
                    <Box display="flex" justifyContent="flex-end">
                      <Button

                        size="small"
                        onClick={() => toggleDescription(suggestion._id)}
                        sx={{ mt: -1, mb: 1 }}
                      >
                        {expandedDescriptions[suggestion._id] ? 'Read Less' : 'Read More'}
                      </Button>
                    </Box>
                  )}
                </Box>

                {/* {suggestion?.attachment && (
                  suggestion.attachment.includes("image") ? (
                    <img
                      src={suggestion.attachment}
                      alt="Suggestion attachment"
                      style={{ maxWidth: '100%', maxHeight: 300, marginBottom: 2, justifyContent: 'center' }}
                    />
                  ) : (
                    <video
                      src={suggestion.attachment}
                      controls
                      style={{ maxWidth: '100%', maxHeight: 300, marginBottom: 2 }}
                    />
                  )
                )} */}

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2
                  }}
                >

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={() => handleUpvote(suggestion?._id)}>
                      <FaRegThumbsUp />
                    </IconButton>
                    <Typography>{suggestion?.upvotes || 0}</Typography>
                  </Box>



                  <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {/* Attachment Icon */}
                    {suggestion?.attachment && (
                      <>
                        <Tooltip title="View Attachment" arrow>
                          <IconButton
                            onClick={() => handleAttachmentClick(suggestion.attachment)}
                            sx={{ ml: -1, color: 'primary.main' }}
                          >
                            <FaPaperclip />
                          </IconButton>
                        </Tooltip>

                        <Dialog
                          open={openDialog}
                          onClose={handleCloseDialog}
                          maxWidth="md"
                          fullWidth
                        >
                          <DialogTitle>Attachment Preview</DialogTitle>
                          <DialogContent sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '300px'
                          }}>
                            {selectedAttachment?.includes("image") ? (
                              <img
                                src={selectedAttachment}
                                alt="Attachment"
                                style={{
                                  maxWidth: '100%',
                                  maxHeight: '80vh',
                                  objectFit: 'contain'
                                }}
                              />
                            ) : (
                              <video
                                src={selectedAttachment}
                                controls
                                style={{
                                  maxWidth: '100%',
                                  maxHeight: '80vh',
                                  outline: 'none'
                                }}
                                autoPlay
                              />
                            )}
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleCloseDialog}>Close</Button>
                          </DialogActions>
                        </Dialog>
                      </>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default UserSuggestions;