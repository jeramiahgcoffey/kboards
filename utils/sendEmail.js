import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
// import { google } from 'googleapis';

// const oAuth2Client = new google.auth.OAuth2(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
//   process.env.REDIRECT_URI
// );
// oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

export default async (email, subject, text) => {
  // const accessToken = await oAuth2Client.getAccessToken();
  // console.log(accessToken);
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    // auth: {
    //   type: 'OAuth2',
    //   user: process.env.USER,
    //   clientId: process.env.CLIENT_ID,
    //   clientSecret: process.env.CLIENT_SECRET,
    //   refreshToken: process.env.REFRESH_TOKEN,
    //   accessToken,
    // },
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

  console.log('email sent successfully');
};
