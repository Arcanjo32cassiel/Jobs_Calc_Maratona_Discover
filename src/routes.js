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
                    budget: Profile.data['value-hour'] * job['total-hours']
                }
            })

            return res.render(views + "index", { updateJobs, profile: Profile.data })
        },
        create(req, res) {
            return res.render(views + "job")
        },
        save(req, res) {

            const lastId = Job.data[Job.data.length - 1] ? Job.data[Job.data.length - 1].id : 1;

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
routes.post('/profile', Profile.controllers.update);

module.exports = routes;