import { readFileSync } from 'fs';
import { loader } from '@assemblyscript/loader';

const myModule = loader.instantiateSync(
    readFileSync(`${__dirname}/build/untouched.wasm`),
    {
        env: {
            abort(_msg, _file, line, column) {
                console.error(
                `msg: ${(_msg && myModule.__getString(_msg)) || _msg}\n`,
                `file: ${(_file && myModule.__getString(_file)) || _file}\n`,
                `line: ${line}\n`,
                `col: ${column}\n`);
            }
        },
        module: {
            console: {
                log(value) {
                    console.log("logi: " + value);
                }
            }
        }
    }
);

export default myModule;