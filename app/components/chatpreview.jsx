import { Container, Divider, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Fragment, useContext } from "react";
import ChatSetupContext from "~/components/context";

export default function ChatPreview() {
  const { chatSetupBackend, chatSetupFrontend } = useContext(ChatSetupContext);
  const boxStyleUser = {
    backgroundColor: "#e5f1ff",
    color: "#202124",
    borderRadius: "16px",
    display: "inline-block",
    "& a": {
      color: "inherit",
      textDecoration: "underline",
    },
  };
  const boxStyleSystem = {
    backgroundColor: "#f0f0f0",
    color: "#202124",
    borderRadius: "16px",
    display: "inline-block",
    "& a": {
      color: "inherit",
      textDecoration: "underline",
    },
  };
  const exampleMessages = (
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
  return (
    <Fragment>
      <Container>
        <Fragment>
          <Box
            sx={{
              borderTopLeftRadius: "25px",
              borderTopRightRadius: "25px",
            }}
          >
            <Toolbar
              sx={{
                borderTopLeftRadius: "25px",
                borderTopRightRadius: "25px",
                backgroundColor:
                  chatSetupFrontend.background_color ?? "#00214d",
                color: chatSetupFrontend.font_color ?? "#FFFFFF",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography>
                {chatSetupFrontend.welcome_message ??
                  "👋  Glad to help you whenever I can!"}
              </Typography>
            </Toolbar>
          </Box>
        </Fragment>
        <Divider />
        <Box
          style={{
            backgroundColor: "rgb(249,249,249)",
            borderColor: "transparent",
            borderBottomRightRadius: "20px",
            height: "500px",
          }}
        >
          {exampleMessages}
        </Box>
      </Container>
    </Fragment>
  );
}
