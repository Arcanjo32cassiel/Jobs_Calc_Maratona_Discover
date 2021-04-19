let data = [{
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
    }
];

module.exports = {
    get() {
        return data
    },
    update(newJob) {
        data = newJob;
    },
    delete(id) {
        data = data.filter(job => Number(job.id) !== Number(id));
    }
}