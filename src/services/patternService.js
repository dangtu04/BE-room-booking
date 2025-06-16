// patternService.js - Dự phòng cho việc phân tích pattern ngoại tuyến

const doctorPatterns = [
  /bác sĩ\s+(\w+)/gi,
  /bs\s+(\w+)/gi,
  /tiến sĩ\s+(\w+)/gi,
  /thầy thuốc\s+(\w+)/gi
];

const clinicPatterns = [
  /phòng khám\s+([^,.\n]+)/gi,
  /bệnh viện\s+([^,.\n]+)/gi,
  /trung tâm y tế\s+([^,.\n]+)/gi,
  /phòng mạch\s+([^,.\n]+)/gi
];

const specialtyPatterns = [
  /chuyên khoa\s+([^,.\n]+)/gi,
  /khoa\s+([^,.\n]+)/gi,
  /(tim mạch|nhi khoa|da liễu|mắt|tai mũi họng|thần kinh|ung bướu|ngoại khoa|nội khoa|sản phụ khoa)/gi
];

const analyzeOffline = (message) => {
  const result = {
    needsData: false,
    searchType: "none",
    searchQuery: "",
    isHealthRelated: false,
    intent: ""
  };

  const lowerMessage = message.toLowerCase();
  
  // Kiểm tra từ khóa y tế
  const healthKeywords = [
    'bác sĩ', 'bs', 'doctor', 'khám', 'bệnh', 'thuốc', 'điều trị', 
    'triệu chứng', 'phòng khám', 'bệnh viện', 'chuyên khoa', 'sức khỏe',
    'đau', 'mệt', 'ho', 'sốt', 'tim', 'gan', 'phổi', 'dạ dày'
  ];
  
  result.isHealthRelated = healthKeywords.some(keyword => 
    lowerMessage.includes(keyword)
  );

  if (!result.isHealthRelated) {
    return result;
  }

  // Kiểm tra doctor patterns
  for (const pattern of doctorPatterns) {
    const match = message.match(pattern);
    if (match) {
      result.needsData = true;
      result.searchType = "doctor";
      result.searchQuery = match[1];
      result.intent = "Tìm kiếm thông tin bác sĩ";
      return result;
    }
  }

  // Kiểm tra clinic patterns
  for (const pattern of clinicPatterns) {
    const match = message.match(pattern);
    if (match) {
      result.needsData = true;
      result.searchType = "clinic";
      result.searchQuery = match[1].trim();
      result.intent = "Tìm kiếm thông tin phòng khám";
      return result;
    }
  }

  // Kiểm tra specialty patterns
  for (const pattern of specialtyPatterns) {
    const match = message.match(pattern);
    if (match) {
      result.needsData = true;
      result.searchType = "specialty";
      result.searchQuery = match[1] || match[0];
      result.intent = "Tìm kiếm thông tin chuyên khoa";
      return result;
    }
  }

  // Câu hỏi y tế tổng quát
  result.intent = "Câu hỏi y tế tổng quát";
  return result;
};

module.exports = {
  analyzeOffline
};