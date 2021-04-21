const Job = require('../model/Job');
const Profile = require('../model/Profile');
const JobUtils = require('../utils/JobUtils');

module.exports = {
    async index(req, res) {
        const jobs = Job.get();
        const profile = await Profile.get();

        let statusCount = {
            progress: 0,
            done: 0,
            total: jobs.length
        }

        let jobTotalHours = 0;

        const updateJobs = jobs.map((job) => {
                // job adjustments

                const remaining = JobUtils.remainingDays(job);
                const status = remaining <= 0 ? 'done' : 'progress';

                // Sum of the amount of status
                statusCount[status] += 1;

                // total hours per day of each job in progress
                jobTotalHours = status === 'progress' ? jobTotalHours + Number(job['daily-hours']) : jobTotalHours


                return {
                    ...job,
                    remaining,
                    status,
                    budget: JobUtils.calculateBudget(job, profile["value-hour"])
                }
            })
            // Number of hours i want to work each day (profile)
            // Any-Less
            // Number of hours per day for each job in progress 

        let freeHours = Number(profile['hours-per-day']) - Number(jobTotalHours);

        return res.render("index", { jobs: updateJobs, profile: profile, statusCount: statusCount, freeHours: freeHours })
    }
}