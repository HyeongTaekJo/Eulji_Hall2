const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //공란 제거
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: {
        type: String, // 여기서 'string'을 'String'으로 수정
    },
    cart: {
        type: Array,
        default: []
    },
    history: {
        type: Array,
        default: []
    },
})

//몽구스 기능
//save하기 전에 먼저 실행되는 것
//비밀번호를 암호화 시킨다.
userSchema.pre('save', async function(next) { //저장하기전 실행
    let user = this; //save를 수행하는 user를 가르킴 즉, 사용자가 입력한 user에 객체를 가르킴

    if(user.isModified('password')){ 
        const salt = await bcrypt.genSalt(10); //랜덤값
        const hash = await bcrypt.hash(user.password, salt); //랜덤값이랑 같이 해쉬한다.
        user.password = hash;
    }

    next();
});

//비밀번호 일치하는지 확인
//Schema에 메서드를 추가하는 방식
userSchema.methods.comparePassword = async function(plainPassword) {//plainPassword은 입력한 비밀번호
    let user = this; //일치하는 이메일이 DB에 있어서 가져온 데이터, 그래서 비번은 암호화 되어 있음

    //입력한 비밀번호와 DB와 일치하는지 확인
    //plainPassword을 알아서 솔트해쉬해서 비교한다.
    //compare할때 어떻게 입력한 비밀번호와 솔트해싱된 비번과 비교가 가능하냐는 의문점이 생기겠지만
    //compare는 알아서 user.password 즉, hashe된 패스워드에서 솔트를 알아서 추출한다.
    const match = await bcrypt.compare(plainPassword, user.password); 
    
    return match; //true OR false
}


const User = mongoose.model('User', userSchema)

module.exports = User;