// import nodeMailer from 'nodemailer';
// import dotenv from 'dotenv';
// dotenv.config();

// const transporter = nodeMailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//         user: process.env.EMAIL_SENDER,
//         pass: process.env.EMAIL_PASSWORD,
//     },
// });

// export const sendNotificationEmail = async (
//     email: string,
//     subject: string,
//     firstName: string | null,
//     message: string,
// ) => {
//     try {
//         const mailOptions = {
//             from: `"THERANOS compassionate care for you"${process.env.EMAIL_SENDER}`,
//             to: email,
//             subject: subject,
//             text: message,
//             html: `
//                 <html>
//                 <head>
//                     <style>
//                         body {
//                             font-family: Arial, sans-serif;
//                             background-color: #f4f4f4;
//                             color: #333;
//                         }
//                         .email-container {
//                             max-width: 600px;
//                             margin: 0 auto;
//                             padding: 20px;
//                             background-color: #fff;
//                             border-radius: 5px;
//                             box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//                         }
//                         h2 { color: #333; }
//                         p { line-height: 1.6; margin: 10px 0; }
//                     </style>
//                 </head>
//                 <body>
//                     <div class="email-container">
//                         <h2>${subject}</h2>
//                         <p>Hey ${firstName || "User"},</p>
//                         <p>${message}</p>
//                         <p>Thank you for using our service!</p>
//                     </div>
//                 </body>
//                 </html>
//             `
//         };

//         const mailResponse = await transporter.sendMail(mailOptions);

//         if (mailResponse.accepted.length > 0) {
//             console.log("✅ Email accepted:", mailResponse.accepted);
//             return "Notification email sent successfully";
//         } else {
//             console.warn("⚠️ Email rejected:", mailResponse.rejected);
//             return "Notification email not sent, please try again";
//         }
//     } catch (error) {
//         console.error("❌ Email send error:", error);
//         return `Email server error: ${error}`;
//     }
// };

import nodeMailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodeMailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendNotificationEmail = async (
  email: string,
  subject: string,
  firstName: string | null,
  message: string,
) => {
  try {
    const mailOptions = {
      from: `"THERANOS | Compassionate Care for You" <${process.env.EMAIL_SENDER}>`,
      to: email,
      subject: subject,
      html: `
        <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: #f1f5f9;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              color: #334155;
            }
            .email-wrapper {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
            }
            .header {
              background-color: #0f766e;
              color: #ffffff;
              padding: 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .body {
              padding: 24px;
            }
            .body h2 {
              color: #0f766e;
              margin-bottom: 12px;
            }
            .body p {
              font-size: 15px;
              line-height: 1.6;
              margin: 10px 0;
            }
            .footer {
              background-color: #f9fafb;
              padding: 16px;
              text-align: center;
              font-size: 12px;
              color: #64748b;
              border-top: 1px solid #e2e8f0;
            }
            .footer a {
              color: #0f766e;
              text-decoration: none;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="header">
              <h1>THERANOS</h1>
              <p>Compassionate Care for You</p>
            </div>
            <div class="body">
              <h2>${subject}</h2>
              <p>Dear ${firstName || "Valued Patient"},</p>
              <p>${message}</p>
              <p>Thank you for trusting THERANOS with your health.</p>
            </div>
            <div class="footer">
              <p>
                Need help? <a href="mailto:${process.env.EMAIL_SENDER}">Contact Support</a><br/>
                &copy; ${new Date().getFullYear()} THERANOS. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const mailResponse = await transporter.sendMail(mailOptions);

    if (mailResponse.accepted.length > 0) {
      console.log("✅ Email accepted:", mailResponse.accepted);
      return "Notification email sent successfully";
    } else {
      console.warn("⚠️ Email rejected:", mailResponse.rejected);
      return "Notification email not sent, please try again";
    }
  } catch (error) {
    console.error("❌ Email send error:", error);
    return `Email server error: ${error}`;
  }
};
