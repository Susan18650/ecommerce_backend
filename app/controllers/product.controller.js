const mongoose = require("mongoose");
const productModel = require("../models/product.model");
const categoryModel = require("../models/category.model");

const roundDecimal = (number, precision) => {
  const factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
};

const createProduct = async (req, res) => {
  try {
    const { name, description, imageUrls, buyPrice, promotionPrice, amount, category } = req.body;

    // general error
    if (!name || !imageUrls || !buyPrice || !promotionPrice || !category) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Name, imageUrls, buyPrice, promotionPrice, amount and category are required fields.",
      });
    }


    if (buyPrice <= 0 || promotionPrice <= 0 || amount < 0) {
      return res.status(400).json({
        status: "Bad Request",
        message: "BuyPrice, promotionPrice, and amount must be non-negative values",
      });
    }
    
    // number error
    if (isNaN(buyPrice) || isNaN(promotionPrice) || isNaN(amount)) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Buy Price, Promotion Price, and Amount must be numbers.",
      });
    }

    // Find the categories with the given names
    const categories = await categoryModel.find({ name: { $in: category } });

    if (categories.length !== category.length) {
      return res.status(400).json({
        status: "Bad Request",
        message: "One or more categories not found.",
      });
    }

    const percentDiscount = roundDecimal(((buyPrice - promotionPrice) / buyPrice) * 100, 1);

    const newProduct = {
      _id: new mongoose.Types.ObjectId(),
      name: name,
      description: description,
      imageUrls: imageUrls,
      buyPrice: buyPrice,
      promotionPrice: promotionPrice,
      amount: amount || 0,
      percentDiscount: percentDiscount,
      category: categories.map(category => category._id), // Use the ids of the found categories
    };

    const result = await productModel.create(newProduct);

    return res.status(200).json({
      status: "Create product successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Internal server error",
      message: error.message,
    });
  }
};


const getAllProduct = async (req, res) => {
  try {
    let limit = req.query.limit;
    const page = parseInt(req.query.page) || 1; // Default page is 1
    let skip;
    if (limit !== 'unlimit') {
      limit = parseInt(limit) || 16; // Default limit is 16
      skip = (page - 1) * limit; // Calculate skip based on page and limit
    }
    let sort = req.query.sort || { _id: -1 } // Default sort is by createdAt in descending order

    // Check if sort parameter is a string
    if (typeof sort === 'string') {
      // Sort by promotionPrice
      if (sort === 'promotionPrice_asc') {
        sort = { promotionPrice: 1 };
      } else if (sort === 'promotionPrice_desc') {
        sort = { promotionPrice: -1 };
      }
      // Sort by name
      else if (sort === 'name_asc') {
        sort = { name: 1 };
      } else if (sort === 'name_desc') {
        sort = { name: -1 };
      }
    }

    const query = limit !== 'unlimit' ? productModel.find({ isDeleted: false }).skip(skip).limit(limit).sort(sort).populate("category") : productModel.find().sort(sort).populate("category");
    const result = await query;
    const totalProducts = await productModel.countDocuments({ isDeleted: false });
    const totalPage = Math.ceil(totalProducts / limit);

    const currentDate = new Date();
    const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const previousMonthProduct = await productModel.countDocuments({
      productCreatedDate: {
          $gte: previousMonth,
          $lt: currentMonth
      }
    });

    const currentMonthProduct = totalProducts - previousMonthProduct;
    const percentChange = Number((((currentMonthProduct - previousMonthProduct) / previousMonthProduct) * 100).toFixed(1));
    if (skip >= totalProducts) {
      return res.status(404).json({
        status: "Not Found",
        message: "This page does not exist.",
      });
    }
    return res.status(200).json({
      status: "Get all products successfully",
      data: result,
      totalProducts: totalProducts,
      totalPage: totalPage,
      percentProductChange: percentChange
    });
  } catch (error) {
    return res.status(500).json({
      status: "Internal server error",
      message: error.message,
    });
  }
};




const getProductById = async (req, res) => {
  try {
    const productId = req.params.productid;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Product ID is not valid!",
      });
    }

    const result = await productModel.findById(productId).populate("category");;

    if (result) {
      return res.status(200).json({
        status: "Get product successfully",
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

const updateProductById = async (req, res) => {
  try {
    const productId = req.params.productid;
    const { name, description, imageUrls, buyPrice, promotionPrice, amount, category } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Product ID is not valid!",
      });
    }

    if (buyPrice <= 0 || promotionPrice <= 0 || amount < 0) {
      return res.status(400).json({
        status: "Bad Request",
        message: "BuyPrice, promotionPrice, and amount must be non-negative values",
      });
    }
    // Validate required fields
    if (!name && !imageUrls && !buyPrice && !promotionPrice && !amount && !category) {
      return res.status(400).json({
        status: "Bad Request",
        message: "At least one field is required to update.",
      });
    }

    // number error
    if (isNaN(buyPrice) || isNaN(promotionPrice) || isNaN(amount)) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Buy Price, Promotion Price, and Amount must be numbers.",
      });
    }

    const productUpdate = {};
    if (name) productUpdate.name = name;
    if (description) productUpdate.description = description;
    if (imageUrls) productUpdate.imageUrls = imageUrls;
    if (buyPrice) productUpdate.buyPrice = buyPrice;
    if (promotionPrice) productUpdate.promotionPrice = promotionPrice;
    if (amount !== undefined) productUpdate.amount = amount;
    if (buyPrice || promotionPrice) {
      // Use the updated values if they exist, otherwise use the existing values
      const updatedBuyPrice = buyPrice !== undefined ? buyPrice : updatedProduct.buyPrice;
      const updatedPromotionPrice = promotionPrice !== undefined ? promotionPrice : updatedProduct.promotionPrice;
    
      const percentDiscount = roundDecimal(((updatedBuyPrice - updatedPromotionPrice) / updatedBuyPrice) * 100, 1);
      productUpdate.percentDiscount = percentDiscount;
    }
    
    if (category) {
      // Find the categories with the given names
      const categories = await categoryModel.find({ name: { $in: category } });

      if (categories.length !== category.length) {
        return res.status(400).json({
          status: "Bad Request",
          message: "One or more categories not found.",
        });
      }

      productUpdate.category = categories.map(category => category._id); // Use the ids of the found categories
    }

    const result = await productModel.findByIdAndUpdate(productId, productUpdate, { new: true }).populate("category");

    if (result) {
      return res.status(200).json({
        status: "Update product successfully",
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


const addImageUrl = async (req, res) => {
  try {
    const productId = req.params.productid;
    const { imageUrl } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Product ID is not valid!",
      });
    }

    if (!imageUrl) {
      return res.status(400).json({
        status: "Bad Request",
        message: "imageUrl field is required.",
      });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: "Not Found",
        message: "Product not found.",
      });
    }

    product.imageUrls.push(imageUrl);
    await product.save();

    return res.status(200).json({
      status: "Add image URL successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Internal server error",
      message: error.message,
    });
  }
};

// const deleteProductById = async (req, res) => {
//   try {
//     const productId = req.params.productid;

//     if (!mongoose.Types.ObjectId.isValid(productId)) {
//       return res.status(400).json({
//         status: "Bad Request",
//         message: "Product ID is not valid!",
//       });
//     }

//     const result = await productModel.findByIdAndDelete(productId);

//     if (result) {
//       return res.status(200).json({
//         status: "Delete product successfully",
//         data: result,
//       });
//     } else {
//       return res.status(404).json({
//         status: "Not Found",
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       status: "Internal server error",
//       message: error.message,
//     });
//   }
// };

const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.productid;
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: "Not Found",
        message: "Product not found",
      });
    }
    product.isDeleted = true;
    await product.save();
    return res.status(200).json({
      status: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "Internal server error",
      message: error.message,
    });
  }
};


const getCategoryIdByName = async (categoryName) => {
  const foundCategory = await categoryModel.findOne({ name: categoryName });
  if (!foundCategory) {
      throw new Error("Type not found");
  }
  return foundCategory._id;
};

const getProducts = async (req, res) => {
  try {
    let { name, category, minPrice, maxPrice, limit, page, sort } = req.query;

    // Create an empty query object
    let query = {};

    // Add name to query if it exists
    if (name) {
      query.name = { $regex: new RegExp(name, "i") };
    }

    // Add category to query if it exists
    if (category) {
      if (!Array.isArray(category)) {
        category = [category];
      }
      const categoryIds = await Promise.all(category.map(async categoryName => await getCategoryIdByName(categoryName)));
      query.category = { $in: categoryIds };
    }

    // Add minPrice to query if it exists
    if (minPrice) {
      query.promotionPrice = { $gte: minPrice };
    }

    // Add maxPrice to query if it exists
    if (maxPrice) {
      if (!query.promotionPrice) {
        query.promotionPrice = {};
      }
      query.promotionPrice.$lte = maxPrice;
    }

    // Sort parameters
    if (typeof sort === 'string') {
      // Sort by promotionPrice
      if (sort === 'promotionPrice_asc') {
        sort = { promotionPrice: 1 };
      } else if (sort === 'promotionPrice_desc') {
        sort = { promotionPrice: -1 };
      }
      // Sort by name
      else if (sort === 'name_asc') {
        sort = { name: 1 };
      } else if (sort === 'name_desc') {
        sort = { name: -1 };
      }
    }

    // Pagination parameters
    limit = parseInt(limit) || 16; // Default limit is 16
    page = parseInt(page) || 1; // Default page is 1
    const skip = (page - 1) * limit; // Calculate skip based on page and limit

    // Get total number of products
    const totalProducts = await productModel.countDocuments(query);
    const totalFilterPage = Math.ceil(totalProducts / limit);

    // Check if page number is valid
    if (skip >= totalProducts) {
      return res.status(404).json({
        status: "Not Found",
        message: "This page does not exist.",
      });
    }

    const result = await productModel.find(query).sort(sort).skip(skip).limit(limit).populate("category");

    return res.status(200).json({
      status: "Get products successfully",
      data: result,
      totalFilterPage: totalFilterPage,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Internal server error",
      message: error.message,
    });
  }
};


module.exports = {
  createProduct,
  getAllProduct,
  getProductById,
  updateProductById,
  addImageUrl,
  deleteProductById,
  getProducts
};
