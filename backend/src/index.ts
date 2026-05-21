import { app } from "./app.js";
import "dotenv/config";

const start = async () => {
  try {
    await app.listen({
      port: Number(process.env.PORT) || 4000,
      host: "0.0.0.0",
    });

    console.log("Server running");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};
start();
