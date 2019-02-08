/**
 * Configuration
 *
 * A .env file is required.
 * Required keys: PORT
 * Recommennded keys: BASE_URL, NODE_ENV, SESSION_SECRET
 * Optional keys: MONGO_USER, MONGO_PASS, MONGO_HOST, MONGO_PORT, MONGO_DB, RATE_LIMIT_WINDOW, RATE_LIMIT_MAX
 *
 */
require("dotenv").config()

const
  env = process.env.NODE_ENV || "development",
  baseUrl = process.env.BASE_URL || `http://localhost${process.env.PORT ? ":" + process.env.PORT : ""}`,
  port = process.env.PORT,
  sessionSecret = process.env.SESSION_SECRET || "keyboard cat",
  mongoUser = process.env.MONGO_USER || "",
  mongoPass = process.env.MONGO_PASS || "",
  mongoAuth = mongoUser ? `${mongoUser}:${mongoPass}@` : "",
  mongoHost = process.env.MONGO_HOST || "localhost",
  mongoPort = process.env.MONGO_PORT || 27017,
  mongoDb = (process.env.MONGO_DB || "cocoda-userdb") + (env == "test" ? "-test" : ""),
  mongoUrl = `mongodb://${mongoAuth}${mongoHost}:${mongoPort}/${mongoDb}`,
  mongoOptions = {
    reconnectTries: 60,
    reconnectInterval: 1000,
    useNewUrlParser: true
  },
  rateLimitWindow = process.env.RATE_LIMIT_WINDOW || (60 * 1000),
  rateLimitMax = process.env.RATE_LIMIT_MAX || 10

let config = {
  env,
  baseUrl,
  port,
  database: {
    url: mongoUrl,
    options: mongoOptions,
  },
  sessionSecret,
  rateLimitOptions: {
    windowMs: rateLimitWindow,
    max: rateLimitMax,
  },
}

// Load providers
try {
  config.providers = require("./providers.json")
} catch(error) {
  config.providers = []
}
// Prepare providers
for (let provider of config.providers) {
  provider.loginURL = `${baseUrl}/login/${provider.id}`,
  provider.callbackURL = `${baseUrl}/login/${provider.id}/return`
}

module.exports = config
