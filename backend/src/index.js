const dotenv = require('dotenv');
dotenv.config({ path: '.env' })

const express = require('express');
const path = require('path');
const cors = require('cors');

const mongoose = require('mongoose');

const port = 5000;
const app = express();

// CORS 처리
const corsOptions = {
    //프록시 처리하지 말 것 오류남
    origin: '*', //프론트엔드 3000요청 허용,
    // origin: [
    //          "http://140.245.65.135",
    //          "http://www.hallreservation.site",
    //         //  "http://localhost:5000",
    //         //  "http://localhost",
    //         ], // 허용할 출처
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // 허용할 헤더
};

app.use(cors(
    corsOptions
));

// app.use((req, res, next) => {
//     const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
//     console.log(`[${req.method}] ${fullUrl}`);
//     next();
// });


app.use(express.json());

mongoose.connect("mongodb+srv://diajd1:rpdla5627%40@cluster0.z3j50.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    
    console.log('MongoDB 연결완료...');
})
.catch(err => {
    console.error(err);
})

app.get('/', (req, res, next) => {
    setImmediate(() => {next( new Error('dd'))}); 
})

app.post('/', (req, res) => {
    console.log(req.body);
    res.send(req.body);
})

///users 이 경로로 요청이 오면 해당 라우터로 간다.
app.use('/users', require('./routes/users')) 

///reservations 이 경로로 요청이 오면 해당 라우터로 간다.
app.use('/reservations', require('./routes/reservations')) 



//에러 처리기(에러가 발생하면 서버가 다운되지 않도록 하는 것)
app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.send(error.message || '서버에서 에러가 났습니다.');
})

app.use(express.static(path.join(__dirname, '../uploads')));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});