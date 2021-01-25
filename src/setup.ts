import tmp, { fileSync } from "tmp";
import { copy, CopyOptions } from "fs-extra";
import { Options } from ".";
import path from "path";

/// Sets up a temporary folder where the files needed to write the PDF are written to
export async function setupPDFGenerationFolder(htmlPath: string, options: Options): Promise<tmp.DirResult> {
    if (!htmlPath) {
        throw new Error("Needs at least a html file that should be used to generate a PDF from...");
    }

    //tmp dir
    const tmpDir = tmp.dirSync({
        unsafeCleanup: true //required to clean up recursively
    });
    tmpDir.name;

    const copyOptions: CopyOptions = {
        dereference: true //dereference, because it's temporary and we don't wanna run into problems with symlinks...
    };
    //copy html file
    const htmlDestinationPath = path.join(tmpDir.name, path.basename(htmlPath));
    await copy(htmlPath, htmlDestinationPath, copyOptions);

    //copy include files
    const includePathsAndDestinationPaths = options.includePaths?.map(p => [
        p,
        path.join(tmpDir.name, path.basename(p))
    ]);
    await Promise.all(includePathsAndDestinationPaths?.map(([p, dp]) => copy(p, dp, copyOptions)) ?? []);

    //return tmp dir
    return tmpDir;
}
