import nodemailer from "nodemailer";

export const sendContactEmail = async (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#222;">
        <h2 style="color:#ff8c42;">New contact message from ${name}</h2>
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        <p><strong>Subject:</strong> ${subject || "(no subject)"}</p>
        <div style="margin-top:12px;padding:12px;border-radius:8px;background:#f7f7f7;">
          ${message.replace(/\n/g, "<br />")}
        </div>
        <p style="font-size:12px;color:#666;margin-top:18px;">Sent via lestroEstate contact form</p>
      </div>
    `;

        await transporter.sendMail({
            from: `${name} <${email}>`,
            to: process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER,
            subject: subject || `Contact form message from ${name}`,
            html,
        });

        return res.json({ message: "Email sent" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to send email" });
    }
};
