import App from "./app";
(async () => {
  const app = new App();
  await app.init();

  process.on("SIGINT", async () => {
    await app.terminate();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await app.terminate();
    process.exit(0);
  });
})();
