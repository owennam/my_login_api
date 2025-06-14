// index.js (글로벌 에러 핸들러 추가 버전)

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
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const dummyUsers = [
    {
        id: 1,
        user_id: 'testuser',
        password_hash: '$2a$10$fVfSjR9T1g2Z/Zc3jB/gU.jL9gH.sU.jL9gH.sU.jL9gH.sU.jL9',
        name: '테스트유저'
    }
];

const app = express();
app.use(express.json());
app.use(cors());

app.post('/login', async (req, res) => {
    try {
        const { userId, password } = req.body;
        if (!userId || !password) {
            return res.status(400).json({ message: '아이디와 비밀번호를 모두 입력해주세요.' });
        }
        
        const user = dummyUsers.find(u => u.user_id === userId);
        if (!user) {
            return res.status(401).json({ message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
        }

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