import {Form, FormLayout, Select, TextField, Button, Checkbox, Card, VerticalStack, ColorPicker} from '@shopify/polaris';
import {useState, useCallback, useEffect} from 'react';
import axios from "axios";

export default function SetupForm() {
  const [chatSetupBackend, setChatSetupBackend] = useState({});
  const [chatSetupFrontend, setChatSetupFrontend] = useState({});
  const handleSubmit = async () => {
    await axios.post('http://localhost:8000/update-chat-conf/?store_name=localhost:3000', {"backend":chatSetupBackend, "frontend": chatSetupFrontend});
  }

  useEffect(() => {
    const getSetup = async () => {
      try {
        const response = await axios.get('http://localhost:8000/get-chat-conf/?store_name=zezwolenia.fishster.pl');
        if (response.data.backend) {setChatSetupBackend(response.data.backend);}
        if (response.data.frontend) {setChatSetupFrontend(response.data.frontend);}
      } catch (error) {
        console.error("Failed to fetch conversations data:", error);
      }
    };
    getSetup();
  }, [])
  const handleChatSetupBackendChange = event => {
    const { name, value } = event.target;
    setChatSetupBackend(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChatSetupFrontendChange = event => {
    const { name, value } = event.target;
    setChatSetupFrontend(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };


  const options = [
    {label: 'English', value: 'en'},
    {label: 'Spanish', value: 'es'},
    {label: 'French', value: 'fr'},
    {label: 'German', value: 'de'},
    {label: 'Chinese (Simplified)', value: 'zh-CN'},
    {label: 'Chinese (Traditional)', value: 'zh-TW'},
    {label: 'Russian', value: 'ru'},
    {label: 'Japanese', value: 'ja'},
    {label: 'Korean', value: 'ko'},
    {label: 'Portuguese', value: 'pt'},
    {label: 'Italian', value: 'it'},
    {label: 'Dutch', value: 'nl'},
    {label: 'Arabic', value: 'ar'},
    {label: 'Swedish', value: 'sv'},
    {label: 'Danish', value: 'da'},
    {label: 'Norwegian', value: 'no'},
    {label: 'Finnish', value: 'fi'},
    {label: 'Polish', value: 'pl'},
    {label: 'Turkish', value: 'tr'},
    {label: 'Greek', value: 'el'},
    {label: 'Hebrew', value: 'he'},
    {label: 'Hindi', value: 'hi'},
    {label: 'Bengali', value: 'bn'},
    {label: 'Urdu', value: 'ur'},
    {label: 'Punjabi', value: 'pa'},
    {label: 'Tamil', value: 'ta'},
    {label: 'Telugu', value: 'te'},
    {label: 'Malayalam', value: 'ml'},
    {label: 'Kannada', value: 'kn'},
    {label: 'Gujarati', value: 'gu'},
    {label: 'Marathi', value: 'mr'},
    {label: 'Filipino', value: 'tl'},
    {label: 'Indonesian', value: 'id'},
    {label: 'Thai', value: 'th'},
    {label: 'Malay', value: 'ms'},
    {label: 'Vietnamese', value: 'vi'},
    {label: 'Ukrainian', value: 'uk'},
    {label: 'Czech', value: 'cs'},
    {label: 'Hungarian', value: 'hu'},
    {label: 'Romanian', value: 'ro'},
    {label: 'Bulgarian', value: 'bg'}
  ]
  // if (!chatSetupBackend.length && !chatSetupBackend.length) {
  //   return <div>Loading...</div>;
  // }
  return (
    <>
      <Card>
        <VerticalStack gap="4">
    <Form onSubmit={handleSubmit}>
      <FormLayout>
        <Checkbox
          label="Recommend products from the store"
          // @ts-ignore
          checked={chatSetupBackend.recommendations ?? false}
          onChange={value => handleChatSetupBackendChange({ target: { value: value, name: 'recommendations' } })}
        />
        <Select
          label="Language"
          options={options}
          onChange={value => handleChatSetupBackendChange({ target: { value: value ?? 'en', name: 'language' } })}
          // @ts-ignore
          value={chatSetupBackend.language ?? 'en'}
        />
        <TextField
          multiline={4}
          // @ts-ignore
          value={chatSetupBackend.dynamic_context ?? ''}
          onChange={value => handleChatSetupBackendChange({ target: { value: value, name: 'dynamic_context' } })}
          label="System prompt"
          helpText={
            <span>
              Information that will help chatbot to understand what your store is about. Based on the information and knowledge base answers are constructed.
            </span>
          }
        />
        <TextField
          // @ts-ignore
          value={chatSetupFrontend.background_color ?? '#f9f9f9'}
          onChange={value => handleChatSetupFrontendChange({ target: { value: value, name: 'background_color' } })}
          label="Chat stripe color"
          helpText={
            <span>
              Hex value (ex. #000000)
            </span>
          }
        />
        <TextField
          // @ts-ignore
          value={chatSetupFrontend.font_color ?? '#00214d'}
          onChange={value => handleChatSetupFrontendChange({ target: { value: value, name: 'font_color' } })}
          label="Chat font color"
          helpText={
            <span>
              Hex value (ex. #000000)
            </span>
          }
        />
        <TextField
          // @ts-ignore
          value={chatSetupFrontend.bar_message ?? 'Hello I\'m virtual assistant how may I help you?'}
          onChange={value => handleChatSetupFrontendChange({ target: { value: value, name: 'bar_message' } })}
          label="Chat bar message"
        />
        <TextField
          // @ts-ignore
          multiline={2}
          value={chatSetupFrontend.welcome_message ?? '👋  Glad to help you whenever I can!'}
          onChange={value => handleChatSetupFrontendChange({ target: { value: value, name: 'welcome_message' } })}
          label="Chat welcome message"
        />
        <TextField
          // @ts-ignore
          multiline={2}
          value={chatSetupFrontend.recommendation_message ?? 'Based on search I recommend'}
          onChange={value => handleChatSetupFrontendChange({ target: { value: value, name: 'recommendation_message' } })}
          label="Chat recommendation message"
        />
        <TextField
          // @ts-ignore
          value={chatSetupFrontend.recommendation_button_text ?? 'Check'}
          onChange={value => handleChatSetupFrontendChange({ target: { value: value, name: 'recommendation_button_text' } })}
          label="Chat recommendation button message"
        />
        <Button submit primarySuccess={true}>Save</Button>
      </FormLayout>
    </Form>
        </VerticalStack>
      </Card>
    </>
  );
}
