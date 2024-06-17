import App from "./app";

(async () => {
    let app;
    try {
        app = new App();
        await app.init();
    } finally {
        await app?.terminate();
    }
})();