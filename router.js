const bcrypt = require("bcrypt");
class Router {
    constructor(app, db) {
        this.login(app, db);
        this.isLoggedIn(app, db);
    }

    login(app, db) {
        app.post("/login", (req, res) => {
            let username = req.body.username;
            let password = req.body.password;

            username = username.toLowerCase();
            if(username.length > 12 || password.length > 12) {
                res.json({
                    success: false,
                    message: "Username or password is too long"
                })
                return;
            }

            let cols = [username];
            db.query('SELECT * FROM users WHERE username = ? LIMIT 1' , cols, (err, data , fields) => {
                if(err){
                    res.json({
                        success: false,
                        message: "Error: " + err
                    }) 
                    return;
                }
                if(data && data.length === 1) {
                    bcrypt.compare(password, data[0].password, (err, result) => {
                        if(result) {
                            req.session.user_id = data[0].user_id;
                            console.log(req.session.user_id);
                            res.json({
                                success: true,
                                message: "Logged in successfully"
                            })
                            return;
                        }else{
                            res.json({
                                success: false,
                                message: "Incorrect password"
                            })
                            return;
                        }
                    });
                }else
                {
                    res.json({
                        success: false,
                        message: "User not found"
                    })
                    return;
                }
            });

        });
    }
    logout(app, db) {
    }
    isLoggedIn(app, db) {
        app.post('/isLoggedIn', (req, res) => {
            if(req.session.user_id) {
                let cols = [req.session.user_id];
                db.query('SELECT * FROM users WHERE user_id = ? LIMIT 1' , cols, (err, data , fields) => {
                    if(data && data.length === 1) {
                        res.json({
                            success: true,
                            message: "User is logged in"
                        })
                        return true;
                    }
                    else {
                        res.json({
                            success: false,
                        })
                    }
                });
            }else{
                res.json({
                    success: false,
                })
                return;
            }
        })
    }
}

module.exports = Router;