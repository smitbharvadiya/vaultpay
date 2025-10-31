import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt, { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import userModel from '../models/user.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Vault API is running...');
});

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await userModel.findOne({email});
    if(existingUser){
        return res.status(400).json({ message: "Email already exists. Please log in." });
    }

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async (err, hash) => {
            try {
                const createdUser = await userModel.create({
                    email: email,
                    password: hash
                });

                const token = jwt.sign(
                    {email : createdUser.email},
                    process.env.JWT_SECRET,
                    {expiresIn: '1h'}
                );

                res.cookie("token", token);

                res.status(201).json({
                    message: 'User Created Succesfully',
                    user: createdUser,
                    token: token
                });

            }catch(err){
                console.log(err);
                res.status(500).json({message: 'Error Creating User',err});
            }
        });
    });

});

app.post("/login", async (req, res) => {
    const user = await userModel.findOne({email: req.body.email})
    if(!user) return res.status(400).json({message: "User Not Found!"});

    bcrypt.compare(req.body.password, user.password, function(err, result){
        if(result){
            const token = jwt.sign(
                {email : user.email},
                process.env.JWT_SECRET,
                {expiresIn: '1h'}
            );

            res.cookie("token", token);

            res.status(200).json({ message: "User matched" });
        }else{
            res.status(500).json({ message: "Error Login", error: err });
        }
    });
});

app.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({message: "Logout Succesfull"});
});

app.use('/api/payments', (req, res) => {
    res.json({ message: 'Payments route works!' });
});

export default app;