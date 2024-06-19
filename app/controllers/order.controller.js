const mongoose = require("mongoose");
const orderModel = require("../models/order.model");
const customerModel = require("../models/customer.model");
const orderDetailModel = require("../models/orderDetail.model");
const voucherModel = require("../models/voucher.model");
const nodemailer = require("nodemailer");

async function sendEmail(customerEmail, customerFullName, customerPhone, customerCity, customerDistrict, customerWard, customerAddress, orderDate, orderId, totalCost, voucherCode = '', discount = '') {
  let formattedOrderDate = new Date(orderDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  let voucherInfo = '';
  if (voucherCode && discount) {
    voucherInfo = `<p>Voucher Code: <b>${voucherCode}</b></p>
                   <p>Discount: <b>${discount}</b></p>`;
  }
  let mailOptions = {
    from: `"E-comm_Admin" <${process.env.EMAIL_USERNAME}>`,
    to: customerEmail,
    subject: 'Order Information',
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
                                            <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:24px;font-weight:bold;line-height:22px;text-align:center;color:#525252;">
                                                    Order Confirmation
                                                    <div style="font-size: 18px; font-weight: 300;"><p>${formattedOrderDate}</p></div>
                                                </div>
    
                                            </td>
                                        </tr>
    
                                        <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:left;color:#525252;">
                                                    <p>Hi <b>${customerFullName}</b>,</p>
                                                    <p>Thank you for ordering and trusting us. Your order is pending, we will contact you when it is delivered to your home</p>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:24px;font-weight:bold;line-height:22px;text-align:center;color:#525252;">
                                                    Billing and Shipping
                                                </div>
    
                                            </td>
                                        </tr>
    
                                        <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:left;color:#525252;">
                                                    <p>Order ID: <b>${orderId}</b></p>
                                                    <p>Customer Name: <b>${customerFullName}</b></p>
                                                    <p>Phone Number: <b>${customerPhone}</b></p>
                                                    <p>Delivery Address: <b>${customerAddress}, ${customerWard}, ${customerDistrict}, ${customerCity}</b></p>
                                                    ${voucherInfo}
                                                    <p>Total price: <b>$${totalCost}</b> (+$20 shipping fee)</p>
                                                </div>
                                            </td>
                                        </tr>
    
                                        <tr>
                                            <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:24px;font-weight:bold;line-height:22px;text-align:center;color:#525252;">
                                                  Look up your order
                                                </div>
    
                                            </td>
                                        </tr>
    
                                        <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
    
                                                <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:left;color:#525252;">
                                                    <p>You can return to the home page to check your order at "My Account". In case you have not registered an account, you can use the order code in this email, go to the home page and select "Look up orders" and paste the code to be able to check your order. Return to the home page here:</p>
                                                </div>
    
                                            </td>
                                        </tr>
    
                                        <tr>
                                            <td align="center" style="font-size:0px;padding:10px 25px;padding-top:30px;padding-bottom:50px;word-break:break-word;">
    
                                                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                                    <tr>
                                                        <td align="center" bgcolor="#2F67F6" role="presentation" style="border:none;border-radius:3px;color:#ffffff;cursor:auto;padding:15px 25px;" valign="middle">
                                                            <p style="background:#2F67F6;color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:normal;line-height:120%;Margin:0;text-decoration:none;text-transform:none;">
                                                                <a href="/" style="color:#fff; text-decoration:none">
                                                                  Check Shipping Status</a>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                </table>
    
                                            </td>
                                        </tr>
    
                                        <tr>
                                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
    
                                                <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:20px;text-align:left;color:#525252;">
                                                Best regards,<br><br> E-comm_Admin<br>
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
                                                            <td align="center" style="font-size:0px;padding:10;word-break:break-word;">
    
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
}

const createOrderOfCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    // Validate customerId
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Customer ID is not valid!",
      });
    }

    // Extract order data from the request body
    const { shippedDate, note, cost, status, voucherCode } = req.body;

    // Create a new order
    const newOrder = {
      _id: new mongoose.Types.ObjectId(),
      shippedDate: shippedDate,
      note: note || "",
      cost: cost || 0,
      status: status || "pending", // Set status from request body, default to "pending" if not provided
    };


    let voucherCodeEmail = '';
    let discountEmail = '';

    // If a voucher code is provided, find the voucher and add it to the order
    if (voucherCode) {
      const voucher = await voucherModel.findOne({ code: voucherCode });
      if (!voucher) {
        throw new Error(`Voucher with code ${voucherCode} not found`);
      }
      newOrder.voucher = voucher._id;
      voucherCodeEmail = voucherCode;
      discountEmail = `${voucher.discount}%`;
    }

    // Save the order and update the customer with the new order
    const orderResult = await orderModel.create(newOrder);
    const customer = await customerModel.findById(customerId);
    if (!customer) {
      throw new Error(`Customer with id ${customerId} not found`);
    }

    await customerModel.findByIdAndUpdate(
      customerId,
      { $push: { orders: orderResult._id } },
      { new: true }
    );

    sendEmail(customer.email, customer.fullName, customer.phone, customer.city, customer.district, customer.ward, customer.address, orderResult.orderDate, orderResult._id, orderResult.cost, voucherCodeEmail, discountEmail);
    return res.status(200).json({
      status: "Create order for customer successfully",
      data: orderResult,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Internal server error",
      message: error.message,
    });
  }
};

const getAllOrder = async (req, res) => {
  try {
    const result = await orderModel.find();

    // Get the current date and time
    const now = new Date();

    // Calculate the start of the week (Sunday)
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());

    // Calculate the end of the week (next Sunday)
    const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 7);

    // Find all orders that were created during this week
    const weeklyOrders = await orderModel.find({
      orderCreatedDate: {
        $gte: startOfWeek,
        $lt: endOfWeek
      }
    });

    // Create an array to hold the count of orders for each day of the week
    const dailyOrderCounts = [0, 0, 0, 0, 0, 0, 0];

    // Count the number of orders for each day
    weeklyOrders.forEach(order => {
      const dayOfWeek = order.orderCreatedDate.getDay();
      dailyOrderCounts[dayOfWeek]++;
    });

    // total order and percent order change (last month to this month)
    const totalOrders = result.length;

    const currentDate = new Date();
    const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const previousMonthOrder = await orderModel.countDocuments({
      orderCreatedDate: {
        $gte: previousMonth,
        $lt: currentMonth
      }
    });

    const currentMonthOrder = totalOrders - previousMonthOrder;
    const percentChange = Number((((currentMonthOrder - previousMonthOrder) / previousMonthOrder) * 100).toFixed(1));
    return res.status(200).json({
      status: "Get all orders successfully",
      data: result,
      totalOrders: totalOrders,
      percentOrderChange: percentChange,
      weeklyOrderStats: dailyOrderCounts
    });
  } catch (error) {
    return res.status(500).json({
      status: "Internal server error",
      message: error.message,
    });
  }
};

const getAllOrderOfCustomer = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    // Validate customerId
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Customer ID is not valid!",
      });
    }

    const customer = await customerModel.findById(customerId).populate({
      path: 'orders',
      populate: {
        path: 'voucher',
        model: 'Voucher'
      }
    });    

    if (!customer) {
      return res.status(404).json({
        status: "Not Found",
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      status: "Get all orders of customer successfully",
      data: customer.orders,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Internal server error",
      message: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Validate orderId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Order ID is not valid!",
      });
    }

    const result = await orderModel.findById(orderId);

    if (result) {
      return res.status(200).json({
        status: "Get order successfully",
        data: result,
      });
    } else {
      return res.status(404).json({
        status: "Not Found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "Internal server error",
      message: error.message,
    });
  }
};

const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const updateFields = req.body;

    // Validate orderId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Order ID is not valid!",
      });
    }

    // Update order data
    const result = await orderModel.findByIdAndUpdate(orderId, updateFields, { new: true });

    if (result) {
      return res.status(200).json({
        status: "Update order successfully",
        data: result,
      });
    } else {
      return res.status(404).json({
        status: "Not Found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "Internal server error",
      message: error.message,
    });
  }
};


const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Validate orderId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Order ID is not valid!",
      });
    }

    // Find the order to be deleted
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        status: "Not Found",
        message: "Order not found",
      });
    }

    // Update the isDeleted field to true
    order.isDeleted = true;
    const result = await order.save();

    if (result) {
      return res.status(200).json({
        status: "Order deleted successfully",
        data: result,
      });
    } else {
      return res.status(404).json({
        status: "Not Found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "Internal server error",
      message: error.message,
    });
  }
};



module.exports = {
  createOrderOfCustomer,
  getAllOrder,
  getAllOrderOfCustomer,
  getOrderById,
  updateOrder,
  deleteOrder,
};
