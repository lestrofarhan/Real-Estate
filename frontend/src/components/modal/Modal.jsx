import { useState } from "react";
import "./modal.scss";
import apiRequest from "../../lib/apiRequest";
import { socketContext } from "../../context/SocketContext";
import { useContext } from "react";

function Modal({ onClose, recieverId }) {
  const [message, setMessage] = useState("");
  const { socket } = useContext(socketContext);

  const handleSubmit = async () => {
    const text = message.trim();
      if (!text) return;
      
      try {
          const chat = await apiRequest.post("/chats", { receiverId: recieverId });
          console.log(chat);
          const messageRes = await apiRequest.post("/messages/" + chat.data.id, { text });
          socket.emit("sendMessage", {
            recieverId: recieverId,
            data: messageRes.data,
          });
            onClose();

      }catch(err) {
          console.log(err);
      }
  };
  return (
    <div className="messageModalOverlay" onClick={onClose}>
      <div className="messageModal" onClick={(e) => e.stopPropagation()}>
        <div className="messageModalTop">
          <h2>Send a Message</h2>
          <button className="closeBtn" type="button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="messageModalBody">
          <p>Start the conversation with the property owner from here.</p>
          <textarea
            placeholder="Write your message..."
            rows="6"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSubmit} type="button" className="sendBtn">
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
