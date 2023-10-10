import { Button, Icon, LegacyCard, LegacyStack } from "@shopify/polaris";
import { Stack } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { CancelMajor } from "@shopify/polaris-icons";

export default function Onboarding(shop) {
  const [onboardingStep, setOnboardingStep] = useState(null);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const resp = async () => {
      await axios
        .get(
          `https://backend-rvm4xlf6ba-ey.a.run.app/onboarding/?shop_name=${shop.shop}`
        )
        .then((resp) => {
          setIsReady(true);
          setOnboardingStep(resp.data);
        });
    };
    resp();
  }, []);

  const updateOnboarding = async (step) => {
    setOnboardingStep(step);
    await axios.post(
      `https://backend-rvm4xlf6ba-ey.a.run.app/onboarding/?shop_name=${shop.shop}&step=${step}`
    );
  };

  const CloseButton = ({ onClick }) => (
    <span onClick={onClick} style={{ cursor: "pointer" }} color={"black"}>
      <Icon source={CancelMajor} color="base" />
    </span>
  );

  return (
    onboardingStep < 5 &&
    isReady && (
      <LegacyCard title="First steps">
        <LegacyCard.Section
          title="Chat settings"
          actions={
            onboardingStep === 1 && [
              {
                content: <CloseButton onClick={() => updateOnboarding(2)} />,
              },
            ]
          }
        >
          <LegacyStack>
            <p>
              Easily define the look of your chat by adjusting colors and basic
              design features to harmoniously integrate it into your shop’s
              interface.
            </p>
            <br />
            <Button
              disabled={onboardingStep > 1}
              primarySuccess={onboardingStep <= 1}
              onClick={() => {
                updateOnboarding(2);
                window.open(
                  `https://${shop.shop}/admin/apps/gpt-chat/app/settings`,
                  "_blank"
                );
              }}
            >
              {onboardingStep <= 1 ? "Configure" : "Done"}
            </Button>
          </LegacyStack>
        </LegacyCard.Section>
        <LegacyCard.Section
          title="Knowledge base"
          actions={
            onboardingStep === 2 && [
              {
                content: <CloseButton onClick={() => updateOnboarding(3)} />,
              },
            ]
          }
        >
          <LegacyStack>
            <p>
              Enrich your chatbot by defining your own data in the Knowledge
              Base, enabling it to craft precise and personalized responses,
              enhancing user interactions and satisfaction!
            </p>
            <Button
              disabled={onboardingStep !== 2}
              primarySuccess={onboardingStep === 2}
              onClick={() => {
                updateOnboarding(3);
                window.open(
                  `https://${shop.shop}/admin/apps/gpt-chat/app/kb`,
                  "_blank"
                );
              }}
            >
              {onboardingStep < 2
                ? "Complete previous step"
                : onboardingStep === 2
                ? "Configure"
                : "Done"}
            </Button>
          </LegacyStack>
        </LegacyCard.Section>
        <LegacyCard.Section
          title="Chat preview"
          actions={
            onboardingStep === 3 && [
              {
                content: <CloseButton onClick={() => updateOnboarding(4)} />,
              },
            ]
          }
        >
          <LegacyStack>
            <p>
              Explore and test your chat's functionality and aesthetic changes
              in real-time with Chat Preview, ensuring everything works
              perfectly before going live to your audience.
            </p>
            <Button
              disabled={onboardingStep !== 3}
              primarySuccess={onboardingStep === 3}
              onClick={() => {
                updateOnboarding(4);
                window.open(
                  `https://${shop.shop}/admin/apps/gpt-chat/app/preview`,
                  "_blank"
                );
              }}
            >
              {onboardingStep < 3
                ? "Complete previous step"
                : onboardingStep === 3
                ? "Configure"
                : "Done"}
            </Button>
          </LegacyStack>
        </LegacyCard.Section>
        <LegacyCard.Section
          title="Seamless Chat Integration Awaits"
          actions={
            onboardingStep === 4 && [
              {
                content: <CloseButton onClick={() => updateOnboarding(5)} />,
              },
            ]
          }
        >
          <LegacyStack>
            <p>
              Effortlessly add our chat plugin to your Shopify store and enhance
              your customer service, providing timely and efficient responses to
              all shopper inquiries.
            </p>
            <Button
              disabled={onboardingStep !== 4}
              primarySuccess={onboardingStep === 4}
              onClick={() => {
                updateOnboarding(5);
                window.open(
                  `https://${shop.shop}/admin/apps/gpt-chat/app/add-to-theme`,
                  "_blank"
                );
              }}
            >
              {onboardingStep < 4
                ? "Complete previous step"
                : onboardingStep === 4
                ? "Configure"
                : "Done"}
            </Button>
          </LegacyStack>
        </LegacyCard.Section>
      </LegacyCard>
    )
  );
}
