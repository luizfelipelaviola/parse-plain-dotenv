import { writeFileSync, readdirSync, existsSync } from 'fs';
import { exportVariable, getInput, setFailed } from '@actions/core';
import { parse } from 'dotenv';

function main() {
  try {
    const dataInput = getInput('data', { required: true });
    const parseEnvInput = getInput('parse-env', { required: false }) === 'true';
    const writeEnvInput = getInput('write-env', { required: false }) === 'true';
    const envFilePath = getInput('env-file-path', { required: false });

    const parsed = parse(dataInput);

    if (parseEnvInput)
      Object.entries(parsed).forEach(([key, value]) => {
        exportVariable(key, value);
      });

    if (writeEnvInput) {
      if (!envFilePath) throw new Error('env-file-path is required');
      writeFileSync(envFilePath, dataInput);
      console.log('exists', existsSync(envFilePath));
      console.log('exists', existsSync(`${process.cwd()}/${envFilePath}`));
      console.log('files:', readdirSync(process.cwd()));
    }
  } catch (err) {
    if (err instanceof Error) setFailed(err.message);
    else setFailed('Unknown error');
  }
}

main();
