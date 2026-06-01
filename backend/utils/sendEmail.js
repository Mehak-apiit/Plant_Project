import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS use karega automatically
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // 🔥 fixes certificate error (dev only)
      },
    });
    transporter.verify((error, success) => {
      if (error) {
        console.error("❌ SMTP connection error:", error.message);
      } else {
        console.log("✅ SMTP connection successful");
      }
    });

    const mailOptions = {
      from: `"My App 🚀" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.response);

  } catch (error) {
    console.error("❌ Email error:", error.message);
  }
};