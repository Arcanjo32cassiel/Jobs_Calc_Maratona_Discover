const express = require('express');
const routes = express.Router();

const views = __dirname + "/views/"

const Profile = {
    data: {
        name: "Arcanjo",
        avatar: "https://avatars.githubusercontent.com/u/63671410?v=4",
        "monthly-budget": 3000,
        "hours-per-day": 5,
        "days-per-week": 6,
        "vacation-per-year": 4,
        "value-hour": 75
    },
    controllers: {
        index(req, res) {
            res.render(views + "profile", { profile: Profile.data });
        },
        update(req, res) {
            //  req.body to get the dadas
            const data = req.body;

            // define how many hours is in a year :52
            const weeksPerYear = 52;

            // remove the holiday weeks of the year, to get  how many weeks you have in 1 month
            const weeksPerMonth = (weeksPerYear - data['vacation-per-year']) / 12;

            // how many hours week am i working
            const weekTotalHours = data['hours-per-day'] * data['days-per-week'];
            // hours worked at the month
            const monthlyTotalHours = weekTotalHours * weeksPerMonth;

            // what  will be thw value of my hour?
            const valueHour = data["monthly-budget"] / monthlyTotalHours;

            Profile.data = {
                ...Profile.data,
                ...req.body,
                "value-hour": valueHour
            }

            return res.redirect('/profile')
        }
    }
}


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

            return res.render(views + "index", { updateJobs, profile: Profile.data })
        },
        create(req, res) {
            return res.render(views + "job")
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
            return res.render(views + "job-edit", { job })
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
routes.get('/profile', Profile.controllers.index);
routes.post('/profile', Profile.controllers.update);

module.exports = routes;