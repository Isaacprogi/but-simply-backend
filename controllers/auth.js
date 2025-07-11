const fs = require('fs');
const path = require('path');
const { createAccessToken, createRefreshToken, sendAccessToken, sendRefreshToken } = require('../utils/token');
const staffData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/staffs.json'), 'utf8')
);




// Login user
const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user in staff data
        const user = staffData.find(staff => staff.email === email);

        if (!user) {
            return next({
                status: 401,
                message: [{
                    msg: 'Invalid credentials',
                    path: 'error'
                }]
            });
        }

        const isPasswordValid = user.password === password;

        if (!isPasswordValid) {
            return next({
                status: 401,
                message: [{
                    msg: 'Invalid credentials',
                    path: 'error'
                }]
            });
        }

        // Generate tokens
        const accessToken = createAccessToken(user.id);
        const refreshToken = createRefreshToken(user.id);

        sendRefreshToken(res, refreshToken);

        const { password: pw, ...userWithoutPassword } = user;

        sendAccessToken(res, accessToken, userWithoutPassword);
    } catch (error) {
        next({
            message: [{
                msg: 'Internal Server error',
                path: 'error'
            }]
        });
    }
};



// Logout user
const logout = (req, res, next) => {
    res.clearCookie('ref', { httpOnly: true, secure: false, sameSite: 'None', path: '/' });
    return res.json({
        message: 'Logged out',
    });
};



module.exports = {
    login,
    logout,
};
