const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const FightData = require('../models/FightData');
const Fighter = require('../models/Fighter');
const Event = require('../models/Event');

// Update this line to reflect the correct path
const csvFilePath = path.join(__dirname, '..', 'data.csv');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/pastels_wager', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

const safeParseFloat = (value) => {
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? 0 : parsedValue;
};

const safeParseInt = (value) => {
    const parsedValue = parseInt(value, 10);
    return isNaN(parsedValue) ? 0 : parsedValue;
};

const getValue = (row, key) => row[key] !== undefined ? safeParseFloat(row[key]) : 0;

const getSafeValue = (row, key, parseFunc = safeParseFloat) => row[key] !== undefined ? parseFunc(row[key]) : 0;

const importData = async () => {
    await connectDB();

    const fightDataList = [];
    const fighterSet = new Set();
    const eventSet = new Set();

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
            try {
                const eventKey = `${row.date}_${row.location}`;
                if (!eventSet.has(eventKey)) {
                    eventSet.add(eventKey);
                    const event = new Event({
                        name: eventKey,
                        date: row.date,
                        location: row.location
                    });
                    event.save().catch(console.error);
                }

                if (!fighterSet.has(row.R_fighter)) {
                    fighterSet.add(row.R_fighter);
                    const redFighter = new Fighter({
                        name: row.R_fighter,
                        stance: row.R_Stance,
                        height_cms: safeParseFloat(row.R_Height_cms),
                        reach_cms: safeParseFloat(row.R_Reach_cms),
                        weight_lbs: safeParseFloat(row.R_Weight_lbs),
                        age: safeParseInt(row.R_age),
                        wins: safeParseInt(row.R_wins),
                        losses: safeParseInt(row.R_losses),
                        draw: safeParseInt(row.R_draw),
                        current_win_streak: safeParseInt(row.R_current_win_streak),
                        current_lose_streak: safeParseInt(row.R_current_lose_streak),
                        longest_win_streak: safeParseInt(row.R_longest_win_streak)
                    });
                    redFighter.save().catch(console.error);
                }

                if (!fighterSet.has(row.B_fighter)) {
                    fighterSet.add(row.B_fighter);
                    const blueFighter = new Fighter({
                        name: row.B_fighter,
                        stance: row.B_Stance,
                        height_cms: safeParseFloat(row.B_Height_cms),
                        reach_cms: safeParseFloat(row.B_Reach_cms),
                        weight_lbs: safeParseFloat(row.B_Weight_lbs),
                        age: safeParseInt(row.B_age),
                        wins: safeParseInt(row.B_wins),
                        losses: safeParseInt(row.B_losses),
                        draw: safeParseInt(row.B_draw),
                        current_win_streak: safeParseInt(row.B_current_win_streak),
                        current_lose_streak: safeParseInt(row.B_current_lose_streak),
                        longest_win_streak: safeParseInt(row.B_longest_win_streak)
                    });
                    blueFighter.save().catch(console.error);
                }

                const stoppage = row.Winner !== 'Decision';
                const noOfRounds = stoppage ? (row.title_bout === 'True' ? 5 : 3) : (row.title_bout === 'True' ? 5 : 3);

                const rounds = Array.from({ length: noOfRounds }).map((_, index) => ({
                    round_number: index + 1,
                    fighter_stats: [
                        {
                            fighter: row.R_fighter,
                            total_time: getSafeValue(row, `R_round${index + 1}_total_time`),
                            total_strikes: safeParseInt(row[`R_round${index + 1}_total_strikes`]),
                            sig_strikes: safeParseInt(row[`R_round${index + 1}_sig_strikes`]),
                            takedowns: safeParseInt(row[`R_round${index + 1}_takedowns`]),
                            submissions: safeParseInt(row[`R_round${index + 1}_submissions`])
                        },
                        {
                            fighter: row.B_fighter,
                            total_time: getSafeValue(row, `B_round${index + 1}_total_time`),
                            total_strikes: safeParseInt(row[`B_round${index + 1}_total_strikes`]),
                            sig_strikes: safeParseInt(row[`B_round${index + 1}_sig_strikes`]),
                            takedowns: safeParseInt(row[`B_round${index + 1}_takedowns`]),
                            submissions: safeParseInt(row[`B_round${index + 1}_submissions`])
                        }
                    ]
                }));

                console.log(`Determined number of rounds: ${noOfRounds} for fight on ${row.date} between ${row.R_fighter} and ${row.B_fighter}`);
                console.log('Rounds array:', rounds);

                const fightData = {
                    R_fighter: row.R_fighter,
                    B_fighter: row.B_fighter,
                    Referee: row.Referee,
                    date: row.date,
                    location: row.location,
                    Winner: row.Winner,
                    title_bout: row.title_bout === 'True',
                    weight_class: row.weight_class,
                    no_of_rounds: noOfRounds,
                    red_stats: {
                        avg_KD: getSafeValue(row, 'R_avg_KD'),
                        avg_opp_KD: getSafeValue(row, 'R_avg_opp_KD'),
                        avg_SIG_STR_pct: getSafeValue(row, 'R_avg_SIG_STR_pct'),
                        avg_opp_SIG_STR_pct: getSafeValue(row, 'R_avg_opp_SIG_STR_pct'),
                        avg_TD_pct: getSafeValue(row, 'R_avg_TD_pct'),
                        avg_opp_TD_pct: getSafeValue(row, 'R_avg_opp_TD_pct'),
                        avg_SUB_ATT: getSafeValue(row, 'R_avg_SUB_ATT'),
                        avg_opp_SUB_ATT: getSafeValue(row, 'R_avg_opp_SUB_ATT'),
                        avg_REV: getSafeValue(row, 'R_avg_REV'),
                        avg_opp_REV: getSafeValue(row, 'R_avg_opp_REV'),
                        avg_SIG_STR_att: getSafeValue(row, 'R_avg_SIG_STR_att'),
                        avg_SIG_STR_landed: getSafeValue(row, 'R_avg_SIG_STR_landed'),
                        avg_opp_SIG_STR_att: getSafeValue(row, 'R_avg_opp_SIG_STR_att'),
                        avg_opp_SIG_STR_landed: getSafeValue(row, 'R_avg_opp_SIG_STR_landed'),
                        avg_TOTAL_STR_att: getSafeValue(row, 'R_avg_TOTAL_STR_att'),
                        avg_TOTAL_STR_landed: getSafeValue(row, 'R_avg_TOTAL_STR_landed'),
                        avg_opp_TOTAL_STR_att: getSafeValue(row, 'R_avg_opp_TOTAL_STR_att'),
                        avg_opp_TOTAL_STR_landed: getSafeValue(row, 'R.avg_opp_TOTAL_STR_landed'),
                        avg_TD_att: getSafeValue(row, 'R_avg_TD_att'),
                        avg_TD_landed: getSafeValue(row, 'R_avg_TD_landed'),
                        avg_opp_TD_att: getSafeValue(row, 'R_avg_opp_TD_att'),
                        avg_opp_TD_landed: getSafeValue(row, 'R.avg_opp_TD_landed'),
                        avg_HEAD_att: getSafeValue(row, 'R_avg_HEAD_att'),
                        avg_HEAD_landed: getSafeValue(row, 'R.avg_HEAD_landed'),
                        avg_opp_HEAD_att: getSafeValue(row, 'R.avg_opp_HEAD_att'),
                        avg_opp_HEAD_landed: getSafeValue(row, 'R.avg_opp_HEAD_landed'),
                        avg_BODY_att: getSafeValue(row, 'R.avg_BODY_att'),
                        avg_BODY_landed: getSafeValue(row, 'R.avg_BODY_landed'),
                        avg_opp_BODY_att: getSafeValue(row, 'R.avg_opp_BODY_att'),
                        avg_opp_BODY_landed: getSafeValue(row, 'R.avg_opp_BODY_landed'),
                        avg_LEG_att: getSafeValue(row, 'R.avg_LEG_att'),
                        avg_LEG_landed: getSafeValue(row, 'R.avg_LEG_landed'),
                        avg_opp_LEG_att: getSafeValue(row, 'R.avg_opp_LEG_att'),
                        avg_opp_LEG_landed: getSafeValue(row, 'R.avg_opp_LEG_landed'),
                        avg_DISTANCE_att: getSafeValue(row, 'R_avg_DISTANCE_att'),
                        avg_DISTANCE_landed: getSafeValue(row, 'R.avg_DISTANCE_landed'),
                        avg_opp_DISTANCE_att: getSafeValue(row, 'R.avg_opp_DISTANCE_att'),
                        avg_opp_DISTANCE_landed: getSafeValue(row, 'R.avg_opp_DISTANCE_landed'),
                        avg_CLINCH_att: getSafeValue(row, 'R.avg_CLINCH_att'),
                        avg_CLINCH_landed: getSafeValue(row, 'R.avg_CLINCH_landed'),
                        avg_opp_CLINCH_att: getSafeValue(row, 'R.avg_opp_CLINCH_att'),
                        avg_opp_CLINCH_landed: getSafeValue(row, 'R.avg_opp_CLINCH_landed'),
                        avg_GROUND_att: getSafeValue(row, 'R.avg_GROUND_att'),
                        avg_GROUND_landed: getSafeValue(row, 'R.avg_GROUND_landed'),
                        avg_opp_GROUND_att: getSafeValue(row, 'R.avg_opp_GROUND_att'),
                        avg_opp_GROUND_landed: getSafeValue(row, 'R.avg_opp_GROUND_landed'),
                        avg_CTRL_time: getSafeValue(row, 'R_avg_CTRL_time(seconds)'),
                        avg_opp_CTRL_time: getSafeValue(row, 'R.avg_opp_CTRL_time(seconds)'),
                        total_time_fought: getSafeValue(row, 'R_total_time_fought(seconds)'),
                        total_rounds_fought: safeParseInt(row.R_total_rounds_fought),
                        total_title_bouts: safeParseInt(row.R_total_title_bouts),
                        current_win_streak: safeParseInt(row.R_current_win_streak),
                        current_lose_streak: safeParseInt(row.R_current_lose_streak),
                        longest_win_streak: safeParseInt(row.R_longest_win_streak),
                        wins: safeParseInt(row.R_wins),
                        losses: safeParseInt(row.R_losses),
                        draw: safeParseInt(row.R_draw),
                        win_by_Decision_Majority: safeParseInt(row.R_win_by_Decision_Majority),
                        win_by_Decision_Split: safeParseInt(row.R_win_by_Decision_Split),
                        win_by_Decision_Unanimous: safeParseInt(row.R_win_by_Decision_Unanimous),
                        win_by_KO_TKO: safeParseInt(row['R_win_by_KO/TKO']),
                        win_by_Submission: safeParseInt(row.R_win_by_Submission),
                        win_by_TKO_Doctor_Stoppage: safeParseInt(row.R_win_by_TKO_Doctor_Stoppage)
                    },
                    blue_stats: {
                        avg_KD: getSafeValue(row, 'B_avg_KD'),
                        avg_opp_KD: getSafeValue(row, 'B_avg_opp_KD'),
                        avg_SIG_STR_pct: getSafeValue(row, 'B_avg_SIG_STR_pct'),
                        avg_opp_SIG_STR_pct: getSafeValue(row, 'B_avg_opp_SIG_STR_pct'),
                        avg_TD_pct: getSafeValue(row, 'B_avg_TD_pct'),
                        avg_opp_TD_pct: getSafeValue(row, 'B_avg_opp_TD_pct'),
                        avg_SUB_ATT: getSafeValue(row, 'B_avg_SUB_ATT'),
                        avg_opp_SUB_ATT: getSafeValue(row, 'B_avg_opp_SUB_ATT'),
                        avg_REV: getSafeValue(row, 'B_avg_REV'),
                        avg_opp_REV: getSafeValue(row, 'B_avg_opp_REV'),
                        avg_SIG_STR_att: getSafeValue(row, 'B_avg_SIG_STR_att'),
                        avg_SIG_STR_landed: getSafeValue(row, 'B_avg_SIG_STR_landed'),
                        avg_opp_SIG_STR_att: getSafeValue(row, 'B_avg_opp_SIG_STR_att'),
                        avg_opp_SIG_STR_landed: getSafeValue(row, 'B.avg_opp_SIG_STR_landed'),
                        avg_TOTAL_STR_att: getSafeValue(row, 'B_avg_TOTAL_STR_att'),
                        avg_TOTAL_STR_landed: getSafeValue(row, 'B_avg_TOTAL_STR_landed'),
                        avg_opp_TOTAL_STR_att: getSafeValue(row, 'B_avg_opp_TOTAL_STR_att'),
                        avg_opp_TOTAL_STR_landed: getSafeValue(row, 'B.avg_opp_TOTAL_STR_landed'),
                        avg_TD_att: getSafeValue(row, 'B.avg_TD_att'),
                        avg_TD_landed: getSafeValue(row, 'B.avg_TD_landed'),
                        avg_opp_TD_att: getSafeValue(row, 'B.avg_opp_TD_att'),
                        avg_opp_TD_landed: getSafeValue(row, 'B.avg_opp_TD_landed'),
                        avg_HEAD_att: getSafeValue(row, 'B.avg_HEAD_att'),
                        avg_HEAD_landed: getSafeValue(row, 'B.avg_HEAD_landed'),
                        avg_opp_HEAD_att: getSafeValue(row, 'B.avg_opp_HEAD_att'),
                        avg_opp_HEAD_landed: getSafeValue(row, 'B.avg_opp_HEAD_landed'),
                        avg_BODY_att: getSafeValue(row, 'B.avg_BODY_att'),
                        avg_BODY_landed: getSafeValue(row, 'B.avg_BODY_landed'),
                        avg_opp_BODY_att: getSafeValue(row, 'B.avg_opp_BODY_att'),
                        avg_opp_BODY_landed: getSafeValue(row, 'B.avg_opp_BODY_landed'),
                        avg_LEG_att: getSafeValue(row, 'B.avg_LEG_att'),
                        avg_LEG_landed: getSafeValue(row, 'B.avg_LEG_landed'),
                        avg_opp_LEG_att: getSafeValue(row, 'B.avg_opp_LEG_att'),
                        avg_opp_LEG_landed: getSafeValue(row, 'B.avg_opp_LEG_landed'),
                        avg_DISTANCE_att: getSafeValue(row, 'B.avg_DISTANCE_att'),
                        avg_DISTANCE_landed: getSafeValue(row, 'B.avg_DISTANCE_landed'),
                        avg_opp_DISTANCE_att: getSafeValue(row, 'B.avg_opp_DISTANCE_att'),
                        avg_opp_DISTANCE_landed: getSafeValue(row, 'B.avg_opp_DISTANCE_landed'),
                        avg_CLINCH_att: getSafeValue(row, 'B.avg_CLINCH_att'),
                        avg_CLINCH_landed: getSafeValue(row, 'B.avg_CLINCH_landed'),
                        avg_opp_CLINCH_att: getSafeValue(row, 'B.avg_opp_CLINCH_att'),
                        avg_opp_CLINCH_landed: getSafeValue(row, 'B.avg_opp_CLINCH_landed'),
                        avg_GROUND_att: getSafeValue(row, 'B.avg_GROUND_att'),
                        avg_GROUND_landed: getSafeValue(row, 'B.avg_GROUND_landed'),
                        avg_opp_GROUND_att: getSafeValue(row, 'B.avg_opp_GROUND_att'),
                        avg_opp_GROUND_landed: getSafeValue(row, 'B.avg_opp_GROUND_landed'),
                        avg_CTRL_time: getSafeValue(row, 'B_avg_CTRL_time(seconds)'),
                        avg_opp_CTRL_time: getSafeValue(row, 'B_avg_opp_CTRL_time(seconds)'),
                        total_time_fought: getSafeValue(row, 'B_total_time_fought(seconds)'),
                        total_rounds_fought: safeParseInt(row.B_total_rounds_fought),
                        total_title_bouts: safeParseInt(row.B_total_title_bouts),
                        current_win_streak: safeParseInt(row.B_current_win_streak),
                        current_lose_streak: safeParseInt(row.B_current_lose_streak),
                        longest_win_streak: safeParseInt(row.B_longest_win_streak),
                        wins: safeParseInt(row.B_wins),
                        losses: safeParseInt(row.B_losses),
                        draw: safeParseInt(row.B_draw),
                        win_by_Decision_Majority: safeParseInt(row.B_win_by_Decision_Majority),
                        win_by_Decision_Split: safeParseInt(row.B_win_by_Decision_Split),
                        win_by_Decision_Unanimous: safeParseInt(row.B_win_by_Decision_Unanimous),
                        win_by_KO_TKO: safeParseInt(row['B_win_by_KO/TKO']),
                        win_by_Submission: safeParseInt(row.B_win_by_Submission),
                        win_by_TKO_Doctor_Stoppage: safeParseInt(row.B_win_by_TKO_Doctor_Stoppage)
                    },
                    rounds
                };

                fightDataList.push(fightData);
            } catch (error) {
                console.error('Error processing row:', row, error);
            }
        })
        .on('end', async () => {
            try {
                await FightData.insertMany(fightDataList);
                console.log('Data successfully imported');
            } catch (error) {
                console.error('Error inserting data:', error);
            } finally {
                mongoose.connection.close();
            }
        })
        .on('error', (error) => {
            console.error('Error reading CSV file:', error);
        });
};

importData();
