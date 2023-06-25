import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  Link,
  Skeleton,
  Typography,
} from "@mui/material";

import {
  useNanoMachineCollection,
  useNanoMachineData,
} from "@/features/nano-machine/hooks/useNanoMachine";

export default function Drop({
  nanoMachineId,
  createdAt,
}: {
  nanoMachineId: string;
  createdAt: string;
}) {
  const { nanoMachineData } = useNanoMachineData(nanoMachineId);
  const { collectionUriMetadata } = useNanoMachineCollection(
    nanoMachineData?.collectionMint.toBase58()
  );

  return (
    <Grid item xs={12} sm={5} lg={3}>
      <Link
        href={!collectionUriMetadata ? undefined : `/${nanoMachineId}`}
        sx={{
          textDecoration: "none",
        }}
      >
        <Card>
          <CardHeader
            title={
              !collectionUriMetadata ? (
                <Skeleton
                  height={28}
                  width="80%"
                  sx={{
                    marginBottom: 6,
                  }}
                />
              ) : (
                collectionUriMetadata.name
              )
            }
          />
          {!collectionUriMetadata ? (
            <Box
              sx={{
                height: 0,
                paddingTop: "100%",
                width: "100%",
                position: "relative",
              }}
            >
              <Skeleton
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: "100%",
                }}
                variant="rectangular"
              />
            </Box>
          ) : (
            <Box
              sx={{
                height: 0,
                paddingTop: "100%",
                width: "100%",
                position: "relative",
              }}
            >
              <CardMedia
                component="img"
                image={collectionUriMetadata.image}
                alt="Collection image"
                sx={{
                  objectFit: "cover",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: "100%",
                }}
              />
            </Box>
          )}
          <CardContent>
            {!collectionUriMetadata ? (
              <>
                <Skeleton height={24} style={{ marginBottom: 6 }} />
                <Skeleton height={24} style={{ marginBottom: 6 }} width="80%" />
                <Skeleton height={14} width="80%" />
              </>
            ) : (
              <>
                <Typography component="p">
                  {collectionUriMetadata.description}
                </Typography>
                <Typography variant="caption">
                  Created at: {new Date(createdAt).toLocaleString()}
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
}
