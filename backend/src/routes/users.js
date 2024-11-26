const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' })

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');
const User = require('../models/User');

//앞에서 /users로 와서 생략한다.
//회원가입
router.post('/register', async(req, res, next) => {
    try{
        const user  = new User(req.body);
        await user.save();
        return res.sendStatus(200);
    } 
    catch(error){
        next(error)
    }
});


//로그인이된 유저가 페이지를 움길때 마다 호출된다.
// auth 미들웨어 등록한 것(해당 라우터가 실행되기전에 auth 미들웨어가 먼저 실행된다.)
router.get('/auth', auth, async(req, res) => { //auth 미들웨어를 통과한다는 것 자체가 올바른 유저라는 뜻이다
    
    return res.json({ //여기까지 온것은 미들웨어로 user 데이터를 다 가져왔음 아니면 그전에 미들웨어에서 리턴됬을 것
        id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true, //회사마다 정책이 다를 수 있다. 지금은 0 일반유저, 0이 아니면 관리자
        isAuth: true,
        email : req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history
    })
});

//만일 userSlice에 userData에 없는 변수가 있으면 가져오더라도 리덕스 store에 저장이 안되므로 userData에 변수를 선언해줘야 한다.


// 로그인
router.post('/login', async(req, res, next) => {
    try{
        //존재하는 유저인지 체크
       const user = await User.findOne({email: req.body.email});

       if(!user){
        return res.status(400).send("이메일이 존재하지 않습니다.");
       }

       //비밀번호가 올바른 것인지 체크
       const isMatch = await user.comparePassword(req.body.password); //comparePassword는 모델에 있는 거
       if(!isMatch)
         return res.status(400).send("잘못된 비밀번호 입니다.");

       const payload = { //몽고 DB 컬렉션 데이터 ID
            userId: user._id.toString(),
       }

       //토큰 생성(JWT) 백엔드에서만 알고 있는 JWT_SECRET을 포함하여 토큰 생성
       const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'});

       return res.json({user, accessToken})
    } 
    catch(error){
        next(error)
    }
});

//로그아웃
router.post('/logout',auth, async(req, res, next) => { //auth 미들웨어를 통과한다는 것 자체가 올바른 유저라는 뜻이다
    try{
        return res.sendStatus(200);
    } 
    catch(error){
        next(error)
    }
});


// 비밀번호 찾기
router.post('/findPassword', async (req, res, next) => {
    try {
        const { searchId, searchName } = req.body;

        console.log("searchId->" + searchId);
        console.log("searchName->" + searchName);

        // 사용자 정보 검증
        const user = await User.findOne({
            name: searchName, // 이름 필드
            email: searchId   // 이메일 필드
        });

        console.log("user->", user);

        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        return res.json(user)
    } catch (error) {
        console.error("Error finding user:", error);
        next(error);
    }
});
  
  //비밀번호 변경
  router.post('/changePassword', async (req, res, next) => {
    try {
        const { password, id } = req.body; 

         // 사용자 조회
         const user = await User.findOne({
            email: id   // 이메일 필드
        });
         if (!user) {
             return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
         }

        //비밀번호가 올바른 것인지 체크
        const isMatch = await user.comparePassword(password); //comparePassword는 모델에 있는 거
        if(isMatch){
            return res.status(400).send("기존 비밀번호와 동일합니다.");
        }

         // 비밀번호 업데이트
         user.password = password; // 비밀번호 필드 업데이트 (필드명이 `password`라고 가정)
         await user.save(); // 변경 사항 저장
 
         return res.status(200).json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
    } catch (error) {
      next(error);
    }
  });


module.exports = router;