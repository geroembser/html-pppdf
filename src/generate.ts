import puppeteer from "puppeteer";
import url from "url";

let browser: puppeteer.Browser | undefined;
export async function closeBrowser() {
    if (!browser) return; //do nothing

    await browser.close();
    browser = undefined;
}
/// Launches the browser for PDF generation with the specific configuration. If called with an already configured browser, this will lead to closing the old browser
export async function setupBrowser(launchOptions: puppeteer.LaunchOptions = {}): Promise<puppeteer.Browser> {
    await closeBrowser(); //close before re-setup

    browser = await puppeteer.launch({ headless: true, ...launchOptions }); //(re-)setup

    return browser;
}
/// If called without previously having set up a browser, it will setup a browser with a default configuration.
async function getBrowser(): Promise<puppeteer.Browser> {
    if (!browser) {
        browser = await setupBrowser();
    }
    //otherwise cached...
    return browser;
}

/// filePath is a path to a local PDF file
export async function capturePDF(filePath: string): Promise<Buffer> {
    //BROWSER
    const browser = await getBrowser();

    //PAGE SETUP
    const page = await browser.newPage();

    //GOTO PAGE
    const fileURIPath = url.pathToFileURL(filePath); //file uri seems important
    await page.goto(fileURIPath.toString(), {
        waitUntil: "networkidle0"
    });

    //GENERATE PDF
    const buffer = await page.pdf({
        printBackground: true,
        preferCSSPageSize: true
    });

    //CLOSE PAGE
    await page.close();

    return buffer;
}
