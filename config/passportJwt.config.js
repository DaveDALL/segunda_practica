const passport = require('passport')
const JWTStartegy = require('passport-jwt').Strategy
const JWTExtract = require('passport-jwt').ExtractJwt

const initializePassportJwt = () => {
    passport.use('jwtAuth', new JWTStartegy({
        jwtFromRequest: JWTExtract.fromExtractors([cookieExtractor]),
        secretOrKey: 'l4gr4ns3ns4c10nd3l4lb3r1c0qu3'
    }, async (jwt_payload, done) => {
        try {
            let checkPayload = jwt_payload
            delete checkPayload.iat
            delete checkPayload.exp
            let validPayload = (Object.keys(checkPayload).length === 0) ? false : true
            if(validPayload) {
                return done(null, jwt_payload)
            } else throw new Error('error de acceso con github')
        } catch(err) {
            return done(null, err)
        }
    }))
}

const cookieExtractor = (req) => {
    let token = null
    if(req && req.cookies) {
        token = req.cookies['jwtCookie']
        console.log(token)
    }
    
    return token
}

module.exports = initializePassportJwt
