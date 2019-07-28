const express = require('express')
const app = express();
const AuthRoute = require('./routes/auth')
const UsersRoute = require('./routes/users')
const PORT = 4000;
const mongoose = require('mongoose');
const passport = require('passport')
var bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
var FacebookTokenStrategy = require('passport-facebook-token');
const User = require('./models/user')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});
passport.use(new FacebookTokenStrategy({
    clientID: "523900844697524",
    clientSecret: "1a779f99cc88ff2b726e80ce6ac96162"
}, async (accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({ method: 'fb', facebookId: profile.id });

    if (user) {
        const token = jwt.sign(user.toJSON(), 'satesto', {
            expiresIn: '15m'
        });
        const { iat, exp } = jwt.decode(token);
        // Respond with token
        done(null, { iat, exp, token });
    } else {
        let user = new User({
            facebookId: profile.id,
            method: 'fb',
            email: profile.emails[0].value
        })
        await user.save();
        const token = jwt.sign(user.toJSON(), 'satesto', {
            expiresIn: '15m'
        });
        const { iat, exp } = jwt.decode(token);
        // Respond with token
        done(null, { iat, exp, token });

    }

    // new User.findOrCreate({ facebookId: profile.id }, function (error, user) {
    //     return done(error, user);
    // });


    console.log('accessToken', accessToken)
    console.log('refreshToken', refreshToken)
    console.log('profile', profile)
}
));


mongoose.connect('mongodb://localhost:27017/satestod', { useNewUrlParser: true }, (err) => {
    if (!err) console.log('database connected')
});



app.use('/api/auth', AuthRoute)
app.use('/api', UsersRoute)

app.listen(PORT, () => {
    console.log('server running on PORT ' + PORT)
})

