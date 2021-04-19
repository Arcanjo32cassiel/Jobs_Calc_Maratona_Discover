let data = {
    name: "Arcanjo",
    avatar: "https://avatars.githubusercontent.com/u/63671410?v=4",
    "monthly-budget": 3000,
    "hours-per-day": 5,
    "days-per-week": 6,
    "vacation-per-year": 4,
    "value-hour": 75
}


module.exports = {
    get() {
        return data;
    },
    update(newData) {
        data = newData;
    }
}