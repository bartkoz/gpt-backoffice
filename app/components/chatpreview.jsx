import {
  Container,
  Divider,
  FormControl,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { Fragment, useContext } from "react";
import ChatSetupContext from "~/components/context";
import Message from "~/components/message";
import SendIcon from "@mui/icons-material/Send";

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
                {chatSetupFrontend.bar_message ??
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
            height: "350px",
            display: "flex", // Add flexbox
            flexDirection: "column", // Column direction
          }}
        >
          <Box style={{ flexGrow: 1 }}>
            {" "}
            {/* This box takes up all available space */}
            <Message />
            {/*<Recommendation />*/}
          </Box>
          <Box sx={{ m: 1 }} mt={2} display="flex" alignItems="center">
            <FormControl fullWidth>
              <TextField
                value=""
                label={chatSetupFrontend.ask_a_question ?? "Ask a question..."}
                variant="outlined"
              />
            </FormControl>
            <IconButton aria-label="send" sx={{ color: "rgb(0, 33, 77)" }}>
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Fragment>
  );
}
