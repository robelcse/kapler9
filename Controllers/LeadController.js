const axios = require('axios').default;

/**
 * get single lead using lead_gen_id
 * 
 * @param {*} req 
 * @param {*} res 
 * 
 * @return Object of lead
 */

let getSingleLead = (req, res) => {

    let leadGenId = req.body.lead_gen_id;
    let access_token = req.body.access_token;

    axios.get(`https://graph.facebook.com/v13.0/${leadGenId}?access_token=${access_token}`)
        .then(function (response) {
            // console.log(JSON.stringify(response.data));
            res.status(200).json({
                data: response.data
            });
        })
        .catch(function (error) {
            res.status(500).json({
                error: error
            });
        })
}


/**
 * get list of leads using lead form id
 * @param {*} req 
 * @param {*} res 
 * 
 * @return Array of leads
 */

let getAllLead = (req, res) => {

    //console.log(req.body);

    // let leadFormId = req.body.lead_form_id;
    // let access_token = req.body.access_token;


    let leadFormId = 655456929040954;
    let access_token = 'EAATuwQKz5zUBAN5qZBirs4iQ5ObmmdDKp49GtpDCqy7WlvqSzwZC6t00qI0MpLGW8gNpMM29prWN5eJkla0AE6Tz7mJjw6uxnIFaxivfC9dV4iZA0Ef7HZAZCPnaJDjnZBvZBiiLsHmScY4OthmHZAM2CGJGDE9zGWrp4WV5QHfZCalYPtw0oNkOBrJC4oYtFYqIHwvbQ1cazskMAZAdZCcjZCUangKTNCbBZAYZBDZAAnSZAcfZBQAZDZD';

    axios.get(`https://graph.facebook.com/v13.0/${leadFormId}/leads?access_token=${access_token}`)
        .then(function (response) {
            let resData = response.data;
            //    res.status(200).json({
            //        data
            //    });

               //client url  = https://webhook.site/7bc95c5e-ccd6-4b78-b81f-dbfc52023369
               //my url = https://webhook.site/f6ab8782-617a-4564-b95f-c8c18b1e32b7

                axios.post('https://webhook.site/f6ab8782-617a-4564-b95f-c8c18b1e32b7', {
                    leads: resData
                })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });

        })
        .catch(function (error) {
            console.log(error)
        })
}


module.exports = {
    getSingleLead,
    getAllLead
}