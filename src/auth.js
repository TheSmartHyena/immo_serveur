const myRoutes = require('./routesTriggers').routes

exports.get_logout = (app, myRequired, sessions)=>{

    app.get(myRoutes.logout, async (req, res)=>{

        // unset session id from cookie and removes it from the valid sessions store
        if(req.session.myId){

            const result = app.sessions.get(req.session.myId)
            if (result === undefined) {
                req.session.destroy() // rm the session itself, because it's a wrong one
                res.redirect(myRoutes.login)
                app.locals.userName = ""
                app.locals.userRole = ""
            }else{
                app.sessions.del(req.session.myId) // rm from the allowed session db
                req.session.destroy() // rm the session itself
                res.redirect(myRoutes.login)
                app.locals.userName = ""
                app.locals.userRole = ""
            }

        }else{
            res.redirect(myRoutes.login)
        }

    })

}

exports.get_login = (app)=>{

    app.get(myRoutes.login, (req, res)=>{
        res.render('thoriumLogin', {navbarBool: res.navbarBool})
    })

}

exports.post_login = (app, myRequired, sessions)=>{

    app.post(myRoutes.login, async (req, res)=>{

        const data = req.body
        const newUserNni = data.nni.toUpperCase()

        await myRequired.custom.request.doAnRequest(myRequired, 'userByNni', [newUserNni])
            .then(result => {

                if(result.length > 0) {
                    const matches = myRequired.bcrypt.compareSync(data.pw, result ? result[0].password : "")
                    if (matches) {

                        // create a session id and store it
                        const newSessionId = myRequired.uuidv1();
                        app.sessions.set(newSessionId, {
                            userId: result[0].idutilisateur,
                            userNni: newUserNni,
                            sessionId: newSessionId,
                            userGroup: result[0].idgroupe,
                            userIdService: result[0].service
                        })

                        app.locals.userName = result[0].prenom + " " + result[0].nom
                        app.locals.userRole = result[0].idgroupe === 1 ? "Administrateur" : "Utilisateur"

                        req.session.myId = newSessionId // set the cookie

                        res.redirect(myRoutes.index)
                    } else {
                        req.session.message = {msg: "Nni ou mot de passe incorecte", theme: "danger"}
                        res.redirect(myRoutes.login)
                    }
                }else{
                    res.redirect(myRoutes.login)
                }

            }).catch(err => console.log(err))

    })

}