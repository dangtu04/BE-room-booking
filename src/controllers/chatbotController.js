const { chatbotService } = require("../services/chatbotService");

const chatbotController = async (req, res) => {
  try {
    // Validate input
    const { message } = req.body;
    
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Vui lòng nhập tin nhắn hợp lệ",
        data: null
      });
    }

    // Giới hạn độ dài tin nhắn
    if (message.length > 1000) {
      return res.status(400).json({
        errCode: 2,
        errMessage: "Tin nhắn quá dài, vui lòng rút gọn",
        data: null
      });
    }

    // Gọi service để xử lý
    const data = await chatbotService({
      message: message.trim(),
    });

    return res.status(200).json({
      errCode: 0,
      errMessage: "Success",
      data: data
    });

  } catch (error) {
    console.error("Chatbot Controller Error:", error);
    
    // Xử lý các loại lỗi cụ thể
    let errorResponse = {
      errCode: -1,
      errMessage: "Lỗi hệ thống, vui lòng thử lại sau",
      data: null
    };

    // Lỗi từ Gemini API
    if (error.message.includes('API key')) {
      errorResponse.errMessage = "Lỗi cấu hình hệ thống";
    } else if (error.message.includes('quota')) {
      errorResponse.errMessage = "Hệ thống đang quá tải, vui lòng thử lại sau";
    } else if (error.message.includes('SAFETY')) {
      errorResponse.errMessage = "Nội dung không phù hợp, vui lòng thử câu hỏi khác";
    }

    return res.status(500).json(errorResponse);
  }
};

module.exports = {
  chatbotController,
};