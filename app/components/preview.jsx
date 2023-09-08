export function ChatPreview(shop) {
  window.localStorage.setItem("shopHost", shop);
  return (
    <iframe
      src="https://frontend-dot-chatbot-zezwolenia.ey.r.appspot.com/"
      width="600"
      height="800"
    ></iframe>
  );
}
