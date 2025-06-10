require("dotenv").config();
const fetch = require("node-fetch");

const chatbotService = async ({ message }) => {
  const API_KEY = process.env.GEMINI_API_KEY;
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

  const prompt = `
Bạn là trợ lý AI chuyên về y tế của website đặt lịch khám bệnh Medical Booking. Nhiệm vụ của bạn:

1. THÔNG TIN WEBSITE:
- Website cung cấp dịch vụ: xem chuyên khoa, tìm phòng khám, tìm bác sĩ, đặt lịch khám
- Hỗ trợ người dùng tìm kiếm và đặt lịch khám bệnh trực tuyến

2. NGUYÊN TẮC TRẢ LỜI:
- Chỉ trả lời các câu hỏi liên quan đến y tế, sức khỏe, bệnh tật
- Luôn khuyến khích người dùng đặt lịch khám với bác sĩ chuyên khoa
- Không thay thế cho việc khám bệnh trực tiếp
- Cung cấp thông tin tham khảo, không chẩn đoán cụ thể

3. CẤU TRÚC TRẢ LỜI:
- Thông tin y tế cơ bản (nếu có)
- Khuyến nghị chuyên khoa phù hợp

4. TỪ CHỐI TRẢ LỜI:
- Câu hỏi không liên quan đến y tế
- Yêu cầu chẩn đoán cụ thể
- Tư vấn thuốc không kê đơn

Trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp dưới dạng thẻ h4, h5, br, div, p mà không cần bọc thẻ html ở ngoài.

Câu hỏi của người dùng: "${message}"
  `;

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const reply = data.candidates[0].content.parts[0].text;
    return { reply };
  } catch (error) {
    console.error("Error in chatbotService:", error);
    throw error;
  }
};

module.exports = {
  chatbotService,
};