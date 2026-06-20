import { pinterest } from 'btch-downloader';

async function test() {
  try {
    const data = await pinterest('https://in.pinterest.com/pin/1033224339462719602/');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(error);
  }
}

test();
