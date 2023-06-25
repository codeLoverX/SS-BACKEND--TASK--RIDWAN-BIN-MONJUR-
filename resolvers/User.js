const { UserInputError } = require("apollo-server-express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const user = {
    Query: {},
    Mutation: {
        login: async (_parent, args, context) => {
            try {
                const select = "+password";
                const { email, password } = args.patch;
                const user = await User.findOne({ email }).select(select);
                if (!user) {
                    throw new UserInputError("Cannot find the user's email.");
                }
                const match = await bcrypt.compare(password, user.password);
                if (!match) {
                    throw new UserInputError("Wrong password entered.");
                }
                user._id = user._id.toString();
                const accessToken = jwt.sign({ "userID": user._id, "role": user.role }, process.env.JWT_SECRET, {
                    expiresIn: '1d'
                });
                console.log({ accessToken })
                context.res.cookie('token', 'accessToken')
                return {token: accessToken};
            }
            catch (error) {
                throw new Error(error);
            }
        },
        register: async (_parent, args) => {
            try {
                const saltRounds = 10;
                let { name, email, password, role, confirmPassword } = args.patch;
                console.log({ name, email, password, role, confirmPassword })
                role ??= "Normal";
                if (password !== confirmPassword) {
                    throw new UserInputError("Password and confirmed password must match!");
                }
                let hashedPassword = await bcrypt.hash(password, saltRounds);
                let user = new User({ name, email, password: hashedPassword, role });
                await user.save();
                console.log({ user });
                return user;
            } catch (error) {
                throw new Error(error);
            }
        }
    }
}

module.exports = {
    user
}