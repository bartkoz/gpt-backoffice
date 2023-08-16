import {Form, FormLayout, Select, TextField, Button, Checkbox} from '@shopify/polaris';
import {useState, useCallback} from 'react';

export default function SetupForm() {
  const [recommendProducts, setRecommendProducts] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = useCallback(() => {
  }, []);

  const handleSetRecommendedProductsChange = useCallback(
    (value) => setRecommendProducts(value),
    [],
  );
  const [selected, setSelected] = useState('en');

  const handleSelectChange = useCallback(
    (value) => setSelected(value),
    [],
  );
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


  const handleEmailChange = useCallback((value) => setEmail(value), []);

  return (
    <Form onSubmit={handleSubmit}>
      <FormLayout>
        <Checkbox
          label="Recommend products from the store"
          checked={recommendProducts}
          onChange={handleSetRecommendedProductsChange}
        />
        <Select
          label="Language"
          options={options}
          onChange={handleSelectChange}
          value={selected}
        />
        <TextField
          multiline={4}
          value={email}
          onChange={handleEmailChange}
          label="System prompt"
          helpText={
            <span>
              Information that will help chatbot to understand what your store is about. Based on the information and knowledge base answers are constructed.
            </span>
          }
        />

        <Button submit>Save</Button>
      </FormLayout>
    </Form>
  );
}
