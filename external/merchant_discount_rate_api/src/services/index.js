// src/index.js

const { hashPassword } = require('../helpers/bcrypt.helper');
const { loginToken } = require('./auth-login-token.service');

async function authenticateUser() {
    const credentials = {
        username: 'admin',
        password: 'test123' //$2b$10$Yq24ByddjxuqjO.4AopJzesG2rGFIER371iiinLy2WytjovT9Nb02
    };

    try {
        //const token = await loginToken(credentials);
        //console.log('Token JWT generado:', token);

        const hashed_password = await hashPassword("test123");
        console.log('hashed_password:', hashed_password);

    } catch (error) {
        console.error('Error durante la autenticación:', error.message);
    }
}

authenticateUser();
