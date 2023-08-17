import {Form, FormLayout, Select, TextField, Button, Checkbox, Card, VerticalStack, ColorPicker} from '@shopify/polaris';
import {useState, useCallback} from 'react';

export default function SetupForm() {
  const [chatSetupBackend, setChatSetupBackend] = useState({});
  const [chatSetupFrontend, setChatSetupFrontend] = useState({});
  const handleSubmit = useCallback(() => {
  }, []);

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

  const handleBackgroundColor = event => {
    const { name, value } = event.target;
    setChatSetupFrontend(prevState => ({
      ...prevState,
      'background_color': value,
    }));
  }

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

  return (
    <>
      <Card>
        <VerticalStack gap="4">
    <Form onSubmit={handleSubmit}>
      <FormLayout>
        <Checkbox
          name={'recommendations'}
          label="Recommend products from the store"
          // @ts-ignore
          checked={chatSetupBackend.recommendations}
          onChange={handleChatSetupBackendChange}
        />
        <Select
          label="Language"
          options={options}
          onChange={handleChatSetupBackendChange}
          // @ts-ignore
          value={chatSetupBackend.language}
        />
        <TextField
          multiline={4}
          // @ts-ignore
          value={chatSetupBackend.dynamic_context}
          onChange={handleChatSetupBackendChange}
          label="System prompt"
          helpText={
            <span>
              Information that will help chatbot to understand what your store is about. Based on the information and knowledge base answers are constructed.
            </span>
          }
        />
        <TextField
          // @ts-ignore
          value={chatSetupFrontend.background_color}
          onChange={handleChatSetupFrontendChange}
          label="Chat stripe color"
          helpText={
            <span>
              Hex value (ex. #000000)
            </span>
          }
        />
        <TextField
          // @ts-ignore
          value={chatSetupFrontend.font_color}
          onChange={handleChatSetupFrontendChange}
          label="Chat font color"
          helpText={
            <span>
              Hex value (ex. #000000)
            </span>
          }
        />
        <TextField
          // @ts-ignore
          value={chatSetupFrontend.bar_message}
          onChange={handleChatSetupFrontendChange}
          label="Chat bar message"
        />
        <TextField
          // @ts-ignore
          multiline={2}
          placeholder={'👋 Glad to help you whenever I can!'}
          value={chatSetupFrontend.welcome_message}
          onChange={handleChatSetupFrontendChange}
          label="Chat welcome message"
        />
        <TextField
          // @ts-ignore
          multiline={2}
          value={chatSetupFrontend.recommendation_message}
          onChange={handleChatSetupFrontendChange}
          label="Chat recommendation message"
        />
        <TextField
          // @ts-ignore
          value={chatSetupFrontend.recommendation_button_text}
          onChange={handleChatSetupFrontendChange}
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
