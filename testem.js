module.exports = {
    test_page: "tests/index.html?hidepassed",
    disable_watching: true,
    launch_in_ci: [
        "Chrome"
    ],
    launch_in_dev: [
        "Chrome"
    ],
    browser_args: {
        Chrome: {
            all: "--window-size=1440,900",
            ci: [
                // --no-sandbox is needed when running Chrome inside a container
                "--no-sandbox",
                "--disable-gpu",
                "--headless",
                "--remote-debugging-port=0"
            ].filter(Boolean)
        }
    }
};
