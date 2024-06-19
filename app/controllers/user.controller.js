const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const roleModel = require("../models/role.model");
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');

const getAllUser = async (req, res) => {
    try {
        const result = await userModel.find({ isDeleted: false }).populate('roles');
        const totalAccounts = result.length;

        const currentDate = new Date();
        const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

        const previousMonthAccount = await userModel.countDocuments({
            createdAt: {
                $gte: previousMonth,
                $lt: currentMonth
            }
        });

        const currentMonthAccount = totalAccounts - previousMonthAccount;
        const percentChange = Number((((currentMonthAccount - previousMonthAccount) / previousMonthAccount) * 100).toFixed(1));

        return res.status(200).json({
            status: "Get all user successfully",
            data: result,
            totalAccounts: totalAccounts,
            percentAccountChange: percentChange
        });
    } catch (error) {
        return res.status(500).json({
            status: "Internal server error",
            message: error.message,
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const userId = req.params.userid;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                status: "Bad request",
                message: "User ID is not Valid",
            });
        }

        const result = await userModel.findById(userId).populate('roles');

        if (result) {
            return res.status(200).json({
                status: "Get user successfully",
                data: result,
            });
        } else {
            return res.status(404).json({
                status: "Not found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "Internal server error",
            message: error.message
        });
    }
};

const getUserByUsername = async (req, res) => {
    try {
        const username = req.query.username;

        if (!username) {
            return res.status(400).json({
                status: "Bad Request",
                message: "Username is required in query params",
            });
        }


        const result = await userModel.findOne({ username: { $regex: new RegExp(username, "i") } }).populate('roles');

        if (result) {
            return res.status(200).json({
                status: "Get user successfully",
                data: result,
            });
        } else {
            return res.status(404).json({
                status: "Not Found",
                message: "User not found with the provided username",
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "Internal Server Error",
            message: error.message,
        });
    }
};
const createUser = (req, res) => {
    res.status(201).json({
        status: "Create new User",
        message: "Authorized"
    })
}

const updateUserById = async (req, res) => {
    try {
        const userId = req.params.userid;
        const { role: roleName, ...updateFields } = req.body;
        const userUpdate = { ...updateFields };

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                status: "Bad request",
                message: "User ID is not Valid",
            });
        }

        // Get the user that the Moderator wants to act on
        // const targetUser = await userModel.findById(userId).populate("roles");
        // if (targetUser.roles.some(role => role.name === 'Admin')) {
        //     console.log('Moderator cannot act on Admin!');
        //     return res.status(403).json({
        //         message: "Moderator cannot act on Admin!"
        //     });
        // }

        // Check if the user is trying to elevate their own role
        // if (req.user._id.toString() === userId && roleName === 'Admin') {
        //     console.log('Moderator cannot elevate their own role to Admin!');
        //     return res.status(403).json({
        //         message: "Moderator cannot elevate their own role to Admin!"
        //     });
        // }

        let roleId;
        // Find the role by name
        if (roleName) {
            const role = await roleModel.findOne({ name: roleName });
            if (!role) {
                return res.status(404).json({
                    status: "Not found",
                    message: "Role not found with the provided name",
                });
            } else {
                roleId = role._id; // Get the ID of the found role
            }

            // Get the user that the Moderator wants to act on
            const targetUser = await userModel.findById(userId).populate("roles");
            if (targetUser.roles.some(role => role.name === 'Admin')) {
                console.log('Moderator cannot act on Admin!');
                return res.status(403).json({
                    message: "Moderator cannot act on Admin!"
                });
            }

            // Check if the user is trying to elevate their own role
            if (req.user._id.toString() === userId && roleName === 'Admin') {
                console.log('Moderator cannot elevate their own role to Admin!');
                return res.status(403).json({
                    message: "Moderator cannot elevate their own role to Admin!"
                });
            }

            // Check if the user is trying to assign a higher role to another user
            if (req.user.roles.some(role => role.name === 'Moderator') && roleName === 'Admin') {
                console.log('Moderator cannot assign Admin role to another user!');
                return res.status(403).json({
                    message: "Moderator cannot assign Admin role to another user!"
                });
            }
            userUpdate.roles = roleId; // Update role ID if provided
        }


        // Check if the user is trying to assign a higher role to another user
        // if (req.user.roles.some(role => role.name === 'Moderator') && roleName === 'Admin') {
        //     console.log('Moderator cannot assign Admin role to another user!');
        //     return res.status(403).json({
        //         message: "Moderator cannot assign Admin role to another user!"
        //     });
        // }


        if (roleName) {
            userUpdate.roles = roleId; // Update role ID if provided
        }

        // Check if the role is Admin or Moderator to determine whether to add or remove 'works' field
        if (roleName === 'Admin' || roleName === 'Moderator') {
            userUpdate.works = []; // Add field
        } else {
            // If the user is not Admin or Moderator, remove the 'works' field
            userUpdate.$unset = { works: 1 };
        }

        const result = await userModel.findByIdAndUpdate(userId, userUpdate, { new: true });

        if (!result) {
            return res.status(404).json({
                status: "Not found"
            });
        }

        return res.status(200).json({
            status: "Update user successfully",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            status: "Internal server error",
            message: error.message,
        });
    }
}


const deleteUser = async (req, res) => {
    try {
        const userId = req.params.userid;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                status: "Bad Request",
                message: "User ID is not valid!",
            });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: "Not Found",
            });
        }

        // Soft delete the user
        user.isDeleted = true;
        await user.save();

        // Send an email to the user
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const requestTime = new Date();
        const formattedRequestTime = requestTime.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        const mailOptions = {
            from: `"E-comm_Admin" <${process.env.EMAIL_USERNAME}>`,
            to: user.email,
            subject: 'Your account has been deactivated',
            html: `
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
                                                                <b>Account deletion notice</b>
                                                            </div>
                
                                                        </td>
                                                    </tr>
                
                                                    <tr>
                                                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:22px;text-align:left;color:#555;">
                                                                Hello <b>${user.username}</b>!<br></br>
                                                                We have received your request to delete your account. We will receive and process as soon as possible. Your account will be archived for 30 days from the time you submit your request. If you want to revoke your deletion request, you can contact <b>Ecomm_Admin</b>.
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:22px;text-align:left;color:#555;">
                                                            Within 30 days of submitting your account deletion request, you can still log in. In case you are not the one submitting the account deletion request, please contact <b>Customer Support</b>.
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:22px;text-align:left;color:#555;">
                                                                Account deletion request sent at <b>${formattedRequestTime}</b>.
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

        // Schedule hard delete after 30 days
        const deleteDate = new Date();
        deleteDate.setDate(deleteDate.getDate() + 30);
        schedule.scheduleJob(deleteDate, async function () {
            const userToBeDeleted = await userModel.findById(userId);
            if (userToBeDeleted && userToBeDeleted.isDeleted) {
                await userModel.findByIdAndDelete(userId);
            }
        });

        return res.status(200).json({
            status: "User deactivated successfully",
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            status: "Internal server error",
            message: error.message,
        });
    }
};


module.exports = {
    getAllUser, getUserById, getUserByUsername, createUser, updateUserById, deleteUser
}