const queryString = require('query-string');
const axios = require('axios');
const multer = require('multer');
var path = require('path')

require('dotenv').config()


exports.loginUrl = async (req, res) => {
    const stringifiedParams = queryString.stringify({
        client_id: process.env.CLIENT_ID,
        redirect_uri: process.env.REDIRECT_URI,
        scope: process.env.SCOPE, // comma seperated string
        response_type: 'code',
        auth_type: 'rerequest',
        display: 'popup',
    });
    const facebookLoginUrl = `https://www.facebook.com/v13.0/dialog/oauth?${stringifiedParams}`;
    res.json({ "login_url": facebookLoginUrl });
}

exports.connect = async (req, res) => {

    var code = req.query.code;
    const { data } = await axios({
        url: 'https://graph.facebook.com/v13.0/oauth/access_token',
        method: 'get',
        params: {
            client_id: process.env.CLIENT_ID,
            redirect_uri: process.env.REDIRECT_URI,
            client_secret: process.env.CLIENT_SECRET,
            code
        },
    });


    let accessToken = data.access_token;


    return res.json({ "access_token": data.access_token });
}

exports.pages = async (req, res) => {
    let errors = {
        count: 0,
        messages: {}
    };

    let access_token = req.body.access_token;

    if (access_token == undefined || access_token.trim() == '') {
        errors.count++;
        errors.messages.access_token = "access_token can not be empty";
    }

    if (errors.count > 0) {
        return res.json({
            errors
        });
    }

    const { data } = await axios({
        url: 'https://graph.facebook.com/me/accounts',
        method: 'get',
        params: {
            fields: ['id', 'name', 'fan_count', 'access_token', 'link'].join(','),
            access_token: access_token
        },
    });
    //'cover', 'link'
    return res.send({ "pages": data.data });
}


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        let name = Date.now() + '-' + Math.floor(Math.random() * 9999999) + path.extname(file.originalname);
        cb(null, name);
    }
});

var upload = multer({ storage: storage });

exports.postOnPage = async (req, res, next) => {

    upload.single('image')(req, res, async () => {

        let message = req.body.message;
        let access_token = req.body.access_token;
        let page_id = req.body.page_id;

        let errors = {
            count: 0,
            messages: {}
        };

        if (access_token == undefined || access_token.trim() == '') {
            errors.count++;
            errors.messages.access_token = "access_token can not be empty";
        }

        if (page_id == undefined || page_id.trim() == '') {
            errors.count++;
            errors.messages.page_id = "page_id can not be empty";
        }

        if ((req.file === undefined || req.file === '') && (message === undefined || message.trim() === '')) {
            errors.count++;
            errors.messages.image = "Both image and message can not be empty!";
            errors.messages.message = "Both image and message can not be empty!";
        }

        if (errors.count > 0) {
            return res.json({
                errors
            });
        }

        if (errors.count === 0) {
            let url;
            if (req.file) {
                let postMessage = "";
                if (message) {
                    postMessage = `&message=${message}`
                }

                // let image = "https://giopio.com/assets/images/home/giopio.png";
                let image = req.get('host') + '/images/' + req.file.filename;
                url = `https://graph.facebook.com/${page_id}/photos?url=${image}&access_token=${access_token}${postMessage}`;

            } else {
                url = `https://graph.facebook.com/${page_id}/feed?message=${message}&access_token=${access_token}`;
            }

            try {
                const response = await axios.post(url);
                return res.json({
                    "message" : "Post success",
                    "link" : "https://facebook.com/"+response.data.id
                });
            } catch (err) {
                return res.json({ err });
            }
        }
    })
}