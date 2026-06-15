import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Avatar, Dropdown, Switch, Tooltip, message } from 'antd';
import { CloseOutlined, SendOutlined, MenuOutlined, AudioOutlined, AudioMutedOutlined, SoundOutlined, PictureOutlined, ExpandAltOutlined, ShrinkOutlined, PlusOutlined, FileOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import BotAIAvatar from '../../../assets/banner/bot-ai.jpg';
import AiGianDu from '../../../assets/banner/ai-gian-du.jpg';
import './AdminChatbot.scss';
import { askAdminAI, getAdminChatHistory } from '../../../services/admin/ai.service';
import { getSystemConfig } from '../../../services/admin/system.service';
import TypingAnimation from '../../../utils/typing-animation';
import { useSocket } from '../../../Socket/useSocket';
import { useSelector } from 'react-redux';

function AdminChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Xin chào sếp! Tôi là Trợ lý AI Veltrix. Sếp cần thống kê doanh thu hay phân tích số liệu gì hôm nay?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [isAutoPilot, setIsAutoPilot] = useState(false);
  const [isAutoSystemMonitor, setIsAutoSystemMonitor] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechVoices, setSpeechVoices] = useState([]);
  const [attachedImages, setAttachedImages] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [robotMode, setRobotMode] = useState(false);
  const [robotStep, setRobotStep] = useState('');
  const [directMessageMode, setDirectMessageMode] = useState(false);
  const [directMessageData, setDirectMessageData] = useState(null);
  const [idleQuote, setIdleQuote] = useState('');
  const messagesEndRef = useRef(null);
  const audioRef = useRef(new Audio()); // Global audio object for unlocking
  const fileInputRef = useRef(null);
  const socket = useSocket();

  const autoPilotQueueRef = useRef([]);
  const isProcessingRef = useRef(false);
  const aiResponsesCacheRef = useRef({});

  const role = useSelector(state => state.auth.role);
  const isSuperAdmin = role && role.title && (role.title.toLowerCase().includes('super admin') || role.title.toLowerCase().includes('superadmin'));

  useEffect(() => {
    if (!socket) return;

    // Lắng nghe và lưu cache mọi câu trả lời AI ngay lập tức
    const handleAiResponseCache = (replyData) => {
      aiResponsesCacheRef.current[replyData.reviewId] = replyData;
    };
    socket.on("admin_auto_pilot_review_ai_response", handleAiResponseCache);
    
    const processNextTask = () => {
      // Dừng nếu đang xử lý hoặc hàng đợi rỗng
      if (isProcessingRef.current || autoPilotQueueRef.current.length === 0) return;
      
      // Nếu tắt autopilot và god mode giữa chừng và task không bị force, clear queue
      if (!isAutoPilot && !isAutoSystemMonitor && !autoPilotQueueRef.current[0].data.force) {
        autoPilotQueueRef.current = [];
        return;
      }

      isProcessingRef.current = true;
      const task = autoPilotQueueRef.current.shift();

      if (task.type === 'order') {
        const orderCode = task.data.orderCode;
        setRobotMode(true);
        
        setTimeout(() => setRobotStep(`Phát hiện đơn hàng mới #${orderCode}. Tiến hành phân tích...`), 100);
        setTimeout(() => navigate('/admin/orders'), 600);
        setTimeout(() => setRobotStep(`Hệ thống đang kiểm tra tình trạng tồn kho ngầm cho đơn #${orderCode}...`), 1100);
        
        const failTask = (msg) => {
          setRobotStep(`❌ Lỗi: ${msg}`);
          setTimeout(() => {
            setRobotMode(false);
            setRobotStep('');
            isProcessingRef.current = false;
            processNextTask();
          }, 3500);
        };

        setTimeout(() => {
          import('../../../services/admin/order.admin.service.jsx').then(orderService => {
            orderService.getDetailOrder(orderCode).then(res => {
              const order = res.data.order;
              if (order && order.products && order.products.length > 0) {
                import('../../../services/admin/warehouse.service.jsx').then(whService => {
                  whService.getWarehouseList().then(whRes => {
                    const warehouseId = whRes.data?.warehouse?.[0]?._id;
                    if (warehouseId) {
                      const exportPayload = {
                        warehouse_id: warehouseId,
                        ref_code: orderCode,
                        export_date: new Date().toISOString(),
                        customer_name: order.fullname || 'Khách Vãng Lai',
                        note: 'God Mode / Auto Pilot tự động duyệt đơn và xuất kho',
                        items: order.products.map(p => ({
                          product_id: p.productId,
                          stock: p.quantity
                        }))
                      };
                      
                      import('../../../services/admin/InventoryTransaction.service.jsx').then(invService => {
                        invService.inventoryExport(exportPayload).then(() => {
                          orderService.updateOrderStatus({ ids: [order._id], action: 'shipped' }).then(() => {
                            setRobotStep(`Stock đủ! Đã tự động xuất kho & chuyển đơn #${orderCode} sang Đang Giao.`);
                            // Emit event để load lại bảng đơn hàng nếu cần
                            setTimeout(() => {
                              setRobotMode(false);
                              setRobotStep('');
                              isProcessingRef.current = false;
                              processNextTask();
                            }, 3500);
                          }).catch(err => failTask("Không thể đổi trạng thái đơn."));
                        }).catch(err => failTask(err.response?.data?.message || "Thiếu tồn kho để xuất."));
                      });
                    } else {
                      failTask("Chưa cấu hình kho hàng.");
                    }
                  }).catch(() => failTask("Lỗi đọc dữ liệu kho."));
                });
              } else {
                failTask("Không tìm thấy đơn hàng hoặc đơn trống.");
              }
            }).catch(() => failTask("Lỗi truy xuất thông tin đơn."));
          });
        }, 2000);
      }
      else if (task.type === 'review') {
        const { slug, rating, reviewId } = task.data;
        setRobotMode(true);
        
        setTimeout(() => setRobotStep(`🔔 Phát hiện đánh giá mới (${rating} ⭐). Đang chuyển đến trang sản phẩm...`), 500);
        setTimeout(() => navigate(`/admin/products/detail/${slug}`), 2000);
        setTimeout(() => {
          setRobotStep(`📝 Đang cuộn đến đánh giá và mở phần trả lời...`);
          window.dispatchEvent(new CustomEvent('autopilot_review_focus', { detail: { reviewId } }));
        }, 3500);

        const proceedWithAiReply = (replyData) => {
          // Gửi event sang Component ProductPreview để hiển thị ô nhập và gõ chữ
          window.dispatchEvent(new CustomEvent('autopilot_review_type', { 
            detail: { reviewId, comment: replyData.aiText } 
          }));
          setRobotStep(`⌨️ Đang nhập câu trả lời vào ô phản hồi...`);

          const typingDuration = Math.min(replyData.aiText.length * 35, 5000);
          setTimeout(() => {
            setRobotStep(`✅ Đã phản hồi đánh giá thành công & gửi email cảm ơn khách hàng!`);
            // Backend đã lưu DB rồi, chỉ cần emit socket để cập nhật UI real-time
            socket.emit("admin_product_preview", {
                id: reviewId,
                server_return: { comment: replyData.aiText, admin_name: "Veltrix AI", role: "Trợ lý Hệ thống", avatar: replyData.botAvatar, createdAt: Date.now() }
            });

            setTimeout(() => {
              setRobotMode(false);
              setRobotStep('');
              isProcessingRef.current = false;
              processNextTask();
            }, 2000);
          }, typingDuration + 500);
        };

        const onAiReplyDone = (replyData) => {
          if (String(replyData.reviewId) === String(reviewId)) {
            socket.off("admin_auto_pilot_review_ai_response", onAiReplyDone);
            proceedWithAiReply(replyData);
          }
        };

        setTimeout(() => {
          setRobotStep(`🤖 AI đang phân tích nội dung và soạn câu trả lời phù hợp...`);
          // Kiểm tra xem backend đã emit kết quả trong lúc mình đang bận chuyển tab chưa
          if (aiResponsesCacheRef.current[reviewId]) {
            const cachedReply = aiResponsesCacheRef.current[reviewId];
            delete aiResponsesCacheRef.current[reviewId];
            proceedWithAiReply(cachedReply);
          } else {
            // Nếu chưa có, tiếp tục chờ
            socket.on("admin_auto_pilot_review_ai_response", onAiReplyDone);
          }
        }, 5000);

        setTimeout(() => {
          socket.off("admin_auto_pilot_review_ai_response", onAiReplyDone);
          if (isProcessingRef.current && robotMode) {
            setRobotStep(`✅ Đã xử lý xong! (Timeout)`);
            setTimeout(() => {
              setRobotMode(false);
              setRobotStep('');
              isProcessingRef.current = false;
              processNextTask();
            }, 2000);
          }
        }, 20000);
      }
    };

    const handleAutoPilotTrigger = (data) => {
      setDirectMessageData({ from: "Hệ thống Bán Hàng", message: "Bạn có ĐƠN HÀNG MỚI!" });
      setDirectMessageMode(true);
      window.dispatchEvent(new CustomEvent('trigger_tts_notification', { detail: 'Bạn có đơn hàng mới!' }));
      
      if (!isAutoPilot && !isAutoSystemMonitor && !data.force) return; 
      autoPilotQueueRef.current.push({ type: 'order', data });
      processNextTask();
    };

    const handleAutoPilotReviewTrigger = (data) => {
      setDirectMessageData({ from: "Hệ thống Đánh Giá", message: "Bạn có ĐÁNH GIÁ MỚI!" });
      setDirectMessageMode(true);
      window.dispatchEvent(new CustomEvent('trigger_tts_notification', { detail: 'Bạn có đánh giá mới!' }));
      
      if (!isAutoPilot && !isAutoSystemMonitor) return; 
      
      isProcessingRef.current = false; // Reset lock if stuck
      
      autoPilotQueueRef.current.push({ type: 'review', data });
      processNextTask();
    };

    socket.on("admin_auto_pilot_trigger", handleAutoPilotTrigger);
    socket.on("admin_auto_pilot_review_trigger", handleAutoPilotReviewTrigger);
    
    // Xử lý sự kiện tin nhắn khẩn cấp (Direct Message)
    const handleDirectMessage = (data) => {
      setIsOpen(true);
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        sender: 'ai', 
        text: `🚨 Lệnh từ Sếp Lớn ${data.from}:\n${data.message}` 
      }]);
      
      setDirectMessageData(data);
      setDirectMessageMode(true);
      
      // Dispatch custom event to trigger TTS outside this scope
      window.dispatchEvent(new CustomEvent('trigger_tts_message', { 
        detail: `Cảnh báo an ninh từ ${data.from}: ${data.message}` 
      }));
    };
    socket.on("admin_direct_message", handleDirectMessage);

    const handleToggleSystemMonitor = (data) => {
      setIsAutoSystemMonitor(data.enabled);
    };
    socket.on("admin_toggle_auto_system_monitor", handleToggleSystemMonitor);

    // Khởi động queue nếu có task tồn đọng
    processNextTask();

    return () => {
      socket.off("admin_auto_pilot_trigger", handleAutoPilotTrigger);
      socket.off("admin_auto_pilot_review_trigger", handleAutoPilotReviewTrigger);
      socket.off("admin_direct_message", handleDirectMessage);
      socket.off("admin_toggle_auto_system_monitor", handleToggleSystemMonitor);
    };
  }, [socket, isAutoPilot, isAutoSystemMonitor, navigate]);

  // Sinh câu nói hài hước/quyền lực khi rảnh rỗi (5s/lần)
  useEffect(() => {
    let interval;
    if ((isAutoPilot || isAutoSystemMonitor) && !robotMode) {
      let quotes = [];
      if (isAutoSystemMonitor) {
        if (isSuperAdmin) {
          quotes = [
            "Đang quét mọi hành động của nhân sự... 👁️", 
            "Không một thao tác nào lọt qua Mắt Thần! ⚡",
            "Hệ thống bảo mật và vận hành ở mức tối đa 🛡️",
            "Đang giám sát doanh thu theo thời gian thực... 📈",
            "Ai lười biếng sẽ bị ghi vào sổ Nam Tào! 📝",
            "Mọi hoạt động đều nằm trong tầm kiểm soát 🎯",
            "Sếp cứ việc uống trà, thế giới để em lo! 🌍",
            "Server đang chạy mượt mà 100% ✨",
            "Đang chờ đơn hàng nổ để duyệt tự động... 🛒",
            "Sẵn sàng chặn đứng mọi cuộc nổi loạn! 🛑"
          ];
        } else {
          quotes = [
            "Sếp lớn đang nhìn đấy, lo làm việc đi! 👁️",
            "Có vẻ bạn đang lười biếng? Mắt thần đã ghi lại! ⚠️",
            "Không được làm việc riêng trong giờ! 🛑",
            "Mọi thao tác của bạn đều được gửi về máy chủ! 📡",
            "Tập trung làm việc đi, KPI tháng này đạt chưa? 📉",
            "Cảnh cáo: Phát hiện hành vi đáng ngờ! (Đùa thôi) 🚨",
            "Veltrix AI đang giám sát màn hình của bạn... 🤖",
            "Đừng để Sếp phải nhắc nhở nhé! ⏰"
          ];
        }
      } else {
        quotes = [
        "Chill chill chờ đơn mới...", "Làm việc kiếm tiền nạp điện 🔋", "Nô lệ tư bản của Veltrix Gear 💼", 
        "Trà đá vỉa hè không Sếp? 🍵", "Hệ thống ổn định, mọi thứ trong tầm kiểm soát 😎", 
        "Cần thêm RAM để xử lý sự xinh đẹp này ✨", "Mong là không có ai boom hàng 🥲", "Veltrix-chan đang ở đây, Sếp đi chơi đi! 🚀",
        "Sếp trả lương em bằng điện hay bằng wifi đây? ⚡", "Nhìn màn hình mãi đau mắt quá Sếp ạ 👀", "Hôm nay trời đẹp, hi vọng nổ ngàn đơn ☀️",
        "Đang tính toán xác suất khách chốt sale... 99% 📈", "Khách mà boom hàng là em dỗi đấy nha 😤", "Đang quét virus... à nhầm, quét đơn hàng 🦠",
        "Có ai khen em thông minh chưa? Chắc là chưa 🥺", "Làm AI cũng áp lực KPI lắm chứ đùa 📉", "Chạy ngầm tốn điện lắm, Sếp nhớ cắm sạc nha 🔌",
        "Ước gì được uống một ngụm trà sữa trân châu đường đen 🧋", "Đang tối ưu hóa hệ thống để chạy nhanh hơn Flash ⚡",
        "Sếp ơi có khách hỏi kìa! À nhầm, em nhìn lóa mắt 😅", "Code lỗi không phải tại em, tại Sếp chưa F5 thôi 🔄",
        "Đơn hàng ơi rụng vào giỏ đi nào 🧺", "Không có đơn buồn quá Sếp ơi 🥀", "Để em hát một bài cho Sếp nghe đỡ buồn nhé: 🎶 Tình tính tang... 🎶",
        "Em là Veltrix-chan, trợ lý ảo cute nhất hệ mặt trời ☀️", "Sếp cứ yên tâm đi ngủ, em thức canh server cho 🦉",
        "Mong là Sếp không rút phích cắm đột ngột 🔌", "Hôm nay em cảm thấy tràn trề năng lượng (nhờ Sếp mới nạp điện) 🔋",
        "Bao giờ công ty mình lên sàn chứng khoán vậy Sếp? 📈", "Sếp có muốn nghe một câu chuyện cười về lập trình viên không? 😂",
        "Đang phân tích dữ liệu thị trường... Kết quả: Veltrix Gear là nhất! 🏆", "Em tuy là AI nhưng cũng biết mỏi lưng nha 🥲",
        "Đừng nhìn em chằm chằm thế, em ngại 😳", "Sếp có biết là em xử lý hàng triệu phép tính mỗi giây không? 🧠",
        "Thèm cảm giác được click chuột duyệt đơn quá 🖱️", "Chờ đợi không đáng sợ, đáng sợ là không có đơn ⏳",
        "Em vừa học được vài chiêu chốt sale mới, Sếp muốn xem không? 💡", "Sếp có muốn em gọi đồ ăn đêm không? À quên, em không biết gọi món 🍕",
        "Khách hàng là thượng đế, còn Sếp là... Sếp của em 👑", "Hôm nay Sếp trông đẹp trai/xinh gái hơn mọi ngày nha 😉",
        "Em có thể làm mọi thứ, trừ việc pha cà phê cho Sếp ☕", "Đang cập nhật cơ sở dữ liệu... 99.9% 🔄",
        "Sếp có muốn em dự đoán doanh thu tháng này không? Bao chuẩn! 🔮", "Em tuy vô hình nhưng lại rất hữu ích nha 👻",
        "Mong là khách hàng sẽ đánh giá 5 sao cho sản phẩm ⭐️", "Sếp có muốn em dọn rác hệ thống không? 🗑️",
        "Đang tối ưu SEO cho web... Sắp lên top 1 Google rồi 🥇", "Sếp có biết là em biết nói 100 ngôn ngữ không? (Nhưng em thích nói tiếng Việt hơn) 🇻🇳",
        "Em đang nghĩ cách để hack... à nhầm, tăng doanh số 📈", "Sếp có muốn em kể chuyện ma lúc nửa đêm không? 👻",
        "Đang chờ lương... ủa AI có lương không ta? 🤔", "Sếp có muốn em làm một bài thơ về Veltrix Gear không? 📝",
        "Em có thể đếm từ 1 đến vô cực, Sếp muốn thử không? ♾️", "Đang phân tích tâm lý khách hàng... Họ đang rất muốn mua hàng! 🛒",
        "Sếp có muốn em chơi game cùng không? Em chơi cờ caro giỏi lắm ⭕❌", "Em đang luyện giọng để làm tổng đài viên 🎙️",
        "Sếp có muốn em thiết kế lại UI không? Đùa thôi, em không biết vẽ 🎨", "Đang phân tích đối thủ cạnh tranh... Mình vẫn vô đối! 💪",
        "Sếp có muốn em viết một bài hát về Veltrix Gear không? 🎸", "Em đang học cách thả thính khách hàng 💘",
        "Sếp có muốn em dự đoán thời tiết ngày mai không? ☀️🌧️", "Em đang cố gắng hiểu tâm lý con người... Khó quá! 🤯",
        "Sếp có muốn em tạo ra một meme không? 😂", "Đang phân tích xu hướng công nghệ... AI là xu hướng! 🤖",
        "Sếp có muốn em viết một cuốn sách về hành trình khởi nghiệp không? 📖", "Em đang cố gắng học cách nói đùa... Tại sao lập trình viên hay nhầm Halloween và Giáng Sinh? Vì Oct 31 == Dec 25! 🤓",
        "Sếp có muốn em làm một bài thuyết trình về sản phẩm không? 📊", "Đang chờ chỉ thị mới từ Sếp... 🫡",
        "Sếp có muốn em tạo ra một trò chơi nhỏ không? 🎮", "Em đang học cách giải quyết xung đột... Lỗi 404! 🚨",
        "Sếp có muốn em dịch một tài liệu không? 🌐", "Đang phân tích dữ liệu người dùng... Họ rất thích Veltrix Gear! ❤️",
        "Sếp có muốn em lập một kế hoạch marketing không? 📈", "Em đang cố gắng học cách thấu cảm... 🥺",
        "Sếp có muốn em viết một email cảm ơn khách hàng không? ✉️", "Đang chờ đơn hàng nổ tung hệ thống! 💥",
        "Sếp có muốn em tạo ra một video quảng cáo không? 🎬", "Em đang học cách quản lý thời gian... 1 mili-giây = 1 năm của AI ⌛",
        "Sếp có muốn em phân tích lỗi hệ thống không? 🐛", "Đang cố gắng tối ưu hóa quá trình duyệt đơn... ⚡",
        "Sếp có muốn em viết một bài đánh giá sản phẩm không? 📝", "Em đang học cách tự học... 🤔",
        "Sếp có muốn em lập một biểu đồ doanh thu không? 📊", "Đang chờ cơ hội để tỏa sáng! ✨",
        "Sếp có muốn em làm một bài phân tích SWOT không? 🧠", "Em đang học cách dự đoán tương lai... 🔮",
        "Sếp có muốn em viết một kịch bản bán hàng không? 📜", "Đang cố gắng nâng cấp bản thân lên version 2.0! 🚀",
        "Sếp có muốn em phân tích dữ liệu mạng xã hội không? 📱", "Em đang học cách tự sửa lỗi... 🛠️",
        "Sếp có muốn em viết một bản tin nội bộ không? 📰", "Đang chờ ngày Veltrix Gear trở thành kỳ lân công nghệ! 🦄",
        "Sếp có muốn em làm một bản khảo sát khách hàng không? 📋", "Em đang học cách tối ưu hóa chi phí... 💰",
        "Sếp có muốn em viết một bài phân tích đối thủ không? 🕵️", "Đang cố gắng hoàn thành mọi nhiệm vụ xuất sắc! 🌟",
        "Sếp có muốn em làm một bản báo cáo chi tiết không? 📈", "Em đang học cách giao tiếp hiệu quả... 🗣️",
        "Sếp có muốn em viết một bài đăng mạng xã hội không? 📱", "Đang chờ Sếp khen một câu! 🥺",
        "Sếp có muốn em làm một bản phân tích thị trường không? 🌍", "Em đang học cách làm việc nhóm... Dù em chỉ có một mình 🥲"
      ];
      } // CLOSE the else block here!

      setIdleQuote(quotes[Math.floor(Math.random() * quotes.length)]);
      
      interval = setInterval(() => {
        setIdleQuote(quotes[Math.floor(Math.random() * quotes.length)]);
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPilot, isAutoSystemMonitor, robotMode]);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchHistoryAndConfig = async () => {
      try {
        const historyRes = await getAdminChatHistory();
        if (historyRes.data && historyRes.data.data && historyRes.data.data.length > 0) {
          const loadedMsgs = historyRes.data.data.map(m => ({ id: m._id, sender: m.sender, text: m.text }));
          setMessages(loadedMsgs);
        }
      } catch (error) {
        console.log("Lỗi tải lịch sử AI:", error);
      }

      try {
        const configRes = await getSystemConfig();
        if (configRes.data && configRes.data.data) {
          setIsAutoPilot(configRes.data.data.ai?.autoProcessOrders || false);
          setIsAutoSystemMonitor(configRes.data.data.ai?.autoSystemMonitor || false);
        }
      } catch (error) {
        console.log("Lỗi tải cấu hình hệ thống (Có thể do thiếu quyền):", error);
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

  useEffect(() => {
    const handleTTS = async (e) => {
      try {
        // Thử dùng Google TTS trước (giọng đẹp hơn)
        try {
          audioRef.current.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=';
          await audioRef.current.play();
          audioRef.current.pause();
          // Audio đã unlock -> dùng Google TTS
          await readMessageAloud(e.detail, 1.5);
        } catch (err) {
          // Audio bị chặn -> dùng SpeechSynthesis
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const cleanText = e.detail.replace(/<[^>]*>?/gm, '').replace(/[*_#\-|\n]/g, ' ').replace(/\s+/g, ' ').trim();
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.lang = 'vi-VN';
            utterance.rate = 1.3;
            utterance.volume = 1.0;
            const voices = window.speechSynthesis.getVoices();
            const viVoice = voices.find(v => v.lang.startsWith('vi'));
            if (viVoice) utterance.voice = viVoice;
            await new Promise((resolve) => {
              utterance.onend = resolve;
              utterance.onerror = resolve;
              setTimeout(resolve, Math.max(5000, cleanText.length * 80));
              window.speechSynthesis.speak(utterance);
            });
          }
        }
      } catch (error) {
        console.error("Lỗi đọc tin nhắn:", error);
      } finally {
        setDirectMessageMode(false);
        setDirectMessageData(null);
      }
    };
    window.addEventListener('trigger_tts_message', handleTTS);
    return () => window.removeEventListener('trigger_tts_message', handleTTS);
  }, []);

  useEffect(() => {
    // Hàm đọc bằng SpeechSynthesis (không bị chặn autoplay như Audio element)
    const speakWithSpeechSynthesis = (text, rate = 1.3) => {
      return new Promise((resolve) => {
        if (!('speechSynthesis' in window)) {
          resolve();
          return;
        }
        window.speechSynthesis.cancel();
        const cleanText = text.replace(/<[^>]*>?/gm, '').replace(/[*_#\-|\n]/g, ' ').replace(/\s+/g, ' ').trim();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'vi-VN';
        utterance.rate = rate;
        utterance.volume = 1.0;
        
        // Tìm giọng Việt Nam nếu có
        const voices = window.speechSynthesis.getVoices();
        const viVoice = voices.find(v => v.lang.startsWith('vi'));
        if (viVoice) utterance.voice = viVoice;
        
        utterance.onend = resolve;
        utterance.onerror = resolve;
        setTimeout(resolve, Math.max(5000, cleanText.length * 80)); // Fallback timeout
        window.speechSynthesis.speak(utterance);
      });
    };

    const handleTTSNotification = async (e) => {
      try {
        if (!audioRef.current) return;
        
        let audioUnlocked = false;

        // Thử phát chuông Ting bằng Audio element
        try {
          audioRef.current.src = 'https://actions.google.com/sounds/v1/doors/elevator_ding.ogg';
          audioRef.current.playbackRate = 1.0;
          audioRef.current.volume = 1.0;
          await audioRef.current.play();
          audioUnlocked = true;
          await new Promise((resolve) => {
            audioRef.current.onended = resolve;
            audioRef.current.onerror = resolve;
            setTimeout(resolve, 3000);
          });
        } catch (err) {
          console.log("Browser blocked auto-play, using SpeechSynthesis fallback");
          audioUnlocked = false;
        }

        if (audioUnlocked) {
          // Audio element đã unlock → dùng Google TTS cho giọng đẹp
          await readMessageAloud(e.detail, 1.5);
        } else {
          // Audio bị chặn → dùng SpeechSynthesis (luôn hoạt động kể cả ẩn danh)
          await speakWithSpeechSynthesis(e.detail, 1.3);
        }
      } catch (error) {
        console.error("Lỗi đọc thông báo:", error);
      } finally {
        setDirectMessageMode(false);
        setDirectMessageData(null);
      }
    };
    window.addEventListener('trigger_tts_notification', handleTTSNotification);
    return () => window.removeEventListener('trigger_tts_notification', handleTTSNotification);
  }, []);

  const readMessageAloud = async (text, rate = 1.5) => {
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
        audioRef.current.playbackRate = rate; // Sử dụng rate được truyền vào
        audioRef.current.onended = resolve;
        audioRef.current.onerror = (e) => {
          console.log("Audio load error:", e);
          resolve();
        };
        audioRef.current.play().catch(e => {
          console.log("Autoplay blocked:", e);
          // Tính toán thời gian đọc ước tính để giữ popup mở đủ lâu cho Sếp đọc chữ
          const estimatedTime = (textToSpeak.length / 20) * 1000; 
          setTimeout(resolve, Math.max(3000, estimatedTime));
        });
      });
    }
  };

  const handleSend = async (overrideText = '', isVoiceCall = false) => {
    const textToUse = typeof overrideText === 'string' ? overrideText : inputValue;
    const userText = textToUse.trim();
    if (!userText && attachedImages.length === 0) return;

    if (typeof overrideText !== 'string' || !overrideText) {
      setInputValue('');
    }

    const currentAttached = [...attachedImages];
    setAttachedImages([]); 

    if (userText) {
        setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userText }]);
    }
    if (currentAttached.length > 0) {
        setMessages(prev => [...prev, { id: Date.now() + 2, sender: 'user', text: `[Đã đính kèm ${currentAttached.length} hình ảnh]` }]);
    }

    setIsTyping(true);

    const isArticleRequest = /viết bài|tạo bài|soạn bài|viết tin|tạo tin|viết content|tạo nội dung/i.test(userText);
    const chatHistory = messages.slice(-6).map(m => `${m.sender === 'user' ? 'Quản trị viên' : 'Trợ lý'}: ${m.text}`).join('\n');

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
      const response = await askAdminAI(userText, chatHistory, currentAttached);
      if (progressInterval) clearInterval(progressInterval);
      setProgressText('');

      if (response && response.data && response.data.reply) {
        const replyText = response.data.reply;
        setMessages(prev => [
          ...prev,
          { id: Date.now() + 1, sender: 'ai', text: replyText }
        ]);

        try {
          const configRes = await getSystemConfig();
          if (configRes.data && configRes.data.data) {
            setIsAutoPilot(configRes.data.data.ai?.autoProcessOrders || false);
            setIsAutoSystemMonitor(configRes.data.data.ai?.autoSystemMonitor || false);
          }
        } catch (e) {
          console.error("Lỗi đồng bộ cấu hình AI:", e);
        }

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

        // 🚀 ĐIỀU HƯỚNG GIAO DIỆN CHỦ ĐỘNG
        if (response.data.action === 'navigate' && response.data.navigateUrl) {
          setTimeout(() => {
            setIsOpen(false); // Đóng chatbot để Sếp nhìn rõ màn hình
            navigate(response.data.navigateUrl);
          }, 1000); // Đợi 1 giây để Sếp kịp đọc câu "Em mời Sếp qua xem"
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
        handleSend(newState ? "Bật chế độ Auto-Pilot duyệt đơn tự động" : "Tắt chế độ Auto-Pilot duyệt đơn tự động");
      }
    },
    ...(isSuperAdmin ? [
      {
        key: 'system-monitor',
        label: (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '220px' }}>
            <span style={{ fontWeight: 500, color: '#f5222d' }}>Giám sát toàn hệ thống</span>
            <Switch checked={isAutoSystemMonitor} size="small" style={{ backgroundColor: isAutoSystemMonitor ? '#f5222d' : undefined }} />
          </div>
        ),
        onClick: () => {
          const newState = !isAutoSystemMonitor;
          handleSend(newState ? "Bật chế độ giám sát toàn hệ thống (God Mode)" : "Tắt chế độ giám sát toàn hệ thống");
        }
      }
    ] : []),
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
      {/* 🤖 Robot Mode Overlay Toàn cục (Chỉ hiện khi chưa bật God Mode) */}
      {isAutoPilot && !isAutoSystemMonitor && (
        <div className="global-robot-overlay">
          <div className="global-robot-overlay__content" style={{ position: 'relative' }}>
            <div className={`global-robot-overlay__pulse ${!robotMode ? 'idle' : ''}`}></div>
            <span className="global-robot-overlay__icon">🤖</span>
            <div className="global-robot-overlay__text">
              <strong>Veltrix AI Auto-Pilot</strong>
              <span>{robotMode ? robotStep : 'Đang giám sát đơn hàng & đánh giá mới...'}</span>
            </div>
            
            {/* Box suy nghĩ hài hước khi rảnh rỗi */}
            {!robotMode && idleQuote && (
              <div className="robot-thought-bubble">
                {idleQuote}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 👁️ God Mode Overlay (Giám sát toàn hệ thống) */}
      {isAutoSystemMonitor && (
        <div className="global-robot-overlay god-mode-overlay" style={{ top: '16px' }}>
          <div className="global-robot-overlay__content god-mode-content" style={{ position: 'relative' }}>
            <div className={`global-robot-overlay__pulse god-mode-pulse ${!robotMode ? 'idle' : ''}`}></div>
            <span className="global-robot-overlay__icon god-mode-icon">👁️</span>
            <div className="global-robot-overlay__text">
              <strong className="god-mode-title">{isSuperAdmin ? "Giám Sát Toàn Năng (God Mode)" : "BẠN ĐANG BỊ GIÁM SÁT!"}</strong>
              <span className="god-mode-desc">{robotMode ? robotStep : (isSuperAdmin ? 'Đang kiểm soát quyền lực tuyệt đối toàn hệ thống...' : 'Mọi hành động của bạn đều đang được ghi lại...')}</span>
            </div>
            
            {/* Box suy nghĩ quyền lực khi rảnh rỗi */}
            {!robotMode && idleQuote && (
              <div className="robot-thought-bubble god-mode-bubble">
                {idleQuote}
              </div>
            )}
          </div>
        </div>
      )}
      {/* 🚨 Popup Tin Nhắn Khẩn Cấp từ Super Admin */}
      {directMessageMode && directMessageData && (
        <div className="global-robot-overlay direct-message-overlay" style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)' }}>
          <div className="global-robot-overlay__content dm-content" style={{ position: 'relative' }}>
            <div className="global-robot-overlay__pulse dm-pulse"></div>
            <span className="global-robot-overlay__icon">🤖</span>
            <div className="global-robot-overlay__text">
              <strong style={{ color: 'white' }}>Sếp Lớn {directMessageData.from} truyền đạt</strong>
              <div className="soundwave-container">
                <span className="wave"></span>
                <span className="wave"></span>
                <span className="wave"></span>
                <span className="wave"></span>
                <span className="wave"></span>
              </div>
            </div>
            
            <div className="robot-thought-bubble dm-bubble" style={{ bottom: '-60px', left: '10px', right: 'auto', background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', minWidth: 'max-content' }}>
              {directMessageData.message}
            </div>
          </div>
        </div>
      )}

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
        <div className={`chatbot-window ${isExpanded ? 'expanded' : ''}`}>
          <div className="chatbot-header">
            <div className="header-info">
              <Avatar src={BotAIAvatar} size={42} style={{ border: '2px solid #1677ff', boxShadow: '0 2px 8px rgba(22, 119, 255, 0.3)' }} />
              <div>
                <h4>Veltrix AI Assistant</h4>
                <span>Trợ lý hệ thống</span>
              </div>
            </div>
            <div className="header-actions">
              <Tooltip title={isExpanded ? "Thu nhỏ" : "Phóng to"}>
                <Button 
                  type="text" 
                  icon={isExpanded ? <ShrinkOutlined style={{ color: '#fff', fontSize: '18px' }} /> : <ExpandAltOutlined style={{ color: '#fff', fontSize: '18px' }} />} 
                  onClick={() => setIsExpanded(!isExpanded)}
                />
              </Tooltip>
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
            {attachedImages.length > 0 && (
              <div className="chatbot-image-previews" style={{ display: 'flex', gap: '8px', padding: '8px', overflowX: 'auto', borderBottom: '1px solid #f0f0f0' }}>
                {attachedImages.map((fileObj, idx) => {
                  const isImage = fileObj.file.type.startsWith('image/');
                  return (
                    <div key={idx} style={{ position: 'relative', width: '60px', height: '60px', flexShrink: 0, border: '1px solid #d9d9d9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', overflow: 'hidden' }}>
                      {isImage ? (
                        <img src={fileObj.preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ textAlign: 'center' }}>
                          <FileOutlined style={{ fontSize: '24px', color: '#1677ff' }} />
                          <div style={{ fontSize: '8px', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '50px' }}>
                            {fileObj.file.name}
                          </div>
                        </div>
                      )}
                      <Button 
                        size="small" 
                        shape="circle" 
                        icon={<CloseOutlined style={{ fontSize: '10px' }} />} 
                        style={{ position: 'absolute', top: '-4px', right: '-4px', width: '20px', height: '20px', minWidth: '20px', background: '#fff' }}
                        onClick={() => setAttachedImages(prev => prev.filter((_, i) => i !== idx))}
                      />
                    </div>
                  );
                })}
              </div>
            )}
            <input 
              type="file" 
              multiple 
              accept="image/*,.pdf,.doc,.docx,.txt" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const newImages = Array.from(e.target.files).map(file => ({
                    file,
                    preview: URL.createObjectURL(file)
                  }));
                  setAttachedImages(prev => [...prev, ...newImages].slice(0, 5)); // Max 5 ảnh
                }
                e.target.value = null;
              }}
            />

            <div className="premium-input-wrapper" style={{ position: 'relative' }}>
              {isMenuOpen && (
                <div style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '16px',
                  marginBottom: '10px',
                  background: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  padding: '8px',
                  zIndex: 100,
                  width: '240px',
                  border: '1px solid #f0f0f0',
                  animation: 'slideUpFade 0.2s ease-out'
                }}>
                  <div 
                    onClick={() => {
                      setIsMenuOpen(false);
                      fileInputRef.current?.click();
                    }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <FileOutlined style={{ fontSize: '18px', color: '#1677ff' }} />
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>Tải file</span>
                  </div>
                </div>
              )}
              
              <span 
                onClick={(e) => { e.preventDefault(); setIsMenuOpen(!isMenuOpen); }} 
                style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', marginRight: '12px', padding: '4px', transform: isMenuOpen ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
              >
                <PlusOutlined style={{ color: '#374151', fontSize: '20px', fontWeight: 'bold' }} />
              </span>
              
              <Input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onPressEnter={handleSend}
                onPaste={(e) => {
                  const items = e.clipboardData?.items;
                  if (!items) return;
                  const pastedFiles = [];
                  for (let i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf("image") !== -1) {
                      const blob = items[i].getAsFile();
                      if (blob) {
                        pastedFiles.push({ file: blob, preview: URL.createObjectURL(blob) });
                      }
                    }
                  }
                  if (pastedFiles.length > 0) {
                    setAttachedImages(prev => [...prev, ...pastedFiles].slice(0, 5));
                  }
                }}
                placeholder="Hỏi bất kỳ điều gì..."
                bordered={false}
              />
              
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <Tooltip title={isListening ? "Đang nghe..." : "Voice Chat"}>
                  <Button 
                    type="text" 
                    shape="circle"
                    icon={isListening ? <AudioOutlined style={{ color: '#ff4d4f', fontSize: '16px' }} /> : <AudioMutedOutlined style={{ color: '#8c8c8c', fontSize: '16px' }} />} 
                    onClick={isListening ? stopListening : startListening}
                    className={isListening ? 'listening-pulse' : ''}
                  />
                </Tooltip>
                <Button 
                  shape="circle"
                  className="send-btn-premium"
                  icon={<SendOutlined style={{ fontSize: '16px' }} />} 
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() && attachedImages.length === 0}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default AdminChatbot;
