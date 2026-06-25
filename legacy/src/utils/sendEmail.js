import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export default async (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.USER,
    to: email,
    subject,
    text,
  });
};
