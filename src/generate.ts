import puppeteer from "puppeteer";
import url from "url";

let browser: puppeteer.Browser;
async function getBrowser(): Promise<puppeteer.Browser> {
    if (!browser) {
        browser = await puppeteer.launch({ headless: true });
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
