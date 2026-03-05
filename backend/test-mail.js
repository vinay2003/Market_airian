const nodemailer = require('nodemailer');
require('dotenv').config();

async function testMail() {
    console.log('Testing SMTP connection...');
    console.log('Host:', process.env.MAIL_HOST);
    console.log('Port:', process.env.MAIL_PORT);
    console.log('User:', process.env.MAIL_USER);
    // Mask password
    const pass = process.env.MAIL_PASS || '';
    console.log('Password Length:', pass.length);
    if (pass.startsWith('"') && pass.endsWith('"')) {
        console.warn('WARNING: Password has quotes in .env!');
    }

    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    try {
        await transporter.verify();
        console.log('SUCCESS: SMTP connection verified!');
    } catch (err) {
        console.error('FAILURE: SMTP connection failed:', err.message);
        if (err.message.includes('Invalid login')) {
            console.error('Hint: Check your password or use an App Password.');
        }
    }
}

testMail();
