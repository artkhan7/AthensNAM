const User          = require('../models').User;
const authService   = require('./../services/AuthService');
const uuidv4        = require('uuid/v4');
const mailSendService   = require('./../services/MailSendService');

function leaveOnlyFields(obj, fields) {
    let res = Object.assign({}, obj);
    for (var key in res) {
        if (fields.indexOf(key) === -1) {
            res[key] = undefined;
        }
    }
    return res;
}

const create = async function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    const body = req.body;

    if(!body.unique_key) {
        return ReE(res, 'Please enter an email to register.');
    } else if(!body.password) {
        return ReE(res, 'Please enter a password to register.');
    } else {
        let err, user;

        body.confirm_token = uuidv4();
        [err, user] = await to(authService.createUser(body));

        if(err) return ReE(res, err, 422);
        mailSendService.sendRegistrationConfirmation(body.confirm_token);
        return ReS(res, {message:'Successfully created new user.', user:user.toWeb()}, 201);
    }
}

const get = async function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    let user = req.user;

    return ReS(res, {user:user.toWeb()});
}

const update = async function(req, res) {
    let err, user, data
    user = req.user;
    data = req.body;
    data.email = undefined; // not allow update email
    user.set(data);
    [err, user] = await to(user.save());
    if(err){
        if(err.message=='Validation error') err = 'The email address is already in use';
        return ReE(res, err);
    }
    return ReS(res, {message :'Updated User: ' + user.email});
}

const remove = async function(req, res) {
    let user, err;
    user = req.user;

    [err, user] = await to(user.destroy());
    if(err) return ReE(res, 'error occured trying to delete user');

    return ReS(res, {message:'Deleted User'}, 204);
}

const login = async function(req, res){
    const body = req.body;
    let err, user;

    [err, user] = await to(authService.authUser(req.body));
    if(err) return ReE(res, err, 422);
    if (!user.get({plain:true}).is_active) return ReE(res, "Account not activated", 403);
    let resultUser = leaveOnlyFields(user.get({plain:true}), ['email', 'first', 'last']);
    return ReS(res, {token:user.getJWT(), user:resultUser});
}

const confirmRegistration = async function(req, res) {
    let err, user;
    [err, user] = await to(User.find({
        where: {
            confirm_token: req.params.confirm_token
        }
    }));
    if (err || user === undefined) ReE(res, 'Wrong user');
    [err, user] = await to(user.updateAttributes({
        is_active: true
    }));

    if(err) {
        return ReE(res, 'Unable to activate user');
    }
    res.writeHead(302, {
        'Location': CONFIG.frontend_url + '/login'
    });
    res.end();
    return ReS(res, {message :'User Activated: ' + user.email});
}


module.exports.create = create;
module.exports.get = get;
module.exports.update = update;
module.exports.remove = remove;
module.exports.login = login;
module.exports.confirmRegistration = confirmRegistration;

