import { Container, Divider, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Fragment, useContext } from "react";
import ChatSetupContext from "~/components/context";
import Message from "~/components/message";

export default function ChatPreview() {
  const { chatSetupFrontend } = useContext(ChatSetupContext);
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
          <Message />
          {/*<Recommendation />*/}
        </Box>
      </Container>
    </Fragment>
  );
}
