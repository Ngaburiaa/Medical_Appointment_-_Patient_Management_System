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
            from: process.env.EMAIL_SENDER,
            to: email,
            subject: subject,
            text: message,
            html: `
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            color: #333;
                        }
                        .email-container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #fff;
                            border-radius: 5px;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        }
                        h2 { color: #333; }
                        p { line-height: 1.6; margin: 10px 0; }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <h2>${subject}</h2>
                        <p>Hey ${firstName || "User"},</p>
                        <p>${message}</p>
                        <p>Thank you for using our service!</p>
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