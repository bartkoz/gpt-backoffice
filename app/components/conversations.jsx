import {useEffect, useState} from "react";
import axios from "axios";
import {Card} from "@shopify/polaris";

export const ConversationsList = () => {
  const [conversations, setConversations] = useState([]);
  const [conversationData, setConversationData] = useState(undefined);
  const [selectedConversation, setSelectedConversation] = useState(undefined);

  useEffect(() => {
    const getConversationsData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/chat-history/?store_name=zezwolenia.fishster.pl&page=1&size=10');
        setConversations(response.data.items);
        setConversationData(response.data)
      } catch (error) {
        console.error("Failed to fetch conversations data:", error);
      }
    };

    getConversationsData();
  }, []);

  const conversationList = () => {
    return conversations.map((conversation) => {
      return (
        <Card key={conversation.id} onClick={() => {
          setSelectedConversation(conversation.id)
          console.log(conversation.id)
        }}>{conversation.id}</Card>
      )
    })
  }
  if (!conversations) {
    return <Card><div>Loading...</div></Card>;
  }
  return (
    <Card>
      {conversationList()}
    </Card>
  )
}
