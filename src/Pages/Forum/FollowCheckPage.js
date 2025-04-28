
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button, Card,  Container, Row, Col, Form,   Pagination} from "react-bootstrap";
import { useWebSocket } from "../../Context/WebSocketProvider";
import AuthContext from "../../Context/AuthContext";
import { GoVerified } from "react-icons/go";
import LoadingSpinner from "../../Components/Common/LoadingSpinner";
import ConfirmationModal from "../../Components/Common/ConfirmationModal";
import { FaOm } from "react-icons/fa";

import { FaCirclePlus } from "react-icons/fa6";



const FollowCheckPage = ({ broadcastEvent }) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("");
  const [filterActiveUsers, setFilterActiveUsers] = useState(false);
  const [redirected, setRedirected] = useState(false);
  const [showForumBtn, setShowForumBtn] = useState(false);
  const [followedMinUsers, setFollowedMinUsers] = useState(false);
  const [note, setNote] = useState(false);



  const navigate = useNavigate();
  const { sendMessage } = useWebSocket();
  const { user } = useContext(AuthContext);
  const currentUserID = user?.id;

  // ✅ Fetch users from backend
  const fetchUsers = async (page) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");

      const params = new URLSearchParams({
        page,
        limit: 6,
      });
      if (search && searchField) {
        params.append('search', search);
        params.append('searchField', searchField);
      }


      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/user/userSuggestions/followOpt?${params}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("data user", data.users);

      let fetchedUsers = data.users;

      // Optional: Sort by active if toggle is on
      if (filterActiveUsers) {
        fetchedUsers = fetchedUsers.sort((a, b) => b.isActive - a.isActive);
      }

      setUsers(fetchedUsers);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, filterActiveUsers]);

  useEffect(() => {
    const checkFollower = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found.");

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/user/follow/status`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const { followedCount } = await response.json(); // Destructure followedCount
          if (followedCount >= 5) {
            setFollowedMinUsers(true)
          } else {
            setNote(true)
          }
        } else {
          throw new Error("Failed to fetch follow status.");
        }

      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }
    checkFollower()

  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers(1);
    setSearch("");
    setSearchField("");
  };

  const handleFilterChange = (isChecked) => {
    setFilterActiveUsers(isChecked);
  };

  const handleFollowToggle = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/user/${userId}/follow/send-back-userSuggestions`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        if (data.redirect) {
          setRedirected(true)
          alert(data.message);
          //window.location.href = data.redirect; // Redirect to the forum page

        }
        // Broadcast updated suggestions to WebSocket listeners
        sendMessage("userSuggestionFollowStatus", data.users);
        setUsers(data.users);



      } else {
        console.error("Failed to follow/unfollow:", data.message);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  const handleProfileUpdateConfirm = () => {
    setRedirected(false);
    navigate(`/forum`, { replace: true });
  };

  const handleProfileUpdateCancel = () => {
    setRedirected(false);
    setShowForumBtn(true);
    fetchUsers(currentPage)
    setNote(false)
  };



  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <Container>
      <div className="mt-3 text-center">
        <h2 className="herO fw-bold p-2">
          Find <FaOm className="mb-2" /> Users
        </h2>
        {note ? <p className="fw-bold">You need to follow at least 5 users to proceed.</p> : ""}
      </div>


      <div className="my-3">
        <Row className="mb-3 justify-content-center">
          {/* Search Form Row */}
          <Col xs={12} md={6}>
            <Form className="d-flex align-items-center" onSubmit={handleSearch}>
              <Form.Control
                type="text"
                placeholder="Search..."
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
                <option value="updateFullName">Full Name</option>
                <option value="city">City</option>
                <option value="state">State</option>
                <option value="PIN">Pin</option>
                <option value="hobby">Interest</option>
              </Form.Select>
              <Button type="submit" variant="primary"> Search</Button>

            </Form>
          </Col>

          {/* Buttons and Switches Row */}
          <Col xs={12} md={6} >
            <div className="c-ds">
              {(showForumBtn || followedMinUsers) && (
                <div
                  onClick={() => { navigate(`/forum`, { replace: true }); }}
                  className="me-3 mb-2 fw-bold" title="Go to Forum"
                  style={{ cursor: "pointer" }}
                >
                  <FaOm className="fw-bold" />
                </div>
              )}

              <Form.Check
                type="switch"
                id="active-users-first"
                label="Active Users First"
                onChange={(e) => handleFilterChange(e.target.checked)}
                checked={filterActiveUsers}
              />
            </div>
          </Col>
        </Row>
      </div>



      <Row className="mt-4">
        {users?.length > 0 ? users.map((user) => (
          <Col key={user._id} sm={12} md={6} lg={4} className="mb-3">
            <Card className={filterActiveUsers && user.isActive ? "border border-primary shadow" : ""}
            >
              <Card.Body className="d-flex align-items-center">
                <img
                  src={user.userImage || "/avatar.png"}
                  alt={user.updateFullName || user.username || user.displayName}
                  className="rounded-circle me-3"
                  style={{ width: "60px", height: "60px" }}
                />
                <div className="flex-grow-1">
                  <Card.Title>{user.updateFullName || user.displayName}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    <small>
                      @{user.username}{" "}
                      {user?.isProfileCompleted && <GoVerified className="ms-1" />}
                    </small>
                  </Card.Subtitle>
                  <Card.Text>
                    <small><strong>Status:</strong> {user.isActive ? "Active" : "Inactive"}</small><br />
                    <small><strong>Interest:</strong> {user.hobby || "N/A"}</small><br />
                    <small>{user.followers.length || 0} Followers</small>
                  </Card.Text>
                </div>
                <Button
                  variant={user.isFollowed ? "success" : "primary"}
                  onClick={() => handleFollowToggle(user._id)}
                  disabled={loading}
                >
                  {user.isFollowed ? "Unfollow" : "Follow"}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        )) : (
          <p className="text-center">No users found{search && ` for "${search}"`}.</p>
        )}
      </Row>

      <Pagination className="d-flex justify-content-center mt-3">
        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} />
        {[...Array(totalPages).keys()].map((number) => (
          <Pagination.Item
            key={number + 1}
            active={currentPage === number + 1}
            onClick={() => setCurrentPage(number + 1)}
          >
            {number + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>
      <ConfirmationModal
        isOpen={redirected}
        onClose={handleProfileUpdateCancel}
        onConfirm={handleProfileUpdateConfirm}
        title={`Post on 'Om' Access Granted`}
        message={<>Redirecting to the 'Om' <FaOm className="mb-1" /> page. Note: You can now edit Post by clicking <FaCirclePlus /> symbol.</>}
        confirmText={<>Say 'Om' <FaOm className="mb-1" /> </>}
        cancelText={`Find 'Om' User`}
      />
    </Container>

  );
};

export default FollowCheckPage;

