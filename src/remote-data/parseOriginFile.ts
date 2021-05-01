import * as yaml from "js-yaml";
import * as fs from "fs";
import Ajv from "ajv";
import { DataSources } from "../types";

const schema = {
    type: "object",
    patternProperties: {
        //allow string keys
        "^[a-zA-Z0-9]*$": {
            type: "array",
            items: {
                type: "object",
                properties: {
                    name: {
                        type: "string",
                    },
                    source: {
                        type: "string",
                    },
                    path: {
                        type: "string",
                    },
                    abort_on_failure: {
                        type: "boolean",
                    },
                },
                required: ["name", "source", "path"],
            },
        },
    },
};

const validateOriginFile = (data: any) => {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (!valid) {
        return {
            success: false,
            errors: validate.errors,
        };
    }
    return {
        success: true,
    };
};

export const parseFile = (filePath: string): DataSources | null => {
    try {
        if (!fs.existsSync(filePath)) {
            throw Error("Origin file does not exists.");
        }
        let fileContent = fs.readFileSync(filePath, "utf8");
        let data = yaml.load(fileContent);

        const result = validateOriginFile(data);
        if (!result.success) {
            console.log(result.errors);
            throw Error("Invalid data in origin file.");
        }
        return data as DataSources;
    } catch (e) {
        throw e;
    }
};