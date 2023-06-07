import * as dotenv from "dotenv";
import type { GatsbyConfig } from "gatsby";

dotenv.config({ path: ".env.local" });
dotenv.config();

const config: GatsbyConfig = {
  siteMetadata: {
    siteUrl: `https://www.yourdomain.tld`,
  },
};

export default config;
