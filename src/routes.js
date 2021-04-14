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
        "vocation-per-year": 4,
        "value-hour": 75
    },
    controllers: {
        index(req, res) {
            res.render(views + "profile", { profile: Profile.data })
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

        },
        {
            id: 2,
            name: "Gurgueia",
            'daily-hours': 3,
            'total-hours': 47,
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
                    budget: profile['value-hour'] * job['total-hours']
                }
            })

            return res.render(views + "index", { updateJobs, profile })
        },
        create(req, res) {
            return res.render(views + "job")
        },
        save(req, res) {

            const lastId = Job.data[Job.data.length - 1] ? Job.data[jobs.length - 1].id : 1;

            Job.data.push({
                id: lastId + 1,
                name: req.body.name,
                'daily-hours': req.body['daily-hours'],
                'total-hours': req.body['total-hours'],
                created_at: Date.now(), // Atribuindo uma nova data
            })
            return res.redirect('/')
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
        }
    },
};





routes.get('/', Job.controllers.index);
routes.get('/job', Job.controllers.create);
routes.post('/job', Job.controllers.save);
routes.get('/job/1', (req, res) => res.render(views + "job-edit"));
routes.get('/profile', Profile.controllers.index);

module.exports = routes;