const mongoose = require("mongoose");
const customerModel = require("../models/customer.model");
const userModel = require("../models/user.model");
const emailExistence = require('email-existence');

const createCustomer = async (req, res) => {
  try {
    const { fullName, phone, email, address, city, district, ward } = req.body;
    if (!fullName || !phone || !email) {
      return res.status(400).json({
        status: "Bad Request",
        message: "fullName, phone, and email are required fields.",
      });
    }

    emailExistence.check(email, async (error, response) => {
      if (!response) {
        return res.status(404).json({
          status: "Not Found",
          success: false,
          message: "Email does not exist.",
        });
      } else {
        // Check if the email or phone number exist in the User model
        const existingUser = await userModel.findOne({ $or: [{ email: email }, { phoneNumber: phone }] });

        if (existingUser) {
          // Update the user's information with the new customer data
          existingUser.address = address;
          existingUser.city = city;
          existingUser.district = district;
          existingUser.ward = ward;

          await existingUser.save();

          // Check if the email or phone number exist in the Customer model
          const existingCustomer = await customerModel.findOne({ $or: [{ email: email }, { phone: phone }] });

          if (existingCustomer) {
            return res.status(409).json({
              status: "Conflict",
              message: "Email or phone number already exists.",
            });
          }

          const newCustomer = {
            _id: new mongoose.Types.ObjectId(),
            fullName: fullName,
            phone: phone,
            email: email,
            address: address || "",
            city: city || "",
            district: district || "",
            ward: ward || ""
          };

          const result = await customerModel.create(newCustomer);

          // Link the new customer to the existing user
          existingUser.customers.push(result._id);
          await existingUser.save();

          return res.status(200).json({
            status: "Create customer successfully",
            data: result,
          });
        } else {
          const existingEmail = await customerModel.findOne({ email: email });
          if (existingEmail) {
            return res.status(409).json({
              status: "Conflict",
              message: "Email already exists.",
            });
          }
          const existingPhone = await customerModel.findOne({ phone: phone });
          if (existingPhone) {
            return res.status(409).json({
              status: "Conflict",
              message: "Phone number already exists.",
            });
          }

          const newCustomer = {
            _id: new mongoose.Types.ObjectId(),
            fullName: fullName,
            phone: phone,
            email: email,
            address: address || "",
            city: city || "",
            district: district || "",
            ward: ward || ""
          };

          const result = await customerModel.create(newCustomer);

          return res.status(200).json({
            status: "Create customer successfully",
            data: result,
          });
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: "Internal server error",
      message: error.message,
    });
  }
};

const createCustomerOfUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, phone, email, address, city, district, ward } = req.body;

    if (!fullName || !phone || !email) {
      return res.status(400).json({
        status: "Bad Request",
        message: "fullName, phone, and email are required fields.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: "Bad Request",
        message: "User ID is not valid!",
      });
    }

    emailExistence.check(email, async (error, response) => {
      if (!response) {
        return res.status(404).json({
          status: "Not Found",
          success: false,
          message: "Email does not exist.",
        });
      }
      // Find the user
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          status: "Not Found",
          message: "User not found.",
        });
      }

      const existingEmail = await customerModel.findOne({ email: email });
      if (existingEmail) {
        return res.status(409).json({
          status: "Conflict",
          message: "Email already exists.",
        });
      }
      const existingPhone = await customerModel.findOne({ phone: phone });
      if (existingPhone) {
        return res.status(409).json({
          status: "Conflict",
          message: "Phone number already exists.",
        });
      }

      // Create the new customer
      const newCustomer = {
        _id: new mongoose.Types.ObjectId(),
        fullName: fullName,
        phone: phone,
        email: email,
        address: address || "",
        city: city || "",
        district: district || "",
        ward: ward || ""
      };

      const result = await customerModel.create(newCustomer);

      // Link the new customer to the user
      user.customers.push(result._id);
      await user.save();

      return res.status(200).json({
        status: "Create customer for order successfully",
        data: result,
      });
    });
  } catch (error) {
    return res.status(500).json({
      status: "Internal server error",
      message: error.message,
    });
  }
};


const getAllCustomer = async (req, res) => {
  try {
    const result = await customerModel.find();

    return res.status(200).json({
      status: "Get all customers successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Internal server error",
      message: error.message,
    });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customerId = req.params.customerid;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Customer ID is not valid!",
      });
    }

    const result = await customerModel.findById(customerId);

    if (result) {
      return res.status(200).json({
        status: "Get customer successfully",
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

const updateCustomerById = async (req, res) => {
  try {
    const customerId = req.params.customerid;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Customer ID is not valid!",
      });
    }

    const customerUpdate = { ...req.body };

    const result = await customerModel.findByIdAndUpdate(customerId, customerUpdate, { new: true });

    if (result) {
      return res.status(200).json({
        status: "Update customer successfully",
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


const deleteCustomerById = async (req, res) => {
  try {
    const customerId = req.params.customerid;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Customer ID is not valid!",
      });
    }

    const result = await customerModel.findByIdAndUpdate(customerId, { isDeleted: true }, { new: true });

    if (result) {
      return res.status(200).json({
        status: "Delete customer successfully",
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


const getCustomerByPhoneNumber = async (req, res) => {
  try {
    const phoneNumber = req.query.phonenumber;

    if (!phoneNumber) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Phone number is required as query parameter.",
      });
    }

    const result = await customerModel.findOne({ phone: phoneNumber });

    if (result) {
      return res.status(200).json({
        status: "Get customer by phone number successfully",
        data: result,
      });
    } else {
      return res.status(404).json({
        status: "Not Found",
        message: "Customer not found with the provided phone number.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "Internal server error",
      message: error.message,
    });
  }
};
const getCustomerByEmail = async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Email is required as query parameter.",
      });
    }

    const result = await customerModel.findOne({ email });

    if (result) {
      return res.status(200).json({
        status: "Get customer by email successfully",
        data: result,
      });
    } else {
      return res.status(404).json({
        status: "Not Found",
        message: "Customer not found with the provided email.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "Internal server error",
      message: error.message,
    });
  }
};
const getCustomerByEmailAndPhoneNumber = async (req, res) => {
  try {
    const { email, phonenumber } = req.query;

    if (!email && !phonenumber) {
      return res.status(400).json({
        status: "Bad Request",
        message: "At least one of email and phone number is required as query parameter.",
      });
    }

    let query = {};
    if (email && phonenumber) {
      query = { $or: [{ email: email }, { phone: phonenumber }] };
    } else if (email) {
      query = { email: email };
    } else {
      query = { phone: phonenumber };
    }

    const result = await customerModel.findOne(query);

    if (result) {
      return res.status(200).json({
        status: "Get customer by email and/or phone number successfully",
        data: result,
      });
    } else {
      return res.status(404).json({
        status: "Not Found",
        message: "Customer not found with the provided email and/or phone number.",
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
  createCustomer,
  createCustomerOfUser,
  getAllCustomer,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
  getCustomerByPhoneNumber,
  getCustomerByEmail,
  getCustomerByEmailAndPhoneNumber
};
