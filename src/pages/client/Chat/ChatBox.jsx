import { useState, useEffect, useRef } from "react";
import {
    MessageFilled,
    CloseOutlined,
    SendOutlined,
    CustomerServiceOutlined
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useSocket } from "../../../Socket/useSocket";
import "./ChatBox.scss";

function ChatBox({ room_chat_id }) {
    const socket = useSocket();
    const [openChat, setOpenChat] = useState(false);
    const [chatMessage, setChatMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [typing, setTyping] = useState([]);
    const userId = useSelector((state) => state.authClient.user?._id);
    const fullname = useSelector((state) => state.authClient.user?.fullname);
    const [manager, setManager] = useState("")

    // Gửi roomId lên server ngay khi ID tồn tại
    useEffect(() => {
        if (room_chat_id && socket) {
            socket.emit("client_join_room", { roomId: room_chat_id, sender: "user" });

            socket.on("server_return_room_data", (data) => {
                setMessages(data.message)
                setManager(data.admin)
            });

            socket.on("server_send_message", (newMsg) => {
                setMessages((prev) => [...prev, newMsg]);
            });
        }

        return () => {
            socket.off("server_return_room_data");
            socket.off("server_send_message");
        };
    }, [room_chat_id, socket]);

    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, openChat]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!chatMessage.trim() || !room_chat_id) return;

        const msgData = {
            roomId: room_chat_id,
            text: chatMessage,
            sender: "user", // Phân biệt người gửi
            timestamp: new Date()
        };

        // Gửi lên server
        socket.emit("client_send_message", msgData);

        setChatMessage("");
    };


    const typingTimeoutRef = useRef(null);

    const handleInputChange = (e) => {
        setChatMessage(e.target.value)
        if (!socket || !room_chat_id || !userId) return;
        socket.emit("client_typing", { roomId: room_chat_id, userId: userId, typing: true, sender: "user" });

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("client_typing", { roomId: room_chat_id, userId: userId, typing: false, sender: "user" });
        }, 1000);

        socket.on("server_show_typing", (data) => {
            setTyping(data);
        });

    }


    return (
        <div className={`chat-wrapper ${openChat ? "active" : ""}`}>
            {openChat && (
                <div className="chat-box">
                    <div className="chat-header">
                        <div className="header-info">
                            <CustomerServiceOutlined />
                            <span>{manager}</span>
                        </div>
                        <CloseOutlined className="close-icon" onClick={() => setOpenChat(false)} />
                    </div>

                    <div className="chat-content">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message-item ${msg.sender}`}>
                                <div className="text">{msg.text}</div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <div className="typing-indicator">
                        {typing.typing && typing.userId !== userId ? (
                            <div className="typing-content">
                                <span className="user-name">Mèo con</span> đang nhập
                                <div className="dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        ) : ""}
                    </div>
                    <form className="chat-footer" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder="Nhập tin nhắn..."
                            value={chatMessage}
                            onChange={handleInputChange}
                        />
                        <button type="submit" disabled={!chatMessage.trim()}>
                            <SendOutlined />
                        </button>
                    </form>
                </div>
            )}

            <button className="chat-toggle-btn" onClick={() => setOpenChat(!openChat)}>
                {openChat ? <CloseOutlined /> : <MessageFilled />}
            </button>
        </div>
    );
}

export default ChatBox;