const myRoutesTriggers = require('./routesTriggers')

exports.checkPassword = (app, myRequired)=>{
    return async function(req, res, next){

        let trigger = myInclude(myRoutesTriggers.checkPasswordTriggers, req.originalUrl)
        if(trigger) {

            let result = false
            if(req.body.hash && req.body.hash !== ''){
                result = await app.bcrypt.compare("password", req.body.hash)
            }

            result ? next() : next(new Error("Invalid password"))

        }else{
            next()
        }

    }
}

/*
* Check if user connected, otherwise redirect to login page
* */
exports.checkSession = (app)=>{
    return async function(req, res, next){

        let trigger = myInclude(myRoutesTriggers.checkSessionTriggers, req.originalUrl)
        if(trigger) {

            if (req.session.myId) {
                
                /**
                 * app.sessions contiens les sessions valide suite au login de l'user
                 */

                const result = app.sessions.get(req.session.myId)
                //console.log(result)
                if (result.sessionId === req.session.myId) {

                    next()
                } else {
                    res.redirect(myRoutesTriggers.routes.login)
                }
            } else {
                res.redirect(myRoutesTriggers.routes.login)
            }

        }else{
            next()
        }

    }
}

/*
* Automatic redirect if user has no access to requested page ==> simple user cannot access admin page
* */
exports.checkRoles = (app)=>{
    return async function(req, res, next){

        let trigger = myInclude(myRoutesTriggers.checkRolesTriggers, req.originalUrl)
        if(trigger) {

            if(req.session.myId) {

                const allowedGroups = myRoutesTriggers.routeAllowedGroup.get(req.originalUrl)
                const sessionData = app.sessions.get(req.session.myId)
                if(allowedGroups.has(sessionData.userGroup)) {

                    next()
                }else{
                    res.redirect(myRoutesTriggers.routes.default)
                }

            }else{
                res.redirect(myRoutesTriggers.routes.default)
            }

        }else{
            next()
        }

    }
}

exports.navbarElements = (app)=>{
    return async function(req, res, next){

        const result = {
            isLogin: false,
            isAdmin: false,
            isUser: false
        }

        if(req.originalUrl.includes("login")){
            result.isLogin = true
        }else{
            if(isValid(req.session.myId)){

                const sessionData = app.sessions.get(req.session.myId)
                if(sessionData && sessionData.sessionId === req.session.myId){
                    result.isUser = true
                }

                if(sessionData && sessionData.userGroup === 1){
                    result.isAdmin = true
                }

            }
        }

        res.navbarBool = result

        next()

    }
}

exports.redirectIfLogged = (app)=>{
    return async function(req, res, next){

        if(req.originalUrl.includes("login")){
            if(isValid(req.session.myId)){
                const sessionData = app.sessions.get(req.session.myId)
                if(sessionData && sessionData.sessionId === req.session.myId){
                    // so you're logged
                    res.redirect(myRoutesTriggers.routes.default)
                }else{
                    next()
                }
            }else{
                next()
            }
        }else{
            next()
        }



    }
}

function myInclude(iterable, parent){

    let result = false

    iterable.forEach((item)=>{
        if(parent.includes(item)){
            result = true
        }
    })

    return result

}

function isValid(toValidate){

    let result = false

    if(toValidate === undefined || toValidate === ""){
        result = false
    }else{
        result = true
    }

    return result

}