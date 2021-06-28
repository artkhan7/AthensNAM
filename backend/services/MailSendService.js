const nodemailer = require('nodemailer');
const SMTPServer = require('smtp-server').SMTPServer;

const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: CONFIG.mail_config_user,
        pass: CONFIG.mail_config_pass
    }
});

/* for now not using local smtp */
// const server = new SMTPServer({
//     onAuth: function(auth, session, callback) {
//         callback(null, { user : auth });
//     },
//     onData: function(stream, session, callback) {
//         console.log('received');
//     },
// });
// server.listen(CONFIG.smtp_port);

const messageTemplates = {
    registerConfirmation: {
        subject: 'Confirm registration',
        body: 'Please confirm registration by following to link <a href="__BASE_URL__/v1/users/confirmRegistration/__TOKEN__">Confirm registration</a>'
    }
};

const sendRegistrationConfirmation = function(token) {
    var body = messageTemplates.registerConfirmation.body
        .replace('__BASE_URL__', CONFIG.backend_url).replace('__TOKEN__', token);
    const message = {
        from: CONFIG.mail_config_user,
        to: user.email,
        subject: messageTemplates.registerConfirmation.subject,
        html: body
    };
    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    smtpTransport.sendMail(message, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent successfully!');
            console.log('Server responded with "%s"', info.response);
        }
        console.log('Closing Transport');
        smtpTransport.close();
    });
}

module.exports.sendRegistrationConfirmation = sendRegistrationConfirmation;
