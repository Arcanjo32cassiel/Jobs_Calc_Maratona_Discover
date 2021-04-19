const Profile = require('../model/Profile')

module.exports = {
    index(req, res) {
        res.render("profile", { profile: Profile.get() });
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

        Profile.update({
            ...Profile.get(),
            ...req.body,
            "value-hour": valueHour
        })

        return res.redirect('/profile')
    }
}