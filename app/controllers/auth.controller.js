const roleModel = require("../models/role.model");
const userModel = require("../models/user.model");
const refreshTokenModel = require("../models/refreshToken.model");
const refreshTokenService = require("../services/refreshToken.service")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const validator = require("email-validator");
const emailExistence = require('email-existence');
const moment = require("moment-timezone");
// const otpGenerator = require('otp-generator');



// let otps = {};
// send otp code
// const sendVerificationEmail = async (email, otp) => {
//     let transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.EMAIL_USERNAME,
//             pass: process.env.EMAIL_PASSWORD
//         }
//     });

//     let mailOptions = {
//         from: `"${process.env.EMAIL_NAME}" <${process.env.EMAIL_USERNAME}>`,
//         to: email,
//         subject: 'Email Verification',
//         text: `Your OTP is: ${otp}`
//     };

//     transporter.sendMail(mailOptions, function(error, info){
//         if (error) {
//             console.log(error);
//         } else {
//             console.log('Email sent: ' + info.response);
//         }
//     });
// }

// sign up function
const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existedAccount = await userModel.findOne({ username: username });

        // check username
        if (existedAccount) {
            return res.status(400).json({
                message: "Username existed"
            })
        }

        // check email format
        if (!validator.validate(email)) {
            return res.status(400).json({
                message: "Invalid email"
            })
        }

        // check email existing
        const existingEmail = await userModel.findOne({ email: email });
        if (existingEmail) {
            return res.status(409).json({
                message: "Email already registered"
            })
        }

        // const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
        // otps[email] = {
        //     otp,
        //     expiry: Date.now() + 3 * 60 * 1000
        // };
        // await sendVerificationEmail(email, otp);


        // real email check
        emailExistence.check(email, async (error, response) => {
            if (!response) {
                return res.status(404).json({
                    success: false,
                    error: 'Email does not exist'
                });
            }
            const userRole = await roleModel.findOne({ name: 'Guest' });
            const user = new userModel({
                username: username,
                email: email,
                password: bcrypt.hashSync(password, 8),
                roles: [
                    userRole._id
                ],
            });

            await user.save();

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            let mailOptions = {
                from: `"E-comm_Admin" <${process.env.EMAIL_USERNAME}>`,
                to: email,
                subject: 'Welcome to E-comm – Let’s get started!',
                html: `<!doctype html>
                <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                
                <head>
                    <title>
                
                    </title>
                    <!--[if !mso]><!-- -->
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <!--<![endif]-->
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style type="text/css">
                        #outlook a {
                            padding: 0;
                        }
                
                        .ReadMsgBody {
                            width: 100%;
                        }
                
                        .ExternalClass {
                            width: 100%;
                        }
                
                        .ExternalClass * {
                            line-height: 100%;
                        }
                
                        body {
                            margin: 0;
                            padding: 0;
                            -webkit-text-size-adjust: 100%;
                            -ms-text-size-adjust: 100%;
                        }
                
                        table,
                        td {
                            border-collapse: collapse;
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                        }
                
                        img {
                            border: 0;
                            height: auto;
                            line-height: 100%;
                            outline: none;
                            text-decoration: none;
                            -ms-interpolation-mode: bicubic;
                        }
                
                        p {
                            display: block;
                            margin: 13px 0;
                        }
                    </style>
                    <!--[if !mso]><!-->
                    <style type="text/css">
                        @media only screen and (max-width:480px) {
                            @-ms-viewport {
                                width: 320px;
                            }
                            @viewport {
                                width: 320px;
                            }
                        }
                    </style>
                    <!--<![endif]-->
                    <!--[if mso]>
                        <xml>
                        <o:OfficeDocumentSettings>
                          <o:AllowPNG/>
                          <o:PixelsPerInch>96</o:PixelsPerInch>
                        </o:OfficeDocumentSettings>
                        </xml>
                        <![endif]-->
                    <!--[if lte mso 11]>
                        <style type="text/css">
                          .outlook-group-fix { width:100% !important; }
                        </style>
                        <![endif]-->
                
                
                    <style type="text/css">
                        @media only screen and (min-width:480px) {
                            .mj-column-per-100 {
                                width: 100% !important;
                            }
                        }
                    </style>
                
                
                    <style type="text/css">
                    </style>
                
                </head>
                
                <body style="background-color:#f9f9f9;">
                
                
                    <div style="background-color:#f9f9f9;">
                
                
                        <!--[if mso | IE]>
                      <table
                         align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
                      >
                        <tr>
                          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                      <![endif]-->
                
                
                        <div style="background:#f9f9f9;background-color:#f9f9f9;Margin:0px auto;max-width:600px;">
                
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#f9f9f9;background-color:#f9f9f9;width:100%;">
                                <tbody>
                                    <tr>
                                        <td style="border-bottom:#333957 solid 5px;direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                                            <!--[if mso | IE]>
                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                
                        <tr>
                      
                        </tr>
                      
                                  </table>
                                <![endif]-->
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                
                        </div>
                
                
                        <!--[if mso | IE]>
                          </td>
                        </tr>
                      </table>
                      
                      <table
                         align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
                      >
                        <tr>
                          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                      <![endif]-->
                
                
                        <div style="background:#fff;background-color:#fff;Margin:0px auto;max-width:600px;">
                
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#fff;background-color:#fff;width:100%;">
                                <tbody>
                                    <tr>
                                        <td style="border:#dddddd solid 1px;border-top:0px;direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                                            <!--[if mso | IE]>
                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                
                        <tr>
                      
                            <td
                               style="vertical-align:bottom;width:600px;"
                            >
                          <![endif]-->
                
                                            <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
                
                                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:bottom;" width="100%">
                
                                                    <tr>
                                                        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                
                                                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td style="width:64px;">
                
                                                                            <img height="auto" src="https://i.imgur.com/KO1vcE9.png" style="border:0;display:block;outline:none;text-decoration:none;width:100%;" width="64" />
                
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                
                                                        </td>
                                                    </tr>
                
                                                    <tr>
                                                        <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:40px;word-break:break-word;">
                
                                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:28px;font-weight:bold;line-height:1;text-align:center;color:#555;">
                                                                <b>Welcome to E-comm</b>
                                                            </div>
                
                                                        </td>
                                                    </tr>
                
                                                    <tr>
                                                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                
                                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:22px;text-align:left;color:#555;">
                                                                Hello <b>${username}</b>!<br></br>
                                                                Thank you for subscribing to our service. We promise to keep you updated on the latest industry insights, tips, and exclusive offers. Stay tuned for our upcoming issue. Click the link below to login to your account:
                                                            </div>
                
                                                        </td>
                                                    </tr>
                
                                                    <tr>
                                                        <td align="center" style="font-size:0px;padding:10px 25px;padding-top:30px;padding-bottom:50px;word-break:break-word;">
                
                                                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                                                <tr>
                                                                    <td align="center" bgcolor="#2F67F6" role="presentation" style="border:none;border-radius:3px;color:#ffffff;cursor:auto;padding:15px 25px;" valign="middle">
                                                                        <p style="background:#2F67F6;color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:normal;line-height:120%;Margin:0;text-decoration:none;text-transform:none;">
                                                                            Login to Website
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                            </table>
                
                                                        </td>
                                                    </tr>
                
                                                    <tr>
                                                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                
                                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:20px;text-align:left;color:#525252;">
                                                                Best regards,<br><br> Christiana Susan<br>E-Comm ltd, CEO and Founder<br>
                                                                <a href="/" style="color:#2F67F6">Ecomm.com</a>
                                                            </div>
                
                                                        </td>
                                                    </tr>
                
                                                </table>
                
                                            </div>
                
                                            <!--[if mso | IE]>
                            </td>
                          
                        </tr>
                      
                                  </table>
                                <![endif]-->
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                
                        </div>
                
                
                        <!--[if mso | IE]>
                          </td>
                        </tr>
                      </table>
                      
                      <table
                         align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
                      >
                        <tr>
                          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                      <![endif]-->
                
                
                        <div style="Margin:0px auto;max-width:600px;">
                
                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                                <tbody>
                                    <tr>
                                        <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                                            <!--[if mso | IE]>
                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                
                        <tr>
                      
                            <td
                               style="vertical-align:bottom;width:600px;"
                            >
                          <![endif]-->
                
                                            <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
                
                                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <td style="vertical-align:bottom;padding:0;">
                
                                                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                
                                                                    <tr>
                                                                        <td align="center" style="font-size:0px;padding:0;word-break:break-word;">
                
                                                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:300;line-height:1;text-align:center;color:#575757;">
                                                                                E-comm Ltd, 7-11 Elm Street, United States
                                                                            </div>
                
                                                                        </td>
                                                                    </tr>
                
                                                                    <tr>
                                                                        <td align="center" style="font-size:0px;padding:10px;word-break:break-word;">
                
                                                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:300;line-height:1;text-align:center;color:#575757;">
                                                                                <a href="" style="color:#575757">Unsubscribe</a> from our emails
                                                                            </div>
                
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td align="center" style="font-size:0px;padding:0;word-break:break-word;">
            
                                                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:300;line-height:1;text-align:center;color:#575757;">
                                                                            Copyright © E-Comm ${new Date().getFullYear()}.
                                                                            </div>
            
                                                                        </td>
                                                                    </tr>
                
                                                                </table>
                
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                
                                            </div>
                
                                            <!--[if mso | IE]>
                            </td>
                          
                        </tr>
                      
                                  </table>
                                <![endif]-->
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                
                        </div>
                
                
                        <!--[if mso | IE]>
                          </td>
                        </tr>
                      </table>
                      <![endif]-->
                
                
                    </div>
                
                </body>
                
                </html>`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            res.status(200).json({
                message: "Create user successfully"
            })
        })

    } catch (error) {
        res.status(500).json({
            message: "Interal server error"
        })
    }
}

// sign in function
const signIn = async (req, res) => {
    try {
        const { username, password } = req.body;

        const existedAccount = await userModel.findOne({ username: username });

        if (!existedAccount) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        var passwordIsValid = bcrypt.compareSync(
            password,
            existedAccount.password
        )

        if (!passwordIsValid) {
            return res.status(401).json({
                message: "Invalid password"
            })
        }

        const accessToken = jwt.sign(
            { id: existedAccount._id },
            process.env.JWT_SECRET,
            { algorithm: "HS256", expiresIn: 86400 }
        );


        const refreshToken = await refreshTokenService.createToken(existedAccount);

        return res.status(200).json({ _id: existedAccount._id, accessToken, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// forgot password
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const oldUser = await userModel.findOne({ email: email });
        if (!oldUser) {
            return res.status(400).json({ status: "User Not Exists!!" });
        }

        // Kiểm tra số lần gửi và thời gian gửi cuối
        const now = new Date();
        if (oldUser.resetPassword.lastTime && now.getDate() === oldUser.resetPassword.lastTime.getDate()) {
            if (oldUser.resetPassword.count >= 3) {
                return res.status(429).json({ message: "Exceeded number of password reset requests for today" });
            }
            oldUser.resetPassword.count += 1;
        } else {
            oldUser.resetPassword.count = 1;
            oldUser.resetPassword.lastTime = moment.tz(Date.now(), "Asia/Ho_Chi_Minh");
        }
        await oldUser.save();

        const secret = process.env.JWT_SECRET + oldUser.password;
        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
            expiresIn: "5m",
        });
        const link = `http://localhost:3000/verify-reset-token/${oldUser._id}/${token}`;
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            },
        });

        var mailOptions = {
            from: `"E-comm_Admin" <${process.env.EMAIL_USERNAME}>`,
            to: email,
            subject: "Password Reset",
            html: `<!doctype html>
            <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
            
            <head>
                <title>
            
                </title>
                <!--[if !mso]><!-- -->
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <!--<![endif]-->
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style type="text/css">
                    #outlook a {
                        padding: 0;
                    }
            
                    .ReadMsgBody {
                        width: 100%;
                    }
            
                    .ExternalClass {
                        width: 100%;
                    }
            
                    .ExternalClass * {
                        line-height: 100%;
                    }
            
                    body {
                        margin: 0;
                        padding: 0;
                        -webkit-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                    }
            
                    table,
                    td {
                        border-collapse: collapse;
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                    }
            
                    img {
                        border: 0;
                        height: auto;
                        line-height: 100%;
                        outline: none;
                        text-decoration: none;
                        -ms-interpolation-mode: bicubic;
                    }
            
                    p {
                        display: block;
                        margin: 13px 0;
                    }
                </style>
                <!--[if !mso]><!-->
                <style type="text/css">
                    @media only screen and (max-width:480px) {
                        @-ms-viewport {
                            width: 320px;
                        }
                        @viewport {
                            width: 320px;
                        }
                    }
                </style>
                <!--<![endif]-->
                <!--[if mso]>
                    <xml>
                    <o:OfficeDocumentSettings>
                      <o:AllowPNG/>
                      <o:PixelsPerInch>96</o:PixelsPerInch>
                    </o:OfficeDocumentSettings>
                    </xml>
                    <![endif]-->
                <!--[if lte mso 11]>
                    <style type="text/css">
                      .outlook-group-fix { width:100% !important; }
                    </style>
                    <![endif]-->
            
            
                <style type="text/css">
                    @media only screen and (min-width:480px) {
                        .mj-column-per-100 {
                            width: 100% !important;
                        }
                    }
                </style>
            
            
                <style type="text/css">
                </style>
            
            </head>
            
            <body style="background-color:#f9f9f9;">
            
            
                <div style="background-color:#f9f9f9;">
            
            
                    <!--[if mso | IE]>
                  <table
                     align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
                  >
                    <tr>
                      <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                  <![endif]-->
            
            
                    <div style="background:#f9f9f9;background-color:#f9f9f9;Margin:0px auto;max-width:600px;">
            
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#f9f9f9;background-color:#f9f9f9;width:100%;">
                            <tbody>
                                <tr>
                                    <td style="border-bottom:#333957 solid 5px;direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                                        <!--[if mso | IE]>
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                            
                    <tr>
                  
                    </tr>
                  
                              </table>
                            <![endif]-->
                                    </td>
                                </tr>
                            </tbody>
                        </table>
            
                    </div>
            
            
                    <!--[if mso | IE]>
                      </td>
                    </tr>
                  </table>
                  
                  <table
                     align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
                  >
                    <tr>
                      <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                  <![endif]-->
            
            
                    <div style="background:#fff;background-color:#fff;Margin:0px auto;max-width:600px;">
            
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#fff;background-color:#fff;width:100%;">
                            <tbody>
                                <tr>
                                    <td style="border:#dddddd solid 1px;border-top:0px;direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                                        <!--[if mso | IE]>
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                            
                    <tr>
                  
                        <td
                           style="vertical-align:bottom;width:600px;"
                        >
                      <![endif]-->
            
                                        <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
            
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:bottom;" width="100%">
            
                                                <tr>
                                                    <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
            
                                                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                                            <tbody>
                                                                <tr>
                                                                    <td style="width:64px;">
            
                                                                        <img height="auto" src="https://i.imgur.com/KO1vcE9.png" style="border:0;display:block;outline:none;text-decoration:none;width:100%;" width="64" />
            
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
            
                                                    </td>
                                                </tr>
            
                                                <tr>
                                                    <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:40px;word-break:break-word;">
            
                                                        <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:38px;font-weight:bold;line-height:1;text-align:center;color:#555;">
                                                            Oops!
                                                        </div>
            
                                                    </td>
                                                </tr>
            
                                                <tr>
                                                    <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:40px;word-break:break-word;">
            
                                                        <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:18px;line-height:1;text-align:center;color:#555;">
                                                            It seems that you’ve forgotten your password.
                                                        </div>
            
                                                    </td>
                                                </tr>
            
                                                <tr>
                                                    <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
            
                                                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                                            <tbody>
                                                                <tr>
                                                                    <td style="width:128px;">
            
                                                                        <img height="auto" src="https://i.imgur.com/247tYSw.png" style="border:0;display:block;outline:none;text-decoration:none;width:100%;" width="128" />
            
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
            
                                                    </td>
                                                </tr>
            
                                                <tr>
                                                    <td align="center" style="font-size:0px;padding:10px 25px;padding-top:30px;padding-bottom:50px;word-break:break-word;">
            
                                                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                                            <tr>
                                                                <td align="center" bgcolor="#2F67F6" role="presentation" style="border:none;border-radius:3px;color:#ffffff;cursor:auto;padding:15px 25px;" valign="middle">
                                                                    <p style="background:#2F67F6;color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:normal;line-height:120%;Margin:0;text-decoration:none;text-transform:none;">
                                                                        <a style="color: #ffffff; text-decoration: none" href="${link}">Reset Password</a>
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        </table>
            
                                                    </td>
                                                </tr>
            
                                                <tr>
                                                    <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:40px;word-break:break-word;">
            
                                                        <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:20px;text-align:center;color:#7F8FA4;">
                                                            If you did not make this request, just ignore this email. Otherwise please click the button above to reset your password.
                                                        </div>
            
                                                    </td>
                                                </tr>
            
                                            </table>
            
                                        </div>
            
                                        <!--[if mso | IE]>
                        </td>
                      
                    </tr>
                  
                              </table>
                            <![endif]-->
                                    </td>
                                </tr>
                            </tbody>
                        </table>
            
                    </div>
            
            
                    <!--[if mso | IE]>
                      </td>
                    </tr>
                  </table>
                  
                  <table
                     align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
                  >
                    <tr>
                      <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                  <![endif]-->
            
            
                    <div style="Margin:0px auto;max-width:600px;">
            
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                            <tbody>
                                <tr>
                                    <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
                                        <!--[if mso | IE]>
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                            
                    <tr>
                  
                        <td
                           style="vertical-align:bottom;width:600px;"
                        >
                      <![endif]-->
            
                                        <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
            
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td style="vertical-align:bottom;padding:0;">
            
                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
            
                                                                <tr>
                                                                    <td align="center" style="font-size:0px;padding:0;word-break:break-word;">
            
                                                                        <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:300;line-height:1;text-align:center;color:#575757;">
                                                                            E-comm Ltd, 7-11 Elm Street, United States
                                                                        </div>
            
                                                                    </td>
                                                                </tr>
            
                                                                <tr>
                                                                    <td align="center" style="font-size:0px;padding:10px;word-break:break-word;">
            
                                                                        <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:300;line-height:1;text-align:center;color:#575757;">
                                                                            <a href="" style="color:#575757">Unsubscribe</a> from our emails
                                                                        </div>
            
                                                                    </td>
                                                                </tr>

                                                                <tr>
                                                                <td align="center" style="font-size:0px;padding:0;word-break:break-word;">
    
                                                                    <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:300;line-height:1;text-align:center;color:#575757;">
                                                                    Copyright © E-Comm ${new Date().getFullYear()}.
                                                                    </div>
    
                                                                </td>
                                                            </tr>
            
                                                            </table>
            
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
            
                                        </div>
            
                                        <!--[if mso | IE]>
                        </td>
                      
                    </tr>
                  
                              </table>
                            <![endif]-->
                                    </td>
                                </tr>
                            </tbody>
                        </table>
            
                    </div>
            
            
                    <!--[if mso | IE]>
                      </td>
                    </tr>
                  </table>
                  <![endif]-->
            
            
                </div>
            
            </body>
            
            </html>`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
        console.log(link);

        res.status(200).json({
            message: "Password reset link has been sent to the user"
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// link to reset password form 
const resetPasswordForm = async (req, res) => {
    const { id, token } = req.params;
    console.log(req.params);
    const oldUser = await userModel.findOne({ _id: id });
    if (!oldUser) {
        return res.status(400).json({ status: "User Not Exists!!" });
    }
    const secret = process.env.JWT_SECRET + oldUser.password;
    try {
        const verify = jwt.verify(token, secret);
        res.status(200).json({ email: verify.email, status: "Verified" });
    } catch (error) {
        console.log(error);
        res.status(410).json({ status: "Not Verified" });
    }
}

// handle reset password
const handleResetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    const oldUser = await userModel.findOne({ _id: id });
    if (!oldUser) {
        return res.status(400).json({ status: "User Not Exists!!" });
    }
    const secret = process.env.JWT_SECRET + oldUser.password;
    try {
        const verify = jwt.verify(token, secret);
        const encryptedPassword = await bcrypt.hashSync(password, 8);
        await userModel.updateOne(
            {
                _id: id,
            },
            {
                $set: {
                    password: encryptedPassword,
                },
            }
        );

        res.status(200).json({ email: verify.email, message: "Password has been reset successfully" });
    } catch (error) {
        console.log(error);
        res.status(410).json({ status: "Something Went Wrong" });
    }
}
// refresh token
const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(403).json({ message: "Refresh token is required!" });
    }

    try {
        const refreshTokenObject = await refreshTokenModel.findOne({ token: refreshToken });

        if (!refreshTokenObject || refreshTokenObject.expiredDate < new Date()) {
            return res.status(401).json({ message: "Refresh token is invalid or expired!" });
        }

        const newAccessToken = await refreshTokenService.refreshAccessToken(refreshToken);

        return res.status(200).json({ accessToken: newAccessToken, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// change password function
const changePassword = async (req, res) => {
    const { id, oldPassword, newPassword } = req.body;

    const user = await userModel.findOne({ _id: id });
    if (!user) {
        return res.status(400).json({ status: "User Not Exists!!" });
    }

    const passwordIsValid = bcrypt.compareSync(oldPassword, user.password);
    if (!passwordIsValid) {
        return res.status(401).json({ message: "Invalid old password" });
    }

    // Check if the new password is the same as the old password
    if (bcrypt.compareSync(newPassword, user.password)) {
        return res.status(409).json({ message: "New password cannot be the same as the old password" });
    }

    
    const encryptedPassword = bcrypt.hashSync(newPassword, 8);
    await userModel.updateOne(
        {
            _id: id,
        },
        {
            $set: {
                password: encryptedPassword,
            },
        }
    );

    res.status(200).json({ message: "Password has been changed successfully" });
}


// verify email
// const verifyEmail = async (req, res) => {
//     const { email, otp } = req.body;
//     if (otps[email] && otps[email].otp === otp && Date.now() <= otps[email].expiry) {
//         await userModel.updateOne({ email }, { isEmailVerified: true });
//         res.status(200).json({ message: "Email verified successfully" });
//     } else {
//         res.status(400).json({ message: "Invalid or expired OTP" });
//     }
// }
module.exports = {
    signUp,
    signIn,
    refreshToken,
    forgotPassword,
    resetPasswordForm,
    handleResetPassword,
    changePassword
    // verifyEmail 
}