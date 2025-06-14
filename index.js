// index.js (이름 + 이메일로 로그인하는 버전)

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

const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

// ▼▼▼▼▼ 더미 유저 데이터 (이름+이메일 조합) ▼▼▼▼▼
const dummyUsers = [
    {
        id: 1,
        name: '테스트유저',
        email: 'testuser@example.com'
    }
];
// ▲▲▲▲▲ 더미 유저 데이터 ▲▲▲▲▲

const app = express();
app.use(express.json());
app.use(cors());

app.post('/login', async (req, res) => {
    console.log("--- New Login Request Received ---");
    console.log("Request Body:", req.body);
    try {
        // 프론트엔드에서 "이름" → name, "이메일" → email로 전달
        const { name, email } = req.body;
        console.log("Extracted Data -> name:", name, ", email:", email);

        // 입력값 체크
        if (!name || !email) {
            return res.status(400).json({ message: '이름과 이메일을 모두 입력해주세요.' });
        }

        // 이름과 이메일이 모두 일치하는 유저 검색
        const user = dummyUsers.find(u => u.name === name && u.email === email);
        console.log("User search result:", user);

        if (!user) {
            return res.status(401).json({ message: '해당 이름 또는 이메일이 일치하지 않습니다.' });
        }

        // JWT 발급
        console.log("Login successful! Generating token...");
        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
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
