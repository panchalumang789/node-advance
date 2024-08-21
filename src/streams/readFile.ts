import { createReadStream } from 'fs';
import { createInterface } from 'readline';

export const readFileStream = () => {
  const readFileInterface = createInterface({
    input: createReadStream('./README.md'),
    crlfDelay: Infinity,
  });
  return readFileInterface;
};
