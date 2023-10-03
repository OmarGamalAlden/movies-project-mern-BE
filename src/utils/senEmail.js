import nodemailer from "nodemailer";

async function sendEmail({
  to = [],
  cc,
  bcc,
  text,
  html,
  subject,
  attachments = [],
} = {}) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  let info = await transporter.sendMail({
    from: `"Software Engineer OMAR GAMAL AL-DEN" <${process.env.EMAIL}>`, // sender address
    to, // list of receivers
    cc, // send emails to receivers with mention
    bcc, //send emails to receivers witout no mention
    subject, // Subject line
    text, // plain text body
    html, // html body
    attachments,
  });
  return info.rejected.length ? false : true;
}
export default sendEmail;
