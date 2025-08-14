// controllers/user.controller.js
import userService from '../services/user.service.js';
import { sendResponse } from '../helpers/response.js';

export const register = async (req, res) => {
try {
    const result = await userService.register(req.body);
    sendResponse(res, 201, true, 'User registered successfully', result);
} catch (err) {
    sendResponse(res, 400, false, err.message);
}
};

export const login = async (req, res) => {
try {
    const tokens = await userService.login(req.body.email, req.body.password);
    sendResponse(res, 200, true, 'Login successful', tokens);
} catch (err) {
    sendResponse(res, 401, false, err.message);
}
};

export const refresh = async (req, res) => {
try {
    const tokens = await userService.refreshToken(req.body.refreshToken);
    sendResponse(res, 200, true, 'Token refreshed successfully', tokens);
} catch (err) {
    sendResponse(res, 403, false, err.message);
}
};

export const getAllUsers = async (req, res) => {
try {
    const users = await userService.getAllUsers();
    sendResponse(res, 200, true, 'Users retrieved successfully', users);
} catch (err) {
    sendResponse(res, 500, false, err.message);
}
};

export const logout = async (req, res) => {
try {
    const result = await userService.logout(req.body.refreshToken);
    sendResponse(res, 200, true, 'Logout successful', result);
} catch (err) {
    sendResponse(res, 400, false, err.message);
}
};
