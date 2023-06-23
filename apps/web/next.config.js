const config = {
  reactStrictMode: true,
  transpilePackages: ["@nanodrop/contracts"],
  images: {
    unoptimized: true,
  },
};

if (process.env.NODE_ENV === "development") {
  config.rewrites = async () => [
    {
      source: "/:any*",
      destination: "/",
    },
  ];
} else {
  config.output = "export";
}

module.exports = config;
