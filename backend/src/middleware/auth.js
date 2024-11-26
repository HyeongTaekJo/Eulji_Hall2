
const dotenv = require('dotenv');
dotenv.config({ path: '.env' })

// 인증 처리하는 곳
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let auth = async (req, res, next) => {
    //토큰을 request headers에서 가져오기
    const authHeader = req.headers['authorization'];

    
    //토큰을 만들을 때 userId를 넣어서 만들었다 그것만 빼내려는 작업
    const token = authHeader && authHeader.split(' ')[1]; //authHeader 있으면 authHeader을 공란기준으로 나눈다는 뜻
    
    if(token === null) return res.sendStatus(401);
    try{
        //토큰이 유효한지 확인
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({"_id": decode.userId});//몽고DB 아틀라스에 있는데이터는 고유 id 키값을 가지고 있는데 그것을 추출한 것
        if(!user){
            return res.status(400).send('없는 유저입니다.');
        }
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = auth;