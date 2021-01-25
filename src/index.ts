import { setupPDFGenerationFolder } from "./setup";
import { capturePDF } from "./generate";
import path from "path";
import { fileSync as tmpFileSync } from "tmp";
import { writeFile } from "fs-extra";

export interface Options {
    /// Paths of files and directories to include
    includePaths?: string[];
}

export async function generatePDFFromHTMLString(htmlString: string, options: Options): Promise<Buffer> {
    //write html string to tmp file
    const tmpFile = tmpFileSync({ postfix: ".html" }); //postfix is important, such that chromium will render this as HTML
    await writeFile(tmpFile.name, htmlString);

    //generate pdf as always
    const buffer = await generatePDF(tmpFile.name, options);

    //remove tmp file
    tmpFile.removeCallback();

    //return result
    return buffer;
}

export async function generatePDF(htmlPath: string, options: Options): Promise<Buffer> {
    //setup generation folder
    const generationFolder = await setupPDFGenerationFolder(htmlPath, options);

    //generate PDF from generation folder with the specified main filename
    const mainFilePath = path.join(generationFolder.name, path.basename(htmlPath));
    const pdfBuffer = await capturePDF(mainFilePath);

    //delete tmp directory
    generationFolder.removeCallback();

    return pdfBuffer;
}
