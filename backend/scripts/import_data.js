const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const FightData = require('../models/FightData');  // Adjust the path as needed

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

const importData = async () => {
    await connectDB();

    const fightDataList = [];

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
            try {
                const fightData = {
                    R_fighter: row.R_fighter,
                    B_fighter: row.B_fighter,
                    Referee: row.Referee,
                    date: row.date,
                    location: row.location,
                    Winner: row.Winner,
                    title_bout: row.title_bout === 'True',
                    weight_class: row.weight_class,
                    no_of_rounds: safeParseInt(row.no_of_rounds),
                    red_stats: {
                        avg_KD: getValue(row, 'R_avg_KD'),
                        avg_opp_KD: getValue(row, 'R_avg_opp_KD'),
                        avg_SIG_STR_pct: getValue(row, 'R_avg_SIG_STR_pct'),
                        avg_opp_SIG_STR_pct: getValue(row, 'R_avg_opp_SIG_STR_pct'),
                        avg_TD_pct: getValue(row, 'R_avg_TD_pct'),
                        avg_opp_TD_pct: getValue(row, 'R_avg_opp_TD_pct'),
                        avg_SUB_ATT: getValue(row, 'R_avg_SUB_ATT'),
                        avg_opp_SUB_ATT: getValue(row, 'R_avg_opp_SUB_ATT'),
                        avg_REV: getValue(row, 'R_avg_REV'),
                        avg_opp_REV: getValue(row, 'R_avg_opp_REV'),
                        avg_SIG_STR_att: getValue(row, 'R_avg_SIG_STR_att'),
                        avg_SIG_STR_landed: getValue(row, 'R_avg_SIG_STR_landed'),
                        avg_opp_SIG_STR_att: getValue(row, 'R_avg_opp_SIG_STR_att'),
                        avg_opp_SIG_STR_landed: getValue(row, 'R_avg_opp_SIG_STR_landed'),
                        avg_TOTAL_STR_att: getValue(row, 'R_avg_TOTAL_STR_att'),
                        avg_TOTAL_STR_landed: getValue(row, 'R_avg_TOTAL_STR_landed'),
                        avg_opp_TOTAL_STR_att: getValue(row, 'R_avg_opp_TOTAL_STR_att'),
                        avg_opp_TOTAL_STR_landed: getValue(row, 'R_avg_opp_TOTAL_STR_landed'),
                        avg_TD_att: getValue(row, 'R_avg_TD_att'),
                        avg_TD_landed: getValue(row, 'R_avg_TD_landed'),
                        avg_opp_TD_att: getValue(row, 'R_avg_opp_TD_att'),
                        avg_opp_TD_landed: getValue(row, 'R_avg_opp_TD_landed'),
                        avg_HEAD_att: getValue(row, 'R_avg_HEAD_att'),
                        avg_HEAD_landed: getValue(row, 'R_avg_HEAD_landed'),
                        avg_opp_HEAD_att: getValue(row, 'R_avg_opp_HEAD_att'),
                        avg_opp_HEAD_landed: getValue(row, 'R_avg_opp_HEAD_landed'),
                        avg_BODY_att: getValue(row, 'R_avg_BODY_att'),
                        avg_BODY_landed: getValue(row, 'R_avg_BODY_landed'),
                        avg_opp_BODY_att: getValue(row, 'R_avg_opp_BODY_att'),
                        avg_opp_BODY_landed: getValue(row, 'R_avg_opp_BODY_landed'),
                        avg_LEG_att: getValue(row, 'R_avg_LEG_att'),
                        avg_LEG_landed: getValue(row, 'R_avg_LEG_landed'),
                        avg_opp_LEG_att: getValue(row, 'R_avg_opp_LEG_att'),
                        avg_opp_LEG_landed: getValue(row, 'R_avg_opp_LEG_landed'),
                        avg_DISTANCE_att: getValue(row, 'R_avg_DISTANCE_att'),
                        avg_DISTANCE_landed: getValue(row, 'R_avg_DISTANCE_landed'),
                        avg_opp_DISTANCE_att: getValue(row, 'R_avg_opp_DISTANCE_att'),
                        avg_opp_DISTANCE_landed: getValue(row, 'R_avg_opp_DISTANCE_landed'),
                        avg_CLINCH_att: getValue(row, 'R_avg_CLINCH_att'),
                        avg_CLINCH_landed: getValue(row, 'R_avg_CLINCH_landed'),
                        avg_opp_CLINCH_att: getValue(row, 'R_avg_opp_CLINCH_att'),
                        avg_opp_CLINCH_landed: getValue(row, 'R_avg_opp_CLINCH_landed'),
                        avg_GROUND_att: getValue(row, 'R_avg_GROUND_att'),
                        avg_GROUND_landed: getValue(row, 'R_avg_GROUND_landed'),
                        avg_opp_GROUND_att: getValue(row, 'R_avg_opp_GROUND_att'),
                        avg_opp_GROUND_landed: getValue(row, 'R_avg_opp_GROUND_landed'),
                        avg_CTRL_time: getValue(row, 'R_avg_CTRL_time(seconds)'),
                        avg_opp_CTRL_time: getValue(row, 'R_avg_opp_CTRL_time(seconds)'),
                        total_time_fought: getValue(row, 'R_total_time_fought(seconds)'),
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
                        win_by_TKO_Doctor_Stoppage: safeParseInt(row.R_win_by_TKO_Doctor_Stoppage),
                    },
                    blue_stats: {
                        avg_KD: getValue(row, 'B_avg_KD'),
                        avg_opp_KD: getValue(row, 'B_avg_opp_KD'),
                        avg_SIG_STR_pct: getValue(row, 'B_avg_SIG_STR_pct'),
                        avg_opp_SIG_STR_pct: getValue(row, 'B_avg_opp_SIG_STR_pct'),
                        avg_TD_pct: getValue(row, 'B_avg_TD_pct'),
                        avg_opp_TD_pct: getValue(row, 'B_avg_opp_TD_pct'),
                        avg_SUB_ATT: getValue(row, 'B_avg_SUB_ATT'),
                        avg_opp_SUB_ATT: getValue(row, 'B_avg_opp_SUB_ATT'),
                        avg_REV: getValue(row, 'B_avg_REV'),
                        avg_opp_REV: getValue(row, 'B_avg_opp_REV'),
                        avg_SIG_STR_att: getValue(row, 'B_avg_SIG_STR_att'),
                        avg_SIG_STR_landed: getValue(row, 'B_avg_SIG_STR_landed'),
                        avg_opp_SIG_STR_att: getValue(row, 'B_avg_opp_SIG_STR_att'),
                        avg_opp_SIG_STR_landed: getValue(row, 'B_avg_opp_SIG_STR_landed'),
                        avg_TOTAL_STR_att: getValue(row, 'B_avg_TOTAL_STR_att'),
                        avg_TOTAL_STR_landed: getValue(row, 'B_avg_TOTAL_STR_landed'),
                        avg_opp_TOTAL_STR_att: getValue(row, 'B_avg_opp_TOTAL_STR_att'),
                        avg_opp_TOTAL_STR_landed: getValue(row, 'B_avg_opp_TOTAL_STR_landed'),
                        avg_TD_att: getValue(row, 'B_avg_TD_att'),
                        avg_TD_landed: getValue(row, 'B_avg_TD_landed'),
                        avg_opp_TD_att: getValue(row, 'B_avg_opp_TD_att'),
                        avg_opp_TD_landed: getValue(row, 'B_avg_opp_TD_landed'),
                        avg_HEAD_att: getValue(row, 'B_avg_HEAD_att'),
                        avg_HEAD_landed: getValue(row, 'B_avg_HEAD_landed'),
                        avg_opp_HEAD_att: getValue(row, 'B_avg_opp_HEAD_att'),
                        avg_opp_HEAD_landed: getValue(row, 'B_avg_opp_HEAD_landed'),
                        avg_BODY_att: getValue(row, 'B_avg_BODY_att'),
                        avg_BODY_landed: getValue(row, 'B_avg_BODY_landed'),
                        avg_opp_BODY_att: getValue(row, 'B_avg_opp_BODY_att'),
                        avg_opp_BODY_landed: getValue(row, 'B_avg_opp_BODY_landed'),
                        avg_LEG_att: getValue(row, 'B_avg_LEG_att'),
                        avg_LEG_landed: getValue(row, 'B_avg_LEG_landed'),
                        avg_opp_LEG_att: getValue(row, 'B_avg_opp_LEG_att'),
                        avg_opp_LEG_landed: getValue(row, 'B_avg_opp_LEG_landed'),
                        avg_DISTANCE_att: getValue(row, 'B_avg_DISTANCE_att'),
                        avg_DISTANCE_landed: getValue(row, 'B_avg_DISTANCE_landed'),
                        avg_opp_DISTANCE_att: getValue(row, 'B_avg_opp_DISTANCE_att'),
                        avg_opp_DISTANCE_landed: getValue(row, 'B_avg_opp_DISTANCE_landed'),
                        avg_CLINCH_att: getValue(row, 'B_avg_CLINCH_att'),
                        avg_CLINCH_landed: getValue(row, 'B_avg_CLINCH_landed'),
                        avg_opp_CLINCH_att: getValue(row, 'B_avg_opp_CLINCH_att'),
                        avg_opp_CLINCH_landed: getValue(row, 'B_avg_opp_CLINCH_landed'),
                        avg_GROUND_att: getValue(row, 'B_avg_GROUND_att'),
                        avg_GROUND_landed: getValue(row, 'B_avg_GROUND_landed'),
                        avg_opp_GROUND_att: getValue(row, 'B_avg_opp_GROUND_att'),
                        avg_opp_GROUND_landed: getValue(row, 'B_avg_opp_GROUND_landed'),
                        avg_CTRL_time: getValue(row, 'B_avg_CTRL_time(seconds)'),
                        avg_opp_CTRL_time: getValue(row, 'B_avg_opp_CTRL_time(seconds)'),
                        total_time_fought: getValue(row, 'B_total_time_fought(seconds)'),
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
                        win_by_TKO_Doctor_Stoppage: safeParseInt(row.B_win_by_TKO_Doctor_Stoppage),
                    },
                    rounds: Array.from({ length: safeParseInt(row.no_of_rounds) }).map((_, index) => ({
                        round_number: index + 1,
                        red_stats: {
                            total_time: getValue(row, `R_round${index + 1}_total_time`),
                            total_strikes: safeParseInt(row[`R_round${index + 1}_total_strikes`]),
                            sig_strikes: safeParseInt(row[`R_round${index + 1}_sig_strikes`]),
                            takedowns: safeParseInt(row[`R_round${index + 1}_takedowns`]),
                            submissions: safeParseInt(row[`R_round${index + 1}_submissions`])
                        },
                        blue_stats: {
                            total_time: getValue(row, `B_round${index + 1}_total_time`),
                            total_strikes: safeParseInt(row[`B_round${index + 1}_total_strikes`]),
                            sig_strikes: safeParseInt(row[`B_round${index + 1}_sig_strikes`]),
                            takedowns: safeParseInt(row[`B_round${index + 1}_takedowns`]),
                            submissions: safeParseInt(row[`B_round${index + 1}_submissions`])
                        }
                    }))
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











