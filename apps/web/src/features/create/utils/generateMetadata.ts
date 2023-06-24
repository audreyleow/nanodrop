export default function generateMetadata({
  name,
  image,
  externalUrl,
  description,
  imageMimeType,
}: {
  name: string;
  description: string;
  image: string;
  externalUrl: string;
  imageMimeType: string;
}) {
  const metadata = {
    name,
    description,
    image,
    attributes: [],
    properties: {
      files: [
        {
          uri: image,
          type: imageMimeType,
        },
      ],
      category: "image",
    },

    ...(externalUrl.trim() !== "" && { external_url: externalUrl }),
  };

  return JSON.stringify(metadata);
}
