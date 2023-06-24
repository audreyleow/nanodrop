import axios from "axios";

import { Phase } from "../types/phase";
import generateMetadata from "./generateMetadata";

export default async function upload({
  backgroundImage,
  nanoMachineId,
  phases,
  description,
  website,
  collectionName,
  symbol,
}: {
  backgroundImage: File | null;
  nanoMachineId: string;
  phases: Phase[];
  description: string;
  website: string;
  collectionName: string;
  symbol: string;
}) {
  const backgroundImageUrlPromise: Promise<string | null> =
    backgroundImage !== null
      ? uploadImage(
          backgroundImage,
          `${nanoMachineId}/background.${backgroundImage.type.split("/")[1]}`
        )
      : Promise.resolve(null);
  const metadataImagesPromise = Promise.all(
    phases.map((phase, index) =>
      uploadImage(
        phase.image,
        `${nanoMachineId}/${index}.${phase.image.type.split("/")[1]}`
      )
    )
  );

  const [, metadataImages] = await Promise.all([
    backgroundImageUrlPromise,
    metadataImagesPromise,
  ]);

  const metadatas = phases.map((phase, index) =>
    generateMetadata({
      name: phase.name,
      description,
      image: metadataImages[index],
      externalUrl: website,
      imageMimeType: phase.image.type,
    })
  );

  const metadataUrlsPromise = Promise.all(
    metadatas.map((metadata, index) =>
      uploadMetadata(metadata, `${nanoMachineId}/${index}.json`)
    )
  );
  const collectionMetadataUrlPromise = uploadMetadata(
    generateMetadata({
      name: collectionName,
      description,
      image: metadataImages[0],
      externalUrl: website,
      imageMimeType: phases[0].image.type,
    }),
    `${nanoMachineId}/collection.json`
  );

  /*const [metadataUrls, collectionMetadataUrl] =*/ await Promise.all([
    metadataUrlsPromise,
    collectionMetadataUrlPromise,
  ]);
}

async function uploadImage(file: File, fileName: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", fileName);

  await axios.post("https://files.nanodrop.it/upload", formData);

  return `https://files.nanodrop.it/${fileName}`;
}

async function uploadMetadata(metadata: string, fileName: string) {
  const formData = new FormData();
  formData.append("file", new Blob([metadata], { type: "application/json" }));
  formData.append("fileName", fileName);

  await axios.post("https://files.nanodrop.it/upload", formData);

  return `https://files.nanodrop.it/${fileName}`;
}
