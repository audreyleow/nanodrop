import axios from "axios";
import axiosRetry from "axios-retry";
import FormData from "form-data";
import fs from "fs";

import { TOTAL_SUPPLY } from ".";

axiosRetry(axios, { retries: 99 });

(async () => {
  for (let i = 0; i < TOTAL_SUPPLY; i++) {
    console.log(`Uploading metadata for token ${i + 1}/${TOTAL_SUPPLY}`);

    await Promise.all([
      uploadFile(
        `metaMWNWwC39BVDkuhpLKCtt4nVfJfBkJucDpERFBid/${i}.json`,
        fs.createReadStream(`./scripts/metacamp-poap/metadata/${i}.json`)
      ),
      uploadFile(
        `metaMWNWwC39BVDkuhpLKCtt4nVfJfBkJucDpERFBid/${i}.png`,
        fs.createReadStream(`./scripts/metacamp-poap/metadata/${i}.png`)
      ),
    ]);
  }
})();

async function uploadFile(fileName: string, stream: fs.ReadStream) {
  const form = new FormData();
  form.append("fileName", fileName);
  form.append("file", stream);
  return axios.post("https://files.nanodrop.it/upload", form);
}
