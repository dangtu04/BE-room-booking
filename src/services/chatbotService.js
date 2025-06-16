require("dotenv").config();
const fetch = require("node-fetch");

const { handleAllGetSpecialtyForChatbot } = require("./specialtyService");
const { handleGetAllClinicForChatbot } = require("./clinicService");
const { getAllDoctorForChatbot } = require("./doctorService");

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = process.env.GEMINI_API_URL;

// Hàm gọi API Gemini
const callGeminiApi = async (prompt) => {
  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error in callGeminiApi:", error);
    throw error;
  }
};

// Phân loại ý định người dùng, trả về mảng các từ khóa
const detectIntent = async ({ message }) => {
  const prompt = `
Người dùng hỏi: "${message}"

Bạn hãy xác định xem trong câu hỏi trên có chứa các nội dung nào sau đây:

- "doctor" nếu đề cập đến bác sĩ (tên bác sĩ, khám bác sĩ...)
- "clinic" nếu đề cập đến phòng khám hoặc bệnh viện
- "specialty" nếu đề cập đến chuyên khoa (tim mạch, tai mũi họng...)
- "general" nếu là câu hỏi về thông tin sức khỏe chung
- "irrelevant" nếu câu hỏi không liên quan đến y tế

**Yêu cầu bắt buộc**:
- Có thể chọn nhiều từ khóa nếu có nhiều nội dung liên quan trong cùng câu.
- Chỉ trả về **một mảng JSON chuẩn**, ví dụ:
  - ["doctor"]
  - ["doctor", "clinic"]
  - ["irrelevant"]

Không trả lời thêm bất kỳ mô tả hoặc chú thích nào khác. Không sử dụng markdown như \`\`\`json.
`;

  const raw = await callGeminiApi(prompt);

  // Xử lý nếu có bọc ```json ... ```
  const cleaned = raw
    .replace(/```json|```/gi, "") // xóa các dấu markdown
    .trim();

  try {
    const arr = JSON.parse(cleaned);
    if (Array.isArray(arr)) {
      return arr;
    } else {
      throw new Error("Response is not a valid array");
    }
  } catch (e) {
    console.error("Failed to parse detectIntent response as JSON array:", e);
    return cleaned
      .replace(/[\[\]\s"]/g, "")
      .split(",")
      .filter((kw) => kw.length > 0);
  }
};

// Hàm xử lý chatbot
const chatbotService = async ({ message }) => {
  // Xác định ý định người dùng
  const intent = await detectIntent({ message });
  // console.log("Intent user:", intent);

  let dataForPrompt = {};

  // Lấy dữ liệu từ cơ sở dữ liệu dựa trên intent
  for (const keyword of intent) {
    switch (keyword) {
      case "doctor":
        const doctorData = await getAllDoctorForChatbot();
        if (doctorData.errCode === 0) {
          dataForPrompt.doctors = doctorData.data;
          // console.log("dataForPrompt:" , dataForPrompt)
        }
        break;
      case "clinic":
        const clinicData = await handleGetAllClinicForChatbot();
        if (clinicData.errCode === 0) {
          dataForPrompt.clinics = clinicData.data;
          // console.log("dataForPrompt:" , dataForPrompt)
        }
        break;
      case "specialty":
        const specialtyData = await handleAllGetSpecialtyForChatbot();
        if (specialtyData.errCode === 0) {
          dataForPrompt.specialties = specialtyData.data;
          // console.log("dataForPrompt:" , dataForPrompt)
        }
        break;
      default:
        break;
    }
  }

  // Tạo prompt mới bao gồm dữ liệu từ db
  let prompt = `
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

5. ĐƯỜNG LINK ĐỂ TRUY CẬP ĐẾN TRANG CHI TIẾT:
- ${process.env.URL_REACT}/doctor-detail/{doctorId} để dẫn đến trang của thông tin bác sĩ theo id
- ${process.env.URL_REACT}/specialty-detail/{specialtyId} để dẫn đến trang của thông tin chuyên khoa theo id
- ${process.env.URL_REACT}/clinic-detail/{clinicId} để dẫn đến trang của thông tin phòng khám theo id
- Đặt địa chỉ đường link trong thẻ a (nếu có)

Dưới đây là thông tin từ cơ sở dữ liệu của chúng tôi:
`;

  // Thêm dữ liệu vào prompt
  if (dataForPrompt.doctors) {
    prompt += `- Danh sách bác sĩ: ${JSON.stringify(dataForPrompt.doctors)}\n`;
  }
  if (dataForPrompt.clinics) {
    prompt += `- Danh sách phòng khám: ${JSON.stringify(dataForPrompt.clinics)}\n`;
  }
  if (dataForPrompt.specialties) {
    prompt += `- Danh sách chuyên khoa: ${JSON.stringify(dataForPrompt.specialties)}\n`;
  }

  prompt += `
Câu hỏi của người dùng: "${message}"

Hãy trả lời câu hỏi của người dùng dựa trên thông tin trên, nếu có. Nếu không có thông tin cụ thể, hãy cung cấp câu trả lời chung về y tế và khuyến khích người dùng đặt lịch khám.

Trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp dưới dạng thẻ h4, h5, br, div, p mà không cần bọc thẻ html ở ngoài.
  `;

  // Gọi Gemini API với prompt mới
  const reply = await callGeminiApi(prompt);
  return { reply };
};

module.exports = {
  chatbotService,
  callGeminiApi,
  detectIntent,
};