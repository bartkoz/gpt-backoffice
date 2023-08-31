import { Button, Grid, Paper } from "@mui/material";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import React, { useContext } from "react";
import ChatSetupContext from "~/components/context";

export default function Recommendation() {
  const { chatSetupFrontend } = useContext(ChatSetupContext);
  const recommendation = {
    title: "Example Snowboard",
    image:
      "https://quickstart-9270ec0b.myshopify.com/cdn/shop/products/Main_b9e0da7f-db89-4d41-83f0-7f417b02831d.jpg",
    price: "$150",
  };
  const Img = styled("img")({
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  });
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        margin: "auto",
        maxWidth: "95%",
        backgroundColor: "#f0f0f0",
        marginLeft: "15px",
        marginRight: "15px",
        marginTop: "15px",
      }}
    >
      <Typography
        paddingLeft={"5px"}
        paddingRight={"5px"}
        paddingBottom={"10px"}
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
        {chatSetupFrontend.recommendation_message ??
          "Based on search I recommend"}
      </Typography>
      <Grid container spacing={2}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <Img alt={recommendation.title} src={recommendation.image} />
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="h6" component="div">
                {recommendation.title}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {recommendation.price}
              </Typography>
              <Button variant="contained">
                {chatSetupFrontend.recommendation_button_text ?? "Check"}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
