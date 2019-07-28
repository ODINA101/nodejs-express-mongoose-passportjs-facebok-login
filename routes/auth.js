const Router = require('express').Router();
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passport = require('passport')


const authenticate = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Get user by email
            const user = await User.findOne({ email });
            // Match Password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    resolve(user);
                } else {
                    // Pass didn't match
                    reject('Authentication Failed');
                }
            })
        } catch (err) {
            // Email not found
            reject('Authentication Failed');
        }
    });
}

Router.post('/login', (req, res) => {
    const { email, password } = req.body;
    //Authenticate User
    authenticate(email, password).then(user => {
        const token = jwt.sign(user.toJSON(), 'satesto', {
            expiresIn: '15m'
        });
        const { iat, exp } = jwt.decode(token);
        // Respond with token
        res.send({ iat, exp, token });


    }).catch(error => {
        console.log(error)
        res.status(401).send(error)
    })
    //User Unauthorized

})



Router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    console.log(email)
    console.log(password)
    const user = new User({
        email,
        password
    })

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, async (err, hash) => {
            //Hash Password
            user.password = hash;
            try {
                const newUser = await user.save();
                res.send(201)
            } catch (err) {
                res.status(400).send(err);
            }

        })
    })
})




Router.post('/fb',
    passport.authenticate('facebook-token', { session: false }),
    function (req, res) {
        // do something with req.user
        res.send(req.user ? 200 : 401);
    })


module.exports = Router;