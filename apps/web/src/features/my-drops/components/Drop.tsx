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
import axios from "axios";
import { useMemo } from "react";
import useSWR from "swr";

import { useNanoMachineData } from "@/features/nano-machine/hooks/useNanoMachine";

export default function Drop({
  nanoMachineId,
  createdAt,
}: {
  nanoMachineId: string;
  createdAt: string;
}) {
  const { nanoMachineData } = useNanoMachineData(nanoMachineId);
  const { data: firstPhaseMetadata } = useSWR(
    `https://files.nanodrop.it/${nanoMachineId}/0.json`,
    (metadata) =>
      axios
        .get<{ image: string; description: string }>(metadata)
        .then((res) => res.data)
  );

  return (
    <Grid item xs={12} sm={5} lg={3}>
      <Link
        href={`/${nanoMachineId}`}
        sx={{
          textDecoration: "none",
        }}
      >
        <Card>
          <CardHeader
            title={`${nanoMachineId.slice(0, 5)}..${nanoMachineId.slice(-5)}`}
          />
          {!firstPhaseMetadata ? (
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
                image={firstPhaseMetadata.image}
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
            {!firstPhaseMetadata ? (
              <>
                <Skeleton height={24} style={{ marginBottom: 6 }} />
                <Skeleton height={24} style={{ marginBottom: 6 }} width="80%" />
                <Skeleton height={14} width="80%" />
              </>
            ) : (
              <>
                <Typography
                  component="p"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: "3",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    mb: 4,
                  }}
                >
                  {firstPhaseMetadata.description}
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
