import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import { useContext } from "react";
import ChatSetupContext from "~/components/context";

export default function Message() {
  const { chatSetupFrontend } = useContext(ChatSetupContext);
  const boxStyleSystem = {
    backgroundColor: "#f0f0f0",
    color: "#202124",
    borderRadius: "16px",
    marginLeft: "15px",
    display: "inline-block",
    "& a": {
      color: "inherit",
      textDecoration: "underline",
    },
  };
  return (
    <>
      <Box padding={"8px"} sx={{ ...boxStyleSystem }}>
        <Typography
          paddingLeft={"5px"}
          paddingRight={"5px"}
          component="div"
          variant="body2"
          style={{ wordWrap: "break-word" }}
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitLineClamp: 999,
            WebkitBoxOrient: "vertical",
          }}
        >
          {chatSetupFrontend.bar_message ??
            "Hello I'm virtual assistant how may I help you?"}
        </Typography>
      </Box>
    </>
  );
}
