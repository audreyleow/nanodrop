import fs from "fs";

const baseMetadata = JSON.parse(
  fs.readFileSync("./scripts/metacamp-poap/base-metadata.json").toString()
);

export const TOTAL_SUPPLY = 100;

for (let i = 0; i < TOTAL_SUPPLY; i++) {
  const metadata = { ...baseMetadata };
  metadata.name = `Metacamp POAP #${i + 1}`;
  metadata.image = `https://files.nanodrop.it/metaMWNWwC39BVDkuhpLKCtt4nVfJfBkJucDpERFBid/${i}.png`;
  metadata.properties.files[0].uri = `https://files.nanodrop.it/metaMWNWwC39BVDkuhpLKCtt4nVfJfBkJucDpERFBid/${i}.png`;
  fs.writeFileSync(
    `./scripts/metacamp-poap/metadata/${i}.json`,
    JSON.stringify(metadata, null, 2)
  );

  fs.copyFileSync(
    "./scripts/metacamp-poap/0.png",
    `./scripts/metacamp-poap/metadata/${i}.png`
  );
}
