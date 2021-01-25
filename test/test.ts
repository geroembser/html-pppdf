import { ensureFile, writeFileSync } from "fs-extra";
import { join } from "path";
import { generatePDF } from "../src";

//simply run a very basic html file to pdf conversion, primarily to check if that works on your system as you would expect...
async function writeTestPDF() {
    const buffer = await generatePDF(join(__dirname, "files/mainTest.html"), {
        includePaths: [join(__dirname, "files/assets")]
    });

    const outputPath = "./output/test.pdf";
    await ensureFile(outputPath);
    writeFileSync(outputPath, buffer);
}

const timeLabel = "Test PDF generation duration";
console.time(timeLabel);
writeTestPDF()
    .then(() => {
        console.log("Test PDF successfully generated! 🎉");
    })
    .catch(e => {
        console.log(`An error occurred during file generation: ${e}`);
    })
    .finally(() => {
        console.timeEnd(timeLabel);
        process.exit();
    });
