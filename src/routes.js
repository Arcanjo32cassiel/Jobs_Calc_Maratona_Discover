const express = require('express');
const routes = express.Router();
const ProfileCOntroller = require('./controllers/ProfileController')
    // const Profile = require('./model/Profile')


const Job = {
    data: [{
            id: 1,
            name: "Pizzaria Marana",
            'daily-hours': 2,
            'total-hours': 2,
            created_at: Date.now(),
            budget: 4500

        },
        {
            id: 2,
            name: "Gurgueia",
            'daily-hours': 3,
            'total-hours': 47,
            created_at: Date.now(),


        },
        {
            id: 3,
            name: "Ponto Certo",
            'daily-hours': 6,
            'total-hours': 50,
            created_at: Date.now(),

        },

    ],

    controllers: {
        index(req, res) {
            const updateJobs = Job.data.map((job) => {
                // job adjustments

                const remaining = Job.services.remainingDays(job);
                const status = remaining <= 0 ? 'done' : 'progress';

                return {
                    ...job,
                    remaining,
                    status,
                    budget: Job.services.calculateBudget(job, Profile.data["value-hour"])
                }
            })

            return res.render("index", { updateJobs, profile: Profile.data })
        },
        create(req, res) {
            return res.render("job")
        },
        save(req, res) {

            const lastId = Job.data[Job.data.length - 1] ? Job.data[Job.data.length - 1].id : 0;

            Job.data.push({
                id: lastId + 1,
                name: req.body.name,
                'daily-hours': req.body['daily-hours'],
                'total-hours': req.body['total-hours'],
                created_at: Date.now(), // Atribuindo uma nova data
            })
            return res.redirect('/')
        },
        show(req, res) {

            const jobId = req.params.id

            const job = Job.data.find(job => Number(job.id) === Number(jobId))
            if (!job) {
                return res.send('Jib not found!')
            }
            job.budget = Job.services.calculateBudget(job, Profile.data["value-hour"]);
            return res.render("job-edit", { job })
        },
        update(req, res) {
            const jobId = req.params.id

            const job = Job.data.find(job => Number(job.id) === Number(jobId))
            if (!job) {
                return res.send('Jib not found!')
            }
            const updateJob = {
                ...job,
                name: req.body.name,
                "total-hours": req.body["total-hours"],
                "daily-hours": req.body["daily-hours"],
            }
            Job.data = Job.data.map(job => {
                if (Number(job.id) === Number(jobId)) {
                    job = updateJob
                }
                return job
            })
            res.redirect('/job/' + jobId)
        },
        delete(req, res) {
            const jobId = req.params.id;

            Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId))

            return res.redirect('/');
        }
    },
    services: {
        remainingDays(job) {
            // calculation of time remaining
            const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed();

            const createdDate = new Date(job.created_at);
            const dueDay = createdDate.getDate() + Number(remainingDays);
            const dueDateInMs = createdDate.setDate(dueDay);

            const timeDiffInMs = dueDateInMs - Date.now();
            //  transform milli in days
            const daysInMs = 1000 * 60 * 60 * 24;
            const dayDiff = Math.floor(timeDiffInMs / daysInMs);

            // x days left
            return dayDiff
        },
        calculateBudget: (job, valueHour) => valueHour * job['total-hours']

    },
};


// index
routes.get('/', Job.controllers.index);

// job
routes.get('/job', Job.controllers.create);
routes.post('/job', Job.controllers.save);

// job/edit
routes.get('/job/:id', Job.controllers.show);
routes.post('/job/:id', Job.controllers.update);

// /job/delete
routes.post('/job/delete/:id', Job.controllers.delete);

// profile
routes.get('/profile', ProfileCOntroller.index);
routes.post('/profile', ProfileCOntroller.update);

module.exports = routes;