import axios from "axios";
import { useEffect, useState } from "react";

export function ChatPreview({ data }) {
  const [isReady, setIsReady] = useState(false);

  function findFirstShopifyHost(response) {
    if (response.primaryDomain.host.includes("myshopify.com")) {
      return response.primaryDomain.host;
    }
    for (let domain of response.domains) {
      if (domain.host.includes("myshopify.com")) {
        return domain.host;
      }
    }
    return null;
  }

  useEffect(() => {
    const setDomains = async () => {
      try {
        await axios.post(
          `https://backend-rvm4xlf6ba-ey.a.run.app/set-test-domains/`,
          {
            domains: data.domains,
            primaryDomain: data.primaryDomain,
          }
        );
        setIsReady(true);
      } catch (error) {
        console.error("Error setting domains:", error);
      }
    };

    setDomains();
  }, []);

  const host = findFirstShopifyHost(data);
  const url = `https://frontend-dot-chatbot-zezwolenia.ey.r.appspot.com/?host=${host}`;
  return <>{isReady && <iframe src={url} width="300" height="400"></iframe>}</>;
}
