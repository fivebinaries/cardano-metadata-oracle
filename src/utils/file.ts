import { writeFileSync } from 'fs';

export const writeToFile = (filePath: string, data: Uint8Array) => {
    try {
        writeFileSync(filePath, data);
    } catch (err) {
        throw Error(`Failed to write to a file ${filePath}`);
    }
};
