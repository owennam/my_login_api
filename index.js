// index.js (최종 디버깅 - 일반 텍스트 비밀번호 비교 버전)

// ▼▼▼▼▼ 어떤 에러든 잡아내는 코드 (파일 최상단에 추가) ▼▼▼▼▼
process.on('uncaughtException', (error, origin) => {
    console.log('----- An uncaught exception occurred -----');
    console.log(error);
    console.log('Exception origin:', origin);
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('----- An unhandled rejection occurred -----');
    console.log(reason);
    console.log('Unhandled Rejection at:', promise);
});
// ▲▲▲▲▲ 어떤 에러든 잡아내는 코드 ▲▲▲▲▲

const express = require('express');
// const bcrypt = require('bcryptjs'); // bcrypt를 완전히 제거!
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

// ▼▼▼▼▼ 비밀번호를 일반 텍스트로 저장 ▼▼▼▼▼
const dummyUsers = [
    {
        id: 1,
        user_id: 'testuser',
        password: 'password123', // password_hash가 아닌 password
        name: '테스트유저'
    }
];
// ▲▲▲▲▲ 비밀번호를 일반 텍스트로 저장 ▲▲▲▲▲

const app = express();
app.use(express.json());
app.use(cors());

app.post('/login', async (req, res) => {
    console.log("--- New Login Request Received ---");
    console.log("Request Body:", req.body);
    try {
        const { userId, password } = req.body;
        console.log("Extracted Data -> userId:", userId, ", password:", password);
        
        if (!userId || !password) {
            return res.status(400).json({ message: '아이디와 비밀번호를 모두 입력해주세요.' });
        }
        
        const user = dummyUsers.find(u => u.user_id === userId);
        console.log("User search result:", user);

        if (!user) {
            return res.status(401).json({ message: 'DEBUG-MESSAGE-USER-NOT-FOUND' });
        }

        // ▼▼▼▼▼ 비밀번호를 일반 텍스트로 비교 ▼▼▼▼▼
        const isPasswordMatch = (password === user.password);
        console.log("Password match result:", isPasswordMatch);
        // ▲▲▲▲▲ 비밀번호를 일반 텍스트로 비교 ▲▲▲▲▲

        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'DEBUG-MESSAGE-PASSWORD-FAIL' });
        }

        console.log("Login successful! Generating token...");
        const token = jwt.sign(
            { id: user.id, userId: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({ message: '로그인 성공!', token: token });

    } catch (error) {
        console.error('Login API Error:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});