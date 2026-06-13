import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Avatar, Dropdown, Switch, Tooltip } from 'antd';
import { CloseOutlined, SendOutlined, MenuOutlined, AudioOutlined, AudioMutedOutlined, SoundOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import BotAIAvatar from '../../../assets/banner/bot-ai.jpg';
import AiGianDu from '../../../assets/banner/ai-gian-du.jpg';
import './AdminChatbot.scss';
import { askAdminAI, getAdminChatHistory } from '../../../services/admin/ai.service';
import { getSystemConfig } from '../../../services/admin/system.service';
import TypingAnimation from '../../../utils/typing-animation';

function AdminChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Xin chào sếp! Tôi là Trợ lý AI Veltrix. Sếp cần thống kê doanh thu hay phân tích số liệu gì hôm nay?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [isAutoPilot, setIsAutoPilot] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechVoices, setSpeechVoices] = useState([]);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(new Audio()); // Global audio object for unlocking

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchHistoryAndConfig = async () => {
      try {
        const [historyRes, configRes] = await Promise.all([
          getAdminChatHistory(),
          getSystemConfig()
        ]);
        
        if (historyRes.data && historyRes.data.data && historyRes.data.data.length > 0) {
          const loadedMsgs = historyRes.data.data.map(m => ({ id: m._id, sender: m.sender, text: m.text }));
          setMessages(loadedMsgs);
        }

        if (configRes.data && configRes.data.data) {
          setIsAutoPilot(configRes.data.data.ai?.autoProcessOrders || false);
        }
      } catch (error) {
        console.log("Lỗi tải dữ liệu AI/System:", error);
      }
    };
    fetchHistoryAndConfig();

    const handleVoicesChanged = () => {
      setSpeechVoices(window.speechSynthesis.getVoices());
    };
    
    if ('speechSynthesis' in window) {
      setSpeechVoices(window.speechSynthesis.getVoices());
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const readMessageAloud = async (text) => {
    // Unlock the audio element synchronously with the user's click
    audioRef.current.play().catch(() => {});
    audioRef.current.pause();

    const cleanText = text.replace(/<[^>]*>?/gm, '').replace(/[*_#\-|\n]/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Thêm meta no-referrer để bypass tường lửa CORS của Google
    if (!document.getElementById("no-ref-meta")) {
      const meta = document.createElement('meta');
      meta.id = "no-ref-meta";
      meta.name = "referrer";
      meta.content = "no-referrer";
      document.head.appendChild(meta);
    }

    const chunks = cleanText.match(/[^.,!?]+[.,!?]*/g) || [cleanText];
    for (let chunk of chunks) {
      if (chunk.trim().length === 0) continue;
      let textToSpeak = chunk.trim();
      if (textToSpeak.length > 200) textToSpeak = textToSpeak.substring(0, 200);
      
      const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&tl=vi&client=gtx&q=${encodeURIComponent(textToSpeak)}`;
      
      await new Promise((resolve) => {
        audioRef.current.src = url;
        audioRef.current.playbackRate = 1.5; // Tăng tốc độ đọc lên 1.5x theo ý Sếp
        audioRef.current.onended = resolve;
        audioRef.current.onerror = (e) => {
          console.log("Audio load error:", e);
          resolve();
        };
        audioRef.current.play().catch(e => {
          console.log("Autoplay blocked:", e);
          resolve();
        });
      });
    }
  };

  const handleSend = async (textToSend, isVoiceCall = false) => {
    const userText = (typeof textToSend === 'string' ? textToSend : inputValue).trim();
    if (!userText || isTyping) return;

    const newMsg = { id: Date.now(), sender: 'user', text: userText };
    
    // Convert only the last 6 messages to chatHistory to avoid Gemini Token Limit (429 Error)
    const chatHistory = messages.slice(-6).map(m => `${m.sender === 'user' ? 'Quản trị viên' : 'Trợ lý'}: ${m.text}`).join('\n');

    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    setIsTyping(true);

    // Detect if user is asking to create article/news
    const isArticleRequest = /viết bài|tạo bài|soạn bài|viết tin|tạo tin|viết content|tạo nội dung/i.test(userText);
    let progressInterval = null;

    if (isArticleRequest) {
      const steps = [
        '🔍 Đang tìm thông tin sản phẩm...',
        '📝 Đang soạn thảo nội dung bài viết...',
        '🖼️ Đang xử lý hình ảnh...',
        '✨ Đang hoàn thiện bài viết...',
        '📤 Đang đăng bài lên hệ thống...'
      ];
      let stepIndex = 0;
      setProgressText(steps[0]);
      progressInterval = setInterval(() => {
        stepIndex = Math.min(stepIndex + 1, steps.length - 1);
        setProgressText(steps[stepIndex]);
      }, 3000);
    }

    try {
      const response = await askAdminAI(userText, chatHistory);
      if (progressInterval) clearInterval(progressInterval);
      setProgressText('');

      if (response && response.data && response.data.reply) {
        const replyText = response.data.reply;
        setMessages(prev => [
          ...prev,
          { id: Date.now() + 1, sender: 'ai', text: replyText }
        ]);

        // 🤖 Robot Mode: AI yêu cầu tự động tạo bài viết trên UI
        if (response.data.action === 'auto_create_news' && response.data.draftPayload) {
          setTimeout(() => {
            setIsOpen(false); // Đóng chatbot để Sếp tập trung xem Robot làm việc
            navigate('/admin/news/create', { 
              state: { 
                draftPayload: response.data.draftPayload, 
                autoMode: true 
              } 
            });
          }, 1500); // Chờ 1.5s cho Sếp đọc tin nhắn AI
        }

        if (isVoiceCall) {
          readMessageAloud(replyText);
        }

      } else {
        setMessages(prev => [
          ...prev,
          { id: Date.now() + 1, sender: 'ai', text: 'Xin lỗi sếp, hệ thống vừa gặp sự cố kết nối.' }
        ]);
      }
    } catch (error) {
      if (progressInterval) clearInterval(progressInterval);
      setProgressText('');
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: 'Xin lỗi sếp, tôi không thể phản hồi lúc này.' }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const startListening = () => {
    if (!recognition) return alert("Trình duyệt của Sếp không hỗ trợ nhận diện giọng nói!");
    
    // Unlock the audio element synchronously with the user's click to bypass Autoplay blocks later
    audioRef.current.play().catch(() => {});
    audioRef.current.pause();
    
    recognition.lang = 'vi-VN';
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      handleSend(transcript, true); 
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  const stopListening = () => {
    if (recognition) recognition.stop();
    setIsListening(false);
  };

  const handleLinkClick = (e) => {
    const anchor = e.target.closest('a');
    if (anchor && anchor.getAttribute('href')) {
      const href = anchor.getAttribute('href');
      // Nếu là link nội bộ (bắt đầu bằng /) thì dùng React Router để chuyển trang mượt mà
      if (href.startsWith('/')) {
        e.preventDefault();
        navigate(href);
        setIsOpen(false); // Đóng chatbot sau khi chuyển trang
      }
    }
  };

  const menuItems = [
    {
      key: '1',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '220px' }}>
          <span style={{ fontWeight: 500 }}>Duyệt đơn tự động (Auto-Pilot)</span>
          <Switch checked={isAutoPilot} size="small" />
        </div>
      ),
      onClick: () => {
        const newState = !isAutoPilot;
        setIsAutoPilot(newState);
        handleSend(newState ? "Bật chế độ Auto-Pilot duyệt đơn tự động" : "Tắt chế độ Auto-Pilot duyệt đơn tự động");
      }
    },
    {
      type: 'divider'
    },
    {
      key: '3',
      label: 'Duyệt toàn bộ đơn chờ',
      onClick: () => handleSend("Duyệt toàn bộ đơn hàng đang chờ")
    }
  ];

  return (
    <>
      {/* Thông báo Veltrix-chan đang làm việc (Góc trên bên phải, thiết kế dạng viên thuốc nhỏ gọn) */}
      <div className={`ai-working-toast ${isTyping ? 'show' : ''}`}>
        <img src={AiGianDu} alt="AI Working" className="toast-avatar" />
        <div className="toast-content">
          <span className="toast-title">Veltrix-chan</span>
          <span className="toast-msg">Đang xử lý lệnh...</span>
        </div>
      </div>

      <div className={`admin-chatbot-wrapper ${isOpen ? 'open' : ''} ${isAutoPilot ? 'auto-pilot-active' : ''}`}>
        {/* Floating Toggle Button */}
        <button 
        className="chatbot-toggle-btn" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {!isOpen ? <img src={BotAIAvatar} alt="Bot Avatar" className="bot-avatar-img" /> : <CloseOutlined />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="header-info">
              <Avatar src={BotAIAvatar} size={42} style={{ border: '2px solid #1677ff', boxShadow: '0 2px 8px rgba(22, 119, 255, 0.3)' }} />
              <div>
                <h4>Veltrix AI Assistant</h4>
                <span>Trợ lý hệ thống</span>
              </div>
            </div>
            <div className="header-actions">
              <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']} arrow overlayStyle={{ zIndex: 10000 }}>
                <Button type="text" icon={<MenuOutlined style={{ color: '#fff', fontSize: '18px' }} />} />
              </Dropdown>
            </div>
          </div>

          <div className="chatbot-body" onClick={handleLinkClick}>
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.sender}`}>
                <div className="message-bubble" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                {msg.sender === 'ai' && (
                  <Button 
                    type="text" 
                    size="small" 
                    icon={<SoundOutlined style={{ color: '#8c8c8c' }} />} 
                    className="play-sound-btn"
                    onClick={() => readMessageAloud(msg.text)}
                    title="Đọc văn bản"
                  />
                )}
              </div>
            ))}
            {isTyping && (
              <div className="chat-message ai">
                <div className="message-bubble typing">
                  <TypingAnimation title={progressText || "Đang xử lý dữ liệu..."} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-footer">
            <Input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onPressEnter={handleSend}
              placeholder="Nhập câu lệnh cho AI..."
              suffix={
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Tooltip title={isListening ? "Đang nghe..." : "Voice Chat"}>
                    <Button 
                      type="text" 
                      icon={isListening ? <AudioOutlined style={{ color: '#ff4d4f' }} /> : <AudioMutedOutlined style={{ color: '#8c8c8c' }} />} 
                      onClick={isListening ? stopListening : startListening}
                      className={isListening ? 'listening-pulse' : ''}
                    />
                  </Tooltip>
                  <Button 
                    type="primary" 
                    shape="circle"
                    icon={<SendOutlined />} 
                    onClick={() => handleSend()}
                    disabled={!inputValue.trim()}
                  />
                </div>
              }
              bordered={false}
            />
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default AdminChatbot;
