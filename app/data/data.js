const roleModel = require("../models/role.model");

const initialRole = async () => {
    const countRole = await roleModel.estimatedDocumentCount();

    if (countRole === 0) {
        await new roleModel({
            name: "Admin"
        }).save();
        await new roleModel({
            name: "Moderator"
        }).save();
        await new roleModel({
            name: "User"
        }).save();
        await new roleModel({
            name: "Guest"
        }).save();
        await new roleModel({
            name: "Supplier" //đối tác cung cấp sản phẩm
        }).save();
        await new roleModel({
            name: "Maintenance" //nhân viên bảo trì
        }).save();
        await new roleModel({
            name: "Promotion" //quản lý khuyến mại
        }).save();
    }
}

module.exports = {
    initialRole
}