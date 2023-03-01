import { exportVariable, getInput, setFailed } from '@actions/core';
import { parse } from 'dotenv';

function main() {
  try {
    const data = getInput('data', { required: true });
    const parsed = parse(data);
    Object.entries(parsed).forEach(([key, value]) => {
      exportVariable(key, value);
    });
  } catch (err) {
    if (err instanceof Error) setFailed(err.message);
    else setFailed('Unknown error');
  }
}

main();
