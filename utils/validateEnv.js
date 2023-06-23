const { cleanEnv, port, str } = require ('envalid');

exports.validateEnv = () => {
  cleanEnv(process.env, {
    PORT: port(),
    POSTGRES_HOST: str(),
    POSTGRES_PORT: port(),
    POSTGRES_USER: str(),
    POSTGRES_PASSWORD: str(),
    POSTGRES_DB: str(),
  });
};

