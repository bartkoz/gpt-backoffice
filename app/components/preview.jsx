import axios from "axios";
import { useEffect, useState } from "react";

export function ChatPreview({ data }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const setDomains = async () => {
      try {
        await axios.post(`https://backend-rvm4xlf6ba-ey.a.run.app/set-test-domains/`, {
          domains: data.domains,
          primaryDomain: data.primaryDomain,
        });
        setIsReady(true);
      } catch (error) {
        console.error("Error setting domains:", error);
      }
    };

    setDomains();
  }, []);

  return (
    <>
      {isReady && (
        <iframe
          src="https://frontend-dot-chatbot-zezwolenia.ey.r.appspot.com/"
          width="600"
          height="800"
        ></iframe>
      )}
    </>
  );
}
