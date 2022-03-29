
const express = require('express');
const router = express.Router();
const FacebookController = require('../Controllers/FacebookController');
const IndexController = require('../Controllers/IndexController');
const WebhookController = require('../Controllers/WebhookController');
const LeadController = require('../Controllers/LeadController');


router.get('/', IndexController.index);
router.get('/facebook/login', FacebookController.loginUrl);
router.get('/facebook/connect', FacebookController.connect);
router.get('/facebook/pages', FacebookController.pages);

router.get('/facebook/pages/post', FacebookController.postOnPage);
router.get('/webhook', WebhookController.webhook);
router.post('/webhook', WebhookController.getWebhookData);

router.get('/lead',LeadController.getSingleLead);
router.get('/leads',LeadController.getAllLead);

module.exports = router