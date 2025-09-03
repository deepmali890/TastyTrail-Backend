const nodemailer = require("nodemailer");

const sendMail = async (to, subject, htmlContent) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", // or use SMTP for production
            auth: {
                user: process.env.EMAIL_USER, // apna gmail
                pass: process.env.EMAIL_PASS  // app password (not direct gmail password)
            }
        });

        await transporter.sendMail({
            from: `"BaatCheet" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: htmlContent
        });

    } catch (err) {
        console.error("Mail Error: ", err);
    }
};

module.exports = sendMail;
