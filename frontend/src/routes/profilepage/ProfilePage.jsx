import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

function ProfilePage() {
  const data = useLoaderData();
  console.log(data);
  const { updateUser, currentUser } = useContext(AuthContext);
  const [focused, setFocused] = useState(null);

  const SkeletonInfo = () => (
    <div className="skeleton info-skeleton">
      <div className="avatar" />
      <div className="lines">
        <div className="line short" />
        <div className="line long" />
        <div className="line medium" />
      </div>
    </div>
  );

  const SkeletonList = ({ count = 4 }) => (
    <div className="skeleton list-skeleton">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`skeleton-card ${focused === i ? "focused" : ""}`}
          onClick={() => setFocused(focused === i ? null : i)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") setFocused(focused === i ? null : i);
          }}
        >
          <div className="thumb" />
          <div className="lines">
            <div className="line short" />
            <div className="line long" />
          </div>
        </div>
      ))}
    </div>
  );

  const SkeletonChat = () => (
    <div className="skeleton chat-skeleton">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="chat-line" />
      ))}
    </div>
  );

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img src={currentUser.avatar || "noavatar.jpg"} alt="" />
            </span>
            <span>
              Username: <b>{currentUser.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.email}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <div className="title">
            <h1>My List</h1>
            <Link to="/add">
              <button>Create New Post</button>
            </Link>
          </div>
          <Suspense fallback={<SkeletonList />}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => <List posts={postResponse.data.userPosts} />}
            </Await>
          </Suspense>
          <div className="title">
            <h1>Saved List</h1>
          </div>
          <Suspense fallback={<SkeletonList />}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => <List posts={postResponse.data.savedPosts} />}
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
          <Suspense fallback={<SkeletonChat />}>
            <Await
              resolve={data.chatResponse}
              errorElement={<p>Error loading chats!</p>}
            >
              {(chatResponse) => <Chat chats={chatResponse.data} />}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
