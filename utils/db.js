const { connect } = require('mongoose');
const dotenv = require("dotenv");
const path = require('path');

const pathName = path.join(__dirname, "../.env")
dotenv.config({ pathName });
const connectionString = process.env['MONGO_URL'];
console.log({ connectionString });
function connectDB() {
  connect(connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
    .then(() => {
      console.info("Connected to Database");
    })
    .catch((error) => {
      console.error(error.message);
    });

}
module.exports = { connectDB };