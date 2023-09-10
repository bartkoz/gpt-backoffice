import { Stack, Tooltip } from "@mui/material";
import ThumbUpIconOffAlt from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownIconOffAlt from "@mui/icons-material/ThumbDownOffAlt";
import { useContext, useState } from "react";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import React from "react";
export const FeedbackWidget = () => {
  const [isHoveredUp, setIsHoveredUp] = useState(false);
  const [isHoveredDown, setIsHoveredDown] = useState(false);
  const iconOpacityUp = isHoveredUp ? 0.5 : 1;
  const iconOpacityDown = isHoveredDown ? 0.5 : 1;
  const handleMouseEnterUp = () => {
    setIsHoveredUp(true);
  };

  const handleMouseLeaveUp = () => {
    setIsHoveredUp(false);
  };

  const handleMouseEnterDown = () => {
    setIsHoveredDown(true);
  };

  const handleMouseLeaveDown = () => {
    setIsHoveredDown(false);
  };
  return (
    <>
      <Box>
        <Typography variant="subtitle2">Jak oceniasz rozmowę?</Typography>
        <Stack direction="row" spacing={1}>
          <Tooltip
            title={
              JSON.parse(localStorage.getItem("chatSetup") || "{}")
                .feedbackPositive || chatSetup.feedbackPositive
            }
            PopperProps={{ style: { zIndex: 9999 } }}
          >
            <ThumbUpIconOffAlt
              fontSize="large"
              style={{
                opacity: iconOpacityUp,
                color:
                  JSON.parse(localStorage.getItem("chatSetup") || "{}")
                    .backgroundColor || chatSetup.backgroundColor,
              }}
              onMouseEnter={handleMouseEnterUp}
              onMouseLeave={handleMouseLeaveUp}
            />
          </Tooltip>
          <Tooltip
            title={
              JSON.parse(localStorage.getItem("chatSetup") || "{}")
                .feedbackNegative || chatSetup.feedbackNegative
            }
            PopperProps={{ style: { zIndex: 9999 } }}
          >
            <ThumbDownIconOffAlt
              fontSize="large"
              style={{
                opacity: iconOpacityDown,
                color:
                  JSON.parse(localStorage.getItem("chatSetup") || "{}")
                    .backgroundColor || chatSetup.backgroundColor,
              }}
              onMouseEnter={handleMouseEnterDown}
              onMouseLeave={handleMouseLeaveDown}
            />
          </Tooltip>
        </Stack>
      </Box>
    </>
  );
};
