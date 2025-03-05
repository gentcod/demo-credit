import app from './app';

import { CONFIG } from './utils/config';
import logger from './utils/logger';
import './db'; // Initialized database
import { createServer } from "http";

const server = createServer(app);
server.listen(CONFIG.PORT)


server.on("listening", () => {
  logger.info(`App running on port ${CONFIG.PORT}`);
});