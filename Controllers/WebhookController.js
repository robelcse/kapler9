const axios = require('axios').default;

exports.webhook = async (req, res) => {

    console.log(req)
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');

        'curl: https://graph.facebook.com/v13.0/me?fields=accounts{name,access_token}'
    }
}

exports.getWebhookData = async (req, res) => {

    console.log('full body...................');
    console.log(JSON.stringify(req.body));
    let body = req.body;
    if (body.object === 'page') {

        console.log('full body inside condition...............');
        console.log(JSON.stringify(body));
        body.entry.forEach(function (entry) {

            console.log('entry....................');
            console.log(JSON.stringify(entry));
            console.log('only id................');
            console.log(entry.id);
            console.log('field data..............');
            console.log(entry.changes[0].field);
            console.log('leadgen id..............');
            console.log(entry.changes[0].value.leadgen_id);

            let leadgen_id = entry.changes[0].value.leadgen_id;
            let accessToken = 'EAATuwQKz5zUBAIDPN4xmw5UczNeEeoF6SriRyovbXPT51d6ZAHq5zbr6Xvv6zXFuGDZB7G4Q1htmTYSGtoEZBlakv4HS66aK9tIkphbBtXTxjkJ8CpgbLux9XJwlHz2cUNM0ZCfPavxUZB9rI1XREPCD7l2cfZB71UYwAtwCjD0DXZAdatnELcssNJg8bhUhudxV5MG4wyRz6JeXiRlFHnRw0dAuAjtiqQHYHCyIelKPgZDZD';

            axios.get(`https://graph.facebook.com/v13.0/${leadgen_id}?access_token=${accessToken}`)
                .then(function (response) {
                    // handle success
                    console.log("Here you go for ...");
                    console.log({response: response.data});

                    console.log(JSON.stringify(response.data));
                    console.log('Field data......................................................');
                    console.log(response.data.field_data);

                    axios.post('https://webhook.site/f6ab8782-617a-4564-b95f-c8c18b1e32b7', {
                        lead: response.data.field_data,
                    })
                        .then(function (response) {
                            console.log(response);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });

                })
                .catch(function (error) {
                    // handle error
                    console.log(error);

                })

           
        });

    }
}