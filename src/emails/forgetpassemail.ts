import { NotFoundException } from "@nestjs/common";

const nodemailer = require("nodemailer");
const dotenv = require("dotenv");



module.exports = async (email,pin) => {

  const txt = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <title>Password Reset</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style type="text/css">
        /* Your existing CSS styles */
        @media screen {
          @font-face {
            font-family: 'Source Sans Pro';
            font-style: normal;
            font-weight: 400;
            src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
          }
          @font-face {
            font-family: 'Source Sans Pro';
            font-style: normal;
            font-weight: 700;
            src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
          }
        }
        body, table, td, a {
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
        }
        table, td {
          border-collapse: collapse !important;
        }
        body {
          width: 100% !important;
          height: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        a {
          color: #1a82e2;
        }
        img {
          height: auto;
          line-height: 100%;
          text-decoration: none;
          border: 0;
          outline: none;
        }
      </style>
    </head>
    <body style="background-color: #e9ecef;">
      <!-- start preheader -->
      <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
        A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
      </div>
      <!-- end preheader -->

      <!-- start body -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <!-- start hero -->
        <tr>
          <td align="center" bgcolor="#e9ecef">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                  <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Password Reset Request</h1>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- end hero -->

        <!-- start copy block -->
        <tr>
          <td align="center" bgcolor="#e9ecef">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <!-- start copy -->
              <tr>
                <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                  <p style="margin: 0;">We received a request to reset your password. Use the following PIN to proceed:</p>
                </td>
              </tr>
              <!-- end copy -->

              <!-- start PIN display -->
              <tr>
                <td align="left" bgcolor="#ffffff">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                        <table border="0" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" bgcolor="#1a82e2" style="border-radius: 6px; padding: 16px 36px;">
                              <span style="display: inline-block; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 32px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 6px;">
                                ${pin} <!-- Display the random PIN here -->
                              </span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- end PIN display -->

              <!-- start copy -->
              <tr>
                <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                  <p style="margin: 0;">If you did not request a password reset, please ignore this email.</p>
                </td>
              </tr>
              <!-- end copy -->

              <!-- start copy -->
              <tr>
                <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf;">
                  <h4 style="margin: 0;">Have A Nice Day 😊</h4>
                  <p style="margin: 0;">Sincerely,<br> Amr</p>
                </td>
              </tr>
              <!-- end copy -->
            </table>
          </td>
        </tr>
        <!-- end copy block -->

        <!-- start footer -->
        <tr>
          <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <!-- start permission -->
              <tr>
                <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                  <p style="margin: 0;">You received this email because we received a request to reset your password.</p>
                </td>
              </tr>
              <!-- end permission -->

              <tr>
                <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                  <p style="margin: 0;">Giza - Cairo</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- end footer -->
      </table>
      <!-- end body -->
    </body>
    </html>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      port: 465,
      secure: true,
      logger: true,
      debug: true,
      secureConnection: false,
      tls: {
        rejectUnauthorized: true,
      },
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });

    const mail = {
      from: process.env.USER,
      to: email,
      subject: "Password Reset Request",
      html: txt,
    };

    let x=await transporter.sendMail(mail, function (error, info) {
      if (error) {
        console.log("Email not sent:", error);
return new NotFoundException("Notfound")
       } else {
        console.log("Email sent: " + info.response);
        return 
      }
    });
      return x;
  } catch (error) {
    console.log("Email not sent!");
    console.log(error);
return new NotFoundException("Notfound")
  }
};

dotenv.config();