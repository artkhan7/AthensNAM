const User      = require('./../models').User;
const validator = require('validator');

const createUser = async function(userInfo){
    let unique_key, auth_info, err;

    unique_key = userInfo.unique_key;
    if(!unique_key) TE('An email was not entered.');

    if(validator.isEmail(unique_key)){
        userInfo.email = unique_key;

        [err, user] = await to(User.create(userInfo));
        if(err) TE('user already exists with that email');

        return user;

    }else{
        TE('A valid email was not entered.');
    }
}

const authUser = async function(userInfo){//returns token

    if(!userInfo.unique_key) TE('Please enter an email to login');

    if(!userInfo.password) TE('Please enter a password to login');

    let user;
    if(validator.isEmail(userInfo.unique_key)) {

        [err, user] = await to(User.findOne({where:{email: userInfo.unique_key}}));
        if(err) TE(err.message);

    } else {
        TE('A valid email was not entered');
    }

    if(!user) TE('Email or password are not valid');

    [err, user] = await to(user.comparePassword(userInfo.password));

    if(err) TE("Email or password are not valid");

    return user;

}

module.exports.createUser = createUser;
module.exports.authUser = authUser;
