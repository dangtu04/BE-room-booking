require('dotenv').config();
const nodemailer = require("nodemailer");



const sendSimpleEmail = async (dataSend) => {
    
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
    from: 'MEDICAL BOOKING APP',
    to: dataSend.reciverEmail,
    subject: "Thông tin đặt lịch khám bệnh",
    html: getBodyHTMLEmail(dataSend),
  });

  // console.log("Message sent:", info.messageId);

}


const getBodyHTMLEmail = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
      <h3>Xin chào, ${dataSend.lastName} ${dataSend.firstName}</h3>
      <p>Bạn nhận được Email này vì đã đặt lịch khám bệnh online tại MEDICAL BOOKING APP.</p>
      <p>Thông tin đặt lịch khám bệnh của bạn:</p>
      <b>Thời gian: ${dataSend.time}</b><br/>
      <b>Bác sĩ: ${dataSend.doctorName}</b>
      <p>Nếu các thông tin trên là đúng, vui lòng click vào đường link bên dưới để xác nhận</p>
      <a href="${dataSend.redirectLink}" target="_blank">Click here</a>
      <p>Xin chân thành cảm ơn!</p>
    `;
  } 
  else if (dataSend.language === "en") {
    result = `
      <h3>Hello,  ${dataSend.firstName} ${dataSend.lastName}</h3>
      <p>You received this email because you booked an appointment online at MEDICAL BOOKING APP.</p>
      <p>Your appointment details:</p>
      <b>Time: ${dataSend.time} </b><br/>
      <b>Doctor: ${dataSend.doctorName} </b>
      <p>If the above information is correct, please click the link below to confirm</p>
      <a href="${dataSend.redirectLink}" target="_blank">Click here</a>
      <p>Thank you!</p>
    `;
  }
  return result;
}


let sendAttachment = async (dataSend) => {
  const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_APP,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});
const info = await transporter.sendMail({
    from: 'MEDICAL BOOKING APP',
    to: dataSend.email,
    subject: "Kết quả đặt lịch khám bệnh",
    html: getBodyHTMLEmailRemedy(dataSend),
    attachments: [
      {
        filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
        content: dataSend.imageBase64.split("base64,")[1],
        encoding: "base64",
      },
    ],
  });
}

const getBodyHTMLEmailRemedy = (dataSend) => {
 let result = "";
  if (dataSend.language === "vi") {
    result = `
      <h3>Xin chào ${dataSend.patientName}</h3>
      <p>Bạn nhận được Email này vì đã đặt lịch khám bệnh online tại MEDICAL BOOKING APP thành công.</p>
      <p>Thông tin đơn thuốc/hoá đơn của bạn được gửi trong file đính kèm.</p>
      <p>Xin chân thành cảm ơn!</p>
    `;
  } 
  else if (dataSend.language === "en") {
    result = `
      <h3>Hello ${dataSend.patientName}</h3>
      <p>You received this email because you successfully booked an appointment online at MEDICAL BOOKING APP.</p>
      <p>Your prescription/invoice information is attached in the file.</p>
      <p>Thank you!</p>
    `;
  }
  return result;
}

module.exports = {
  sendSimpleEmail,
  sendAttachment
};