import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import * as dotenv from "dotenv";
dotenv.config();

const credentials = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALL_BACK_URL,
}

const fetchCalendarData = async () => {
    passport.use(
        new GoogleStrategy(
            {
                ...credentials,
                passReqToCallback: true,
            },
            async function (request, accessToken, refreshToken, profile, done) {
                const data = {
                    profile: profile
                }
                return done(null, data);
            }
        )
    );
}

const initializePassport = async () => {
    await fetchCalendarData();
  };
  
  initializePassport();

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});