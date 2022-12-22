const puppeteer = require("puppeteer");
const express = require("express");
const app = express();
const port = 3000;
app.get("/gpu", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      executablePath: "/usr/bin/google-chrome",
      headless: true,
      args: [
        "--autoplay-policy=no-user-gesture-required",
        "--no-sandbox",
        "--window-size=1280,720",
        "--use-gl=egl",
        "--enable-gpu-rasterization",
        "--enable-zero-copy",
        "--use-vulkan",
        "--ignore-gpu-blocklist",
        "--enable-features=VaapiVideoDecoder",
        "--allow-insecure-localhost",
      ],
    });
    const page = await browser.newPage();
    await page.goto("chrome://gpu", {
      timeout: 5000,
    });
    const image = await page.screenshot({ fullPage: true });
    await browser.close();
    res.set("Content-Type", "image/png");
    res.send(image);
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      return res.sendStatus(500);
    }
  }
});

app.listen(port, () => {
  console.log(`Sample app listening on ${port}`);
});
