import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { AuthService } from "../models/auth/auth.service";

dotenv.config();

// GOOGLE STRATEGY
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try {
                const user = await AuthService.findOrCreateUser({
                    email: profile.emails?.[0].value || "",
                    name: profile.displayName,
                    provider: "google",
                    providerId: profile.id,
                    avatar: profile.photos?.[0].value,
                });

                done(null, user);
            } catch (error) {
                done(error, false);
            }
        },
    ),
);


passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    const user = await import("../models/user/user.model").then((m) =>
        m.User.findById(id),
    );
    done(null, user);
});

export default passport;
