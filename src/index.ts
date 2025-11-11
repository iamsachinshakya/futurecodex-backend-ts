import app from "./app";
import logger from "./utils/logger";
import { env } from "./config/env";

app.listen(env.PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`);
});
