import {  Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


const PostCard = ({ post, currentUser, postCreator }) => {
    const navigate = useNavigate();
    const user = postCreator; 
    
    console.log("post caud", user);


   


    return (
        <div
            className="border rounded p-3 mb-3 bg-white shadow-sm"
            // onClick={() => navigate(`/profile/${user._id}/post/${post._id}`)}
            style={{ cursor: "pointer" }}
        >
            <div className="d-flex align-items-center mb-2">
                <Image
                    src={user?.userImage || "/avatar.png"}
                    roundedCircle
                    width={40}
                    height={40}
                    alt="User Avatar"
                    style={{ objectFit: "cover" }}
                />
                <div className="ms-2">
                    <strong>
                        {user?.updateFullName || user?.displayName || user?.username || "Unknown User"}
                    </strong>
                    <div className="text-muted" style={{ fontSize: "12px" }}>
                        {new Date(post.createdAt).toLocaleString()}
                    </div>
                </div>                
            </div>

            <div className="mt-2">
                <h5>{post.title}</h5>
                <p className="text-muted">{post.content?.slice(0, 100)}...</p>
            </div>
        </div>
    );
};

export default PostCard;
