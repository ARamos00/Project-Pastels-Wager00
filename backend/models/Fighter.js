const mongoose = require('mongoose');

const fighterSchema = new mongoose.Schema({
    name: String,
    nickname: String,
    stance: String,
    height_cms: Number,
    reach_cms: Number,
    weight_lbs: Number,
    age: Number,
    wins: Number,
    losses: Number,
    draws: Number,
    total_fights: Number,
    stats: {
        avg_KD: Number,
        avg_SIG_STR_pct: Number,
        avg_TD_pct: Number,
        avg_SUB_ATT: Number,
        avg_REV: Number,
        avg_CTRL_time: Number,
        total_time_fought: Number,
        total_rounds_fought: Number,
        total_title_bouts: Number,
        current_win_streak: Number,
        current_lose_streak: Number,
        longest_win_streak: Number,
        win_by_Decision_Majority: Number,
        win_by_Decision_Split: Number,
        win_by_Decision_Unanimous: Number,
        win_by_KO_TKO: Number,
        win_by_Submission: Number,
        win_by_TKO_Doctor_Stoppage: Number,
    }
});

module.exports = mongoose.model('Fighter', fighterSchema);
