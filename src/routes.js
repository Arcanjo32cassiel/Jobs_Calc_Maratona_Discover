const express = require('express');
const routes = express.Router();
const ProfileController = require('./controllers/ProfileController');
const JobController = require('./controllers/JobController');
const DashboardController = require('./controllers/DashboardController')
    // const Profile = require('./model/Profile')

// index
routes.get('/', DashboardController.index);

// job
routes.get('/job', JobController.create);
routes.post('/job', JobController.save);

// job/edit
routes.get('/job/:id', JobController.show);
routes.post('/job/:id', JobController.update);

// /job/delete
routes.post('/job/delete/:id', JobController.delete);

// profile
routes.get('/profile', ProfileController.index);
routes.post('/profile', ProfileController.update);

module.exports = routes;