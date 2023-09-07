import { useEffect } from "react";

export function ChatPreview() {
  useEffect(() => {
    const div = document.createElement("div");
    const script = document.createElement("script");
    const link = document.createElement("link");

    div.id = "root";
    script.src = "https://storage.googleapis.com/zezwolenia/widget.js";
    script.async = true;
    link.href = "https://storage.googleapis.com/zezwolenia/widget.css";
    link.rel = "stylesheet";

    document.body.appendChild(div);
    document.body.appendChild(script);
    document.body.appendChild(link);

    return () => {
      document.body.removeChild(div);
      document.body.removeChild(script);
      document.body.removeChild(link);
    };
  }, []);
}
