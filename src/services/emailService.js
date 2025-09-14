require("dotenv").config();
const nodemailer = require("nodemailer");

const sendConfirmEmail = async (dataSend) => {
  // Create a test account or replace with real credentials.
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  // Wrap in an async IIFE so we can use await.

  const info = await transporter.sendMail({
    from: "ROOM.BOOKING",
    to: dataSend.reciverEmail,
    subject: "Thông tin đặt phòng",
    html: getBodyHTMLEmail(dataSend),
  });
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const getBodyHTMLEmail = (dataSend) => {
  let result = "";
  
  if (dataSend.language === "vi") {
    const checkInFormatted = formatDate(dataSend.checkInDate);
    const checkOutFormatted = formatDate(dataSend.checkOutDate);
    
    result = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e5e5;">
        
        <!-- Header -->
        <div style="background: #2563eb; color: white; padding: 24px; text-align: center;">
          <h2 style="margin: 0; font-size: 24px; font-weight: 600;">Xác nhận đặt phòng</h2>
          <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">ROOM.BOOKING</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 32px 24px;">
          <p style="margin: 0 0 24px 0; font-size: 16px;">Xin chào <strong>${dataSend.userName}</strong>,</p>
          <p style="margin: 0 0 32px 0; color: #666; line-height: 1.5;">
            Cảm ơn bạn đã đặt phòng tại ${dataSend.typeData.valueVi} <strong>${dataSend.propertyName}</strong> 
            qua hệ thống ROOM.BOOKING. Dưới đây là thông tin chi tiết đặt phòng của bạn:
          </p>
          
          <h3 style="color: #2563eb; margin: 0 0 16px 0; font-size: 18px; font-weight: 600; padding-bottom: 8px; border-bottom: 2px solid #2563eb;">
            Thông tin đặt phòng
          </h3>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500; width: 30%;">${dataSend.typeData.valueVi}:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;"><strong>${dataSend.propertyName}</strong></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500;">Địa chỉ:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">${dataSend.propertyAddress}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500;">Nhận phòng:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                <strong>${checkInFormatted}</strong> (từ ${dataSend.checkInTimeData?.valueVi} giờ)
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500;">Trả phòng:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                <strong>${checkOutFormatted}</strong> (trước ${dataSend.checkOutTimeData?.valueVi} giờ)
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500;">Số phòng:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;"><strong>${dataSend.numRooms}</strong></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500;">Số khách:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;"><strong>${dataSend.numPeople}</strong></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-weight: 500;">Tổng giá:</td>
              <td style="padding: 12px 0;">
                <strong style="color: #2563eb; font-size: 18px;">${Number(dataSend.totalPrice).toLocaleString('vi-VN')} VND</strong>
              </td>
            </tr>
          </table>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 16px 0; color: #334155;">
              Nếu các thông tin trên là chính xác, vui lòng xác nhận đặt phòng bằng cách nhấp vào nút bên dưới:
            </p>
            <div style="text-align: center;">
              <a href="${dataSend.redirectLink}" target="_blank" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">
                Xác nhận đặt phòng
              </a>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8fafc; border-top: 1px solid #e5e5e5; padding: 24px; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.4;">
            Trân trọng,<br/>
            <strong>Đội ngũ ROOM.BOOKING</strong>
          </p>
          <p style="margin: 12px 0 0 0; font-size: 12px; color: #999;">
            Email này được gửi tự động, vui lòng không trả lời trực tiếp.
          </p>
        </div>
      </div>
    `;
  } else if (dataSend.language === "en") {
    const checkInFormatted = formatDate(dataSend.checkInDate);
    const checkOutFormatted = formatDate(dataSend.checkOutDate);
    
    result = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e5e5;">
        
        <!-- Header -->
        <div style="background: #2563eb; color: white; padding: 24px; text-align: center;">
          <h2 style="margin: 0; font-size: 24px; font-weight: 600;">Booking Confirmation</h2>
          <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">ROOM.BOOKING</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 32px 24px;">
          <p style="margin: 0 0 24px 0; font-size: 16px;">Hello <strong>${dataSend.userName}</strong>,</p>
          <p style="margin: 0 0 32px 0; color: #666; line-height: 1.5;">
            Thank you for booking at ${dataSend.typeData.valueEn || dataSend.typeData.valueVi} <strong>${dataSend.propertyName}</strong> 
            through ROOM.BOOKING system. Below are your booking details:
          </p>
          
          <h3 style="color: #2563eb; margin: 0 0 16px 0; font-size: 18px; font-weight: 600; padding-bottom: 8px; border-bottom: 2px solid #2563eb;">
            Booking Details
          </h3>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500; width: 30%;">Property:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;"><strong>${dataSend.propertyName}</strong></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500;">Address:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">${dataSend.propertyAddress}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500;">Check-in:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                <strong>${checkInFormatted}</strong> (from ${dataSend.checkInTimeData?.valueEn || dataSend.checkInTimeData?.valueVi})
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500;">Check-out:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                <strong>${checkOutFormatted}</strong> (before ${dataSend.checkOutTimeData?.valueEn || dataSend.checkOutTimeData?.valueVi})
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500;">Rooms:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;"><strong>${dataSend.numRooms}</strong></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500;">Guests:</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;"><strong>${dataSend.numPeople}</strong></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-weight: 500;">Total Price:</td>
              <td style="padding: 12px 0;">
                <strong style="color: #2563eb; font-size: 18px;">${Number(dataSend.totalPrice).toLocaleString('vi-VN')} VND</strong>
              </td>
            </tr>
          </table>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 16px 0; color: #334155;">
              If the information above is correct, please confirm your booking by clicking the button below:
            </p>
            <div style="text-align: center;">
              <a href="${dataSend.redirectLink}" target="_blank" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">
                Confirm Booking
              </a>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8fafc; border-top: 1px solid #e5e5e5; padding: 24px; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.4;">
            Best regards,<br/>
            <strong>ROOM.BOOKING Team</strong>
          </p>
          <p style="margin: 12px 0 0 0; font-size: 12px; color: #999;">
            This is an automated email, please do not reply directly.
          </p>
        </div>
      </div>
    `;
  }
  
  return result;
};


module.exports = {
  sendConfirmEmail,

};
