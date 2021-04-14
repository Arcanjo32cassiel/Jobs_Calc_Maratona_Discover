const express = require('express');
const routes = express.Router();

const views = __dirname + "/views/"

const profile = {
    name: "Arcanjo",
    avatar: "https://avatars.githubusercontent.com/u/63671410?v=4",
    "monthly-budget": 3000,
    "hours-per-day": 5,
    "days-per-week": 6,
    "vocation-per-year": 4,
    "value-hour": 75
}

const jobs = [{
        id: 1,
        name: "Pizzaria Marana",
        'daily-hours': 2,
        'total-hours': 1,
        created_at: Date.now(),

    },
    {
        id: 2,
        name: "Gurgueia",
        'daily-hours': 3,
        'total-hours': 47,
        created_at: Date.now(),

    },
]

function remainingDays(job) {
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

routes.get('/', (req, res) => {

    const updateJobs = jobs.map((job) => {
        // job adjustments
        const remaining = remainingDays(job);
        const status = remaining <= 0 ? 'done' : 'progress';

        return {
            ...job,
            remaining,
            status,
            budget: profile['value-hour'] * job['total-hours']
        }
    })




    return res.render(views + "index", { updateJobs, profile })
});



routes.get('/job', (req, res) => res.render(views + "job"));
routes.post('/job', (req, res) => {

    const lastId = jobs[jobs.length - 1] ? jobs[jobs.length - 1].id : 1;

    jobs.push({
        id: lastId + 1,
        name: req.body.name,
        'daily-hours': req.body['daily-hours'],
        'total-hours': req.body['total-hours'],
        created_at: Date.now(), // Atribuindo uma nova data
    })
    return res.redirect('/')
});

routes.get('/job/1', (req, res) => res.render(views + "job-edit"));
routes.get('/profile', (req, res) => res.render(views + "profile", { profile }));

module.exports = routes;