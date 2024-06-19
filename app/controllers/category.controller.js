const mongoose = require("mongoose");
const categoryModel = require("../models/category.model");
const productModel = require("../models/product.model");

const createCategory = async (req, res) => {
    try {
        const { name, description} = req.body;
        
        if(!name) {
            return res.status(400).json({
                status: "Bad Request",
                message: "Name is required!"
            })
        }

        const newCategory = {
            _id: new mongoose.Types.ObjectId(),
            name: name,
            description: description,
        }
        const result = await categoryModel.create(newCategory);
        
        return res.status(200).json({
            status: "Create category successfully",
            data: result
        })

    } catch (error) {
        return res.status(500).json({
            status: "Internal server error",
            message: error.message
        })
    }
}
const getAllCategory = async (req, res) => {
    try {
        const result = await categoryModel.find();

        return res.status(200).json({
            status: "Get all category successfully",
            data: result
        })
    } catch (error) {
        return res.status(500).json({
            status: "Internal server error",
            message: error.message
        })
    }
}
const getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.categoryid;
        if(!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({
                status: "Bad Request",
                message: "Category ID is not valid!"
            })
        }

        const result = await categoryModel.findById(categoryId);

        if(result) {
            return res.status(200).json({
                status: "Get category successfully",
                data: result
            })
        } else {
            return res.status(404).json({
                status: "Not Found"
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: "Internal server error",
            message: error.message
        })
    }
}
const updateCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.categoryid;
        const { name, description } = req.body;
        if(!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({
                status: "Bad Request",
                message: "Category ID is not valid!"
            })
        }
        if(name === undefined) {
            return res.status(400).json({
                status: "Bad Request",
                message: "Name is required!"
            })
        }

        var categoryUpdate = {};

        if(name !== undefined) {categoryUpdate.name = name};
        if(description !== undefined) {categoryUpdate.description = description};

        const result = await categoryModel.findByIdAndUpdate(categoryId, categoryUpdate);

        if(result) {
            return res.status(200).json({
                status: "Update category successfully",
                data: result
            })
        } else {
            return res.status(404).json({
                status: "Not Found"
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: "Internal server error",
            message: error.message
        })
    }
}
const deleteCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.categoryid;
        if(!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({
                status: "Bad Request",
                message: "Category ID is not valid!"
            })
        }

        // Kiểm tra xem category có đang được sử dụng bởi bất kỳ sản phẩm nào không
        const productCount = await productModel.countDocuments({ category: categoryId });
        if (productCount > 0) {
            return res.status(400).json({
                status: "Bad Request",
                message: "Cannot delete category because it is being used by one or more products!"
            })
        }

        const result = await categoryModel.findByIdAndDelete(categoryId);

        if(result) {
            return res.status(200).json({
                status: "Delete category successfully",
                data: result
            })
        } else {
            return res.status(404).json({
                status: "Not Found"
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: "Internal server error",
            message: error.message
        })
    }
}
const getCategoryByName = async (req, res) => {
    try {
        const categoryName = req.query.name;
        if (!categoryName) {
            return res.status(400).json({
                status: "Bad Request",
                message: "Name parameter is required!"
            });
        }

        const result = await categoryModel.find({ name: categoryName });

        if (result.length > 0) {
            return res.status(200).json({
                status: "Get category successfully",
                data: result
            });
        } else {
            return res.status(404).json({
                status: "Not Found",
                message: "No category found with the provided name."
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "Internal server error",
            message: error.message
        });
    }
};
module.exports = {
    createCategory,
    getAllCategory,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById,
    getCategoryByName
}