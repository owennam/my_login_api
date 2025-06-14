// index.js

// 1. 필요한 라이브러리 불러오기
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

// 2. 가짜 사용자 데이터 생성 (DB 역할)
// 이 부분이 정확해야 합니다.
const dummyUsers = [
    {
        id: 1,
        user_id: 'testuser',
        password_hash: '$2a$10$fVfSjR9T1g2Z/Zc3jB/gU.jL9gH.sU.jL9gH.sU.jL9gH.sU.jL9', // 'password123'의 해시값
        name: '테스트유저'
    }
];

const app = express();
app.use(express.json()); // 요청 본문의 JSON을 파싱하기 위함
app.use(cors()); // CORS 허용

// 3. 로그인 API 엔드포인트(경로) 생성
app.post('/login', async (req, res) => {
    try {
        // 4. 사용자가 보낸 아이디와 비밀번호 받기
        const { userId, password } = req.body;

        if (!userId || !password) {
            return res.status(400).json({ message: '아이디와 비밀번호를 모두 입력해주세요.' });
        }
        
        // 5. 배열에서 사용자 찾기
        const user = dummyUsers.find(u => u.user_id === userId);

        // 6. 사용자가 존재하지 않는 경우
        if (!user) {
            return res.status(401).json({ message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
        }

        // 7. 비밀번호 비교
        const isPasswordMatch = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordMatch) {
            return res.status(401).json({ message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
        }

        // 8. 로그인 성공: JWT(임시 출입증) 생성
        const token = jwt.sign(
            { id: user.id, userId: user.user_id }, // 토큰에 담을 정보
            process.env.JWT_SECRET, // 서명에 사용할 비밀키
            { expiresIn: '1h' } // 유효기간 (예: 1시간)
        );

        // 9. 성공 응답과 함께 토큰 전송
        res.status(200).json({ message: '로그인 성공!', token: token });

    } catch (error) {
        console.error('로그인 API 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`${PORT}번 포트에서 서버가 실행되었습니다.`);
});