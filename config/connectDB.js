const mongoose = require("mongoose");
const { MongoURI } = require("./database");

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(MongoURI, {
			useUnifiedTopology: true,
			useNewUrlParser: true
		});
		console.log(`MongoDB connected ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error: ${error.message}`);
		process.exit(1);
	}
};

module.exports = connectDB;
