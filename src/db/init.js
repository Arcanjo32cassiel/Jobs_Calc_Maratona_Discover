const Database = require('./config');

const initDb = {
    async init() {

        const db = await Database();

        await db.exec(`CREATE TABLE  profile(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    avatar TEXT,
    monthly_budget INT,
    days_per_Week INT,
    hours_per_day INT,
    vocation_per_year INT,
    value_hour INT
    )`);

        await db.exec(`CREATE TABLE  jobs(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    daily_hours INT,
    total_hours INT,
    created_at DATETIME
    )`);

        await db.run(`
    INSERT INTO profile(
        name,
        avatar,
        monthly_budget,
        days_per_Week,
        hours_per_day,
        vocation_per_year,
        value_hour
    ) VALUES (
        "Arcanjo",
        "https://avatars.githubusercontent.com/u/63671410?v=4",
        3000,
        5,
        6,
        4,
        75
    );
`);

        await db.run(`
    INSERT INTO jobs(
        name,
        daily_hours,
        total_hours,
        created_at
    ) VALUES (
        "Pizzaria Maranata",
        2,
        2,
        1617514376018
    );
`);

        await db.run(`
    INSERT INTO jobs(
        name,
        daily_hours,
        total_hours,
        created_at
    ) VALUES (
        "Gurgueia",
        3,
        47,
        1617514376018
    )
`);

        await db.close();
    }
}
initDb.init();