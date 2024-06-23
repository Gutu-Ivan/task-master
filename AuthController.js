const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


const registerUser = async (req, res) => {

    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({msg: 'User already exist'});
        }

        user = new User ({
            name,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {user: {id: user.id}};


        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '12h'}, (err, token) => {
            if (err) throw err;
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 12 * 60 * 60 * 1000, // 12 часов
                sameSite: 'strict',
            });
            res.json({ token });
        })
        res.status(200).send('User saved successfully!');

    } catch (e) {
        console.error(e);
        res.status(500).send('Server Error');
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' }, (err, token) => {
            if (err) throw err;
            res.cookie("jwt", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 12 * 60 * 60 * 1000,
                sameSite: 'strict',
            });
            res.json({ token });
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}


module.exports = {
    registerUser,
    loginUser,
};
