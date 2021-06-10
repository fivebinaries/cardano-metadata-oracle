/* istanbul ignore file */
import { PathLike, writeFileSync } from 'fs';

export const writeToFile = (
    filePath: PathLike | number,
    data: string | NodeJS.ArrayBufferView,
): void => {
    try {
        writeFileSync(filePath, data);
    } catch (err) {
        throw Error(`Failed to write to a file ${filePath}`);
    }
};
