var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  // set secret using same environment variable as before
  secret: process.env.JWT_SECRET,
  // define property on req to be payload
  userProperty: 'payload'
});

var ctrlLocations = require('../controllers/locations');
var ctrlIssues = require('../controllers/issues');
var ctrlAppointments = require('../controllers/appointments');
var ctrlReviews = require('../controllers/reviews');
var ctrlIssueComments = require('../controllers/issueComments');
var ctrlAuth = require('../controllers/authentication');

// locations
router.get('/locations', ctrlLocations.locationsListByDistance);
router.post('/locations', ctrlLocations.locationsCreate);
router.get('/locations/:locationid', ctrlLocations.locationsReadOne);
router.put('/locations/:locationid', ctrlLocations.locationsUpdateOne);
router.delete('/locations/:locationid', ctrlLocations.locationsDeleteOne);

// reviews
// only logged in users can post, put, or delete reviews
router.post('/locations/:locationid/reviews', auth, ctrlReviews.reviewsCreate);
router.get('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewsReadOne);
router.put('/locations/:locationid/reviews/:reviewid', auth, ctrlReviews.reviewsUpdateOne);
router.delete('/locations/:locationid/reviews/:reviewid', auth, ctrlReviews.reviewsDeleteOne);

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

// issues
router.get('/issues', ctrlIssues.issuesList);
router.post('/issues', ctrlIssues.issuesCreate);
router.get('/issues/:issueid', ctrlIssues.issuesReadOne);
router.put('/issues/:issueid', ctrlIssues.issuesUpdateOne);
router.delete('/issues/:issueid', ctrlIssues.issuesDeleteOne);

// issue comments
router.post('/issues/:issueid/comments', auth, ctrlIssueComments.issueCommentsCreate);
router.get('/issues/:issueid/comments/:commentid', ctrlIssueComments.issueCommentsReadOne);
router.put('/issues/:issueid/comments/:commentid', auth, ctrlIssueComments.issueCommentsUpdateOne);
router.delete('/issues/:issueid/comments/:commentid', auth, ctrlIssueComments.issueCommentsDeleteOne);

// appointments
router.get('/appointments', ctrlAppointments.appointmentsList);
//router.post('/appointments', ctrlAppointments.appointmentsCreate);
router.get('/appointments/:appointmentid', ctrlAppointments.appointmentsReadOne);
router.put('/appointments/:appointmentid', ctrlAppointments.appointmentsUpdateOne);
router.delete('/appointments/:appointmentid', ctrlAppointments.appointmentsDeleteOne);
router.post('/appointments/new', auth, ctrlAppointments.appointmentsCreate);

module.exports = router;
