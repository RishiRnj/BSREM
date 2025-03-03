// import React from "react";
// import { useNavigate } from "react-router-dom";
// import Badge from 'react-bootstrap/Badge';

// const FollowCheckPage = () => {
//   const navigate = useNavigate();

//   return (
//     <div>
//         <div className="mt-3">
//               <h2 className="text-center"> <Badge bg="secondary">You need to follow at least 5 users to proceed.</Badge></h2>
//         </div>
//     </div>
//   );
// };

// export default FollowCheckPage;


import React, { useEffect, useState, useContext } from "react";
import { data, useNavigate } from "react-router-dom";
import { Button, Card, Badge, Container, Row, Col, Form, InputGroup, Spinner, Pagination } from "react-bootstrap";
import { useWebSocket } from "../../Context/WebSocketProvider";
import AuthContext from "../../Context/AuthContext";
// import PaginationControls from "./PaginationControls";

const FollowCheckPage = ({ broadcastEvent }) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [filters, setFilters] = useState({ city: "", state: "", hobby: "", ageGroup: "" });  
  const navigate = useNavigate();
  const { sendMessage } = useWebSocket();
  const { user } = useContext(AuthContext);
  const currentUserID = user?.id;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterActiveUsers, setFilterActiveUsers] = useState(false);
  const [search, setSearch] = useState("");
const [searchField, setSearchField] = useState("");

  const handleFilterChange = (isChecked) => {
    setFilterActiveUsers(isChecked);

    if (isChecked) {
      // Sort users by active status
      const sortedUsers = [...users].sort((a, b) => {
        if (a.isActive && !b.isActive) return -1;
        if (!a.isActive && b.isActive) return 1;
        return 0;
      });
      setUsers(sortedUsers);
      console.log("check active");

    } else {
      // Reset to the original order
      fetchUsers();
    }
  };



  // Fetch users on initial load
  const fetchUsers = async (page) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found.');

      const params = new URLSearchParams({
        page,
        limit: 6,
        search: search || "", // Fallback to empty string if undefined
      searchField: searchField || "",
      }).toString();

      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/userSuggestions/followOpt?page=${page}&limit=6`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setUsers(data.users);
      console.log(data.users);

      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {

    fetchUsers(currentPage);
  }, [currentPage]);


  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   setCurrentPage(1); // Start search from page 1
  //   console.log("hit src");
    
  //   fetchUsers(1);
  // };
  

  //   // Handle follow/unfollow
  const handleFollowToggle = async (userId) => {
    try {
      //setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");

      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}/follow/send-back-userSuggestions`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {

        if (data.redirect) {
          alert(data.message);
          window.location.href = data.redirect; // Redirect to the forum page
        } else {
          // Broadcast updated suggestions to WebSocket listeners
        sendMessage("userSuggestionFollowStatus", data.users);

        // Update the local state with the latest suggestions from the backend
        setUsers(data.users);

        console.log("Follow/unfollow updated and suggestions fetched:", data);

        }
        
      } else {
        console.error("Failed to follow/unfollow:", data.message);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
    // finally {
    //   setLoading(false);
    // }
  };







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
    <Container>
      <div className="mt-3">
        <h2 className="text-center">
          <Badge bg="secondary">You need to follow at least 5 users to proceed.</Badge>
        </h2>
      </div>
      <div className="d-flex flex-row-reverse bd-highlight mb-3">

        {/* <div>
          <Form className="mb-4 d-flex align-items-center" onSubmit={handleSearch}>
            <Form.Control
              type="text"
              placeholder="Enter search term"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="me-2"
            />
            <Form.Select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="me-2"
            >
              <option value="">Select Filter</option>
              <option value="username">Username</option>
              <option value="displayName">Display Name</option>
              <option value="updateFullName">Updated Full Name</option>
              <option value="city">City</option>
              <option value="state">State</option>
              <option value="PIN">Pin</option>
              <option value="hobby">Hobby</option>
              <option value="occupation">Occupation</option>
            </Form.Select>
            <Button type="submit" variant="primary">Search</Button>
          </Form>

        </div> */}
        <Form.Check
          type="switch"
          id="active-users-first"
          label="Active Users First"
          onChange={(e) => handleFilterChange(e.target.checked)}
        />

      </div>

      {/* User Cards */}
      <div className="">
        <Row className="mt-4">
        {users.length > 0 ? (
          users.map((user) => (
            <Col key={user._id} sm={12} md={6} lg={4} className="mb-3">
              <Card>
                <Card.Body className="d-flex align-items-center">
                  <img
                    src={user.userImage || "/default-avatar.png"}
                    alt={user.username || user.updateFullName || user.displayName}
                    title={user.username || user.updateFullName || user.displayName}
                    className="rounded-circle me-3"
                    style={{ width: "60px", height: "60px" }}
                  />
                  <div className="flex-grow-1">
                    <Card.Title>{user.updateFullName}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
                    <Card.Text>

                      <small><strong>Status :</strong>  {user.isActive ? "Active User" : "Inactive User"}</small><br></br>
                      <small><strong>Interest :</strong> {user.hobby || "No hobbies listed"}</small><br></br>


                      <small>{user.followers.length || 0} Followers </small>



                    </Card.Text>
                  </div>

                  <Button
                    variant={user.isFollowed ? 'success' : 'primary'}
                    onClick={() => handleFollowToggle(user._id)}
                    disabled={loading} // Optional: Disable the button during the follow/unfollow action
                  >
                    {user.isFollowed ? 'Unfollow' : 'Follow'}
                  </Button>



                </Card.Body>
              </Card>
            </Col>
          ))) : (
            <p className="text-center">No users found.</p>
          )}

        </Row>

      </div>


      <Pagination className="d-flex justify-content-center">
        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />

        {[...Array(totalPages).keys()].map((number) => (
          <Pagination.Item
            key={number + 1}
            active={currentPage === number + 1}
            onClick={() => setCurrentPage(number + 1)}
          >
            {number + 1}
          </Pagination.Item>
        ))}

        <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>
      
    </Container>
  );
};

export default FollowCheckPage;
