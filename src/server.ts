import { createServer } from "node:http";
import { createApp } from "./app";
import { connectDatabase, disconnectDatabase } from "./config/database";
import { loadEnv } from "./config/env";
import { logger } from "./config/logger";

async function main() {
  const env = loadEnv();
  await connectDatabase(env);

  const app = createApp({ corsOrigin: env.CORS_ORIGIN });
  const server = createServer(app);

  server.listen(env.PORT, "0.0.0.0", () => {
    logger.info({ port: env.PORT, environment: env.NODE_ENV }, "Task Manager API listening");
  });

  let shuttingDown = false;
  const shutdown = (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info({ signal }, "Graceful shutdown started");

    const forceExit = setTimeout(() => {
      logger.error("Graceful shutdown timed out");
      process.exit(1);
    }, 10000);
    forceExit.unref();

    server.close(async (error) => {
      try {
        await disconnectDatabase();
        if (error) {
          logger.error({ err: error }, "HTTP server shutdown failed");
          process.exitCode = 1;
        }
      } catch (dbError) {
        logger.error({ err: dbError }, "Database shutdown failed");
        process.exitCode = 1;
      } finally {
        clearTimeout(forceExit);
      }
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((error: unknown) => {
  logger.fatal({ err: error }, "Failed to start Task Manager API");
  process.exit(1);
});
