import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Typography,
} from "@mui/material";

export default function AssetsUploadInstructions() {
  return (
    <Accordion
      sx={{
        my: 4,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
        }}
        component={AccordionSummary}
        expandIcon={<ExpandMoreIcon />}
      >
        How to prepare my NFT assets?
      </Typography>
      <AccordionDetails>
        <Typography
          sx={{
            fontStyle: "italic",
          }}
          variant="caption"
          gutterBottom
        >
          (Credits to Metaplex for their amazing documentation which inspired
          this section)
        </Typography>
        <Typography gutterBottom variant="h6">
          Example NFT collection:
        </Typography>
        <Typography gutterBottom>
          A 10 item collection of NFTs will compromise of the following 20
          files:
        </Typography>
        <Box
          sx={{
            border: "1px solid #ffffff",
            "& td": {
              border: "1px solid #ffffff",
              padding: 2,
            },
            borderCollapse: "collapse",
            "& thead": {
              fontWeight: 700,
            },
            mb: 2,
          }}
          component="table"
        >
          <thead>
            <tr>
              <td>Image</td>
              <td>Metadata</td>
            </tr>
          </thead>
          {Array.from({ length: 10 }).map((_, index) => (
            <tr key={index}>
              <td>{index}.png</td>
              <td>{index}.json</td>
            </tr>
          ))}
        </Box>
        <Alert severity="warning">
          When organizing your collection, the first item is labeled as 0, the
          second item as 1, and so on. In a 10,000 supply NFT collection, we
          will start with 0.png and 0.json, and ends with 9999.png and
          9999.json. It&apos;s important to keep the numbering in order without
          any missing numbers in between.
        </Alert>
        <Typography gutterBottom variant="h6">
          Metadata json file contents
        </Typography>
        <Typography component="div" gutterBottom>
          Follow the{" "}
          <Box
            component="a"
            sx={{
              color: "#ffffff",
            }}
            href="https://docs.metaplex.com/programs/token-metadata/token-standard#the-non-fungible-standard"
            target="_blank"
            rel="noreferrer noopener"
          >
            Metaplex Token Standard
          </Box>{" "}
          for the json metadata files. You can exclude any image or file urls as
          NanoDrop will automatically generate them for you.
        </Typography>
        <Box
          sx={{
            "& > pre": {
              whiteSpace: "pre-wrap",
            },
          }}
        >
          <pre>
            {"Example 0.json\n\n"}
            {JSON.stringify(
              {
                name: "My Awesome Collection #1",
                symbol: "AWESOME",
                description:
                  "This is an awesome compressed NFT on the Solana blockchain!",
                external_url: "https://myawesomewebsite.com",
                attributes: [
                  {
                    trait_type: "trait1",
                    value: "value1",
                  },
                  {
                    trait_type: "trait2",
                    value: "value2",
                  },
                ],
              },
              null,
              2
            )}
          </pre>
        </Box>
        <Typography gutterBottom variant="h6">
          Uploading to NanoDrop
        </Typography>
        <Typography gutterBottom>
          Once you have prepared the assets, put all the .png and .json files
          into one folder and select and upload them all at once via the file
          picker below.
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}
