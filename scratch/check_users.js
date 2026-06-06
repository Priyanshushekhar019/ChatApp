const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://priyanshushekhar019_db_user:UqEmT25gwCe85tHX@cluster0.idwlbcc.mongodb.net/';

const UserSchema = new mongoose.Schema({
    fullName: String,
    username: String,
    profilePhoto: String,
    gender: String
});

const User = mongoose.model('User', UserSchema);

async function run() {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to DB");
        const users = await User.find({}).limit(10);
        console.log("Users in DB:");
        users.forEach(u => {
            console.log(`- Name: ${u.fullName}, Username: ${u.username}, Gender: ${u.gender}, Photo: ${u.profilePhoto}`);
        });
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

run();
