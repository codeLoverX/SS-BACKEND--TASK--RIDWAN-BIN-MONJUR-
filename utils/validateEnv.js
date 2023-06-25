const { cleanEnv, port, str } = require ('envalid');

exports.validateEnv = () => {
  cleanEnv(process.env, {
    PORT: port(),
    MONGO_URL: str(),
    JWT_SECRET: str(),
    ENV: str()
  });
};

