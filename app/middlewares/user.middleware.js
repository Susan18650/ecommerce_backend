// general check user middleware

const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const verifyToken = async (req, res, next) => {
    try {
        console.log('verify token ...');
        let token = req.headers['x-access-token'];
        console.log(token);
        if (!token) {
            return res.status(401).json({
                message: "Token not found!"
            });
        }

        const secretKey = process.env.JWT_SECRET;

        const verified = jwt.verify(token, secretKey);
        console.log(verified);
        if (!verified) {
            return res.status(401).json({
                message: "Token invalid!"
            });
        }

        const user = await userModel.findById(verified.id).populate("roles");
        console.log(user);
        req.user = user;

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const checkUser = async (req, res, next) => {
    try {
        console.log('check user ...');
        const userRoles = req.user.roles;
        console.log(req.user);
        if (userRoles) {
            for (let i = 0; i < userRoles.length; i++) {
                console.log(userRoles[i].name);
                switch (userRoles[i].name) {
                    case 'Admin':
                        console.log('Admin authorized!');
                        next();
                        return;
                    case 'Moderator':
                        if (req.method === 'GET' || req.method === 'POST' || req.method === 'PUT') {
                            console.log('Moderator authorized!');
                            next();
                            return;
                        }
                    case 'User':
                        if (req.method === 'GET' || req.method === 'PUT') {
                            if ('role' in req.body) {
                                console.log('User cannot update the role!');
                                return res.status(403).json({
                                    message: "User cannot update the role!"
                                });
                            }
                            if (req.params.userid === req.user._id.toString()) {
                                console.log('User authorized!');
                                next();
                                return;
                            } else {
                                console.log('Unauthorized!');
                                return res.status(401).json({
                                    message: "Unauthorized!"
                                });
                            }
                        }
                    case 'Guest':
                        if (req.method === 'GET' || req.method === 'PUT' || req.method === 'DELETE') {
                            if ('role' in req.body) {
                                console.log('Guest cannot update the role!');
                                return res.status(403).json({
                                    message: "Guest cannot update the role!"
                                });
                            }
                            if (req.params.userid === req.user._id.toString()) {
                                console.log('Guest authorized!');
                                next();
                                return;
                            } else {
                                console.log('Unauthorized!');
                                return res.status(401).json({
                                    message: "Unauthorized!"
                                });
                            }
                        }
                    default:
                        console.log('Unauthorized!');
                        return res.status(401).json({
                            message: "Unauthorized!"
                        });
                }
            }
        }
        console.log('Unauthorized!');
        return res.status(401).json({
            message: "Unauthorized!"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = {
    verifyToken,
    checkUser
};
