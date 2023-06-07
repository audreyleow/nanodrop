import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { Button, CircularProgress, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";

export default function useToasts() {
  const theme = useTheme();

  const style = useMemo(
    () => ({
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    }),
    [theme.palette.background.paper, theme.palette.text.primary]
  );

  const sendTransactionToast = useCallback(
    (signature: string) =>
      toast(
        <ActionableToast>
          <ToastTypography component="div">
            <CircularProgress color="inherit" size={16} />
            Sending transaction...
          </ToastTypography>
          <Button
            size="small"
            color="inherit"
            component="a"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://solscan.io/tx/${signature}`}
          >
            Details
          </Button>
        </ActionableToast>,
        {
          style,
          duration: Infinity,
        }
      ),
    [style]
  );

  const errorToast = useCallback(
    (message: string) =>
      toast(
        <ToastTypography component="div">
          <ErrorIcon fontSize="small" />
          {message}
        </ToastTypography>,
        {
          style,
        }
      ),
    [style]
  );

  const transactionSuccessToast = useCallback(
    (signature: string) =>
      toast(
        <ActionableToast>
          <ToastTypography component="div">
            <CheckCircleIcon fontSize="small" />
            Transaction success!
          </ToastTypography>
          <Button
            size="small"
            color="inherit"
            component="a"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://solscan.io/tx/${signature}`}
          >
            Details
          </Button>
        </ActionableToast>,
        {
          style,
        }
      ),
    [style]
  );

  return { sendTransactionToast, errorToast, transactionSuccessToast };
}

const ActionableToast = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
});

const ToastTypography = styled(Typography)<{ component?: any }>({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
});
