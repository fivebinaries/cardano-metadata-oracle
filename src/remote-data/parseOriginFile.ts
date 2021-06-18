import * as yaml from 'js-yaml';
import * as fs from 'fs';
import Ajv from 'ajv';
import { DataSources } from '../types';
import { ERROR } from '../constants/messages';

const schema = {
    type: 'object',
    patternProperties: {
        //allow string keys
        '^[a-zA-Z0-9]*$': {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                    },
                    url: {
                        type: 'string',
                    },
                    path: {
                        type: 'string',
                    },
                    abort_on_failure: {
                        type: 'boolean',
                    },
                },
                required: ['name', 'url', 'path'],
            },
        },
    },
};

const validateOriginFile = (data: unknown) => {
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
    if (!fs.existsSync(filePath)) {
        throw Error(ERROR.ORIGIN_FILE_DOES_NOT_EXIST);
    }
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContent);

    const result = validateOriginFile(data);
    if (!result.success) {
        console.log(result.errors);
        throw Error(ERROR.ORIGIN_FILE_NOT_VALID);
    }
    return data as DataSources;
};
