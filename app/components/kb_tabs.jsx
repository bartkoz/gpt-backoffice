import { FormLayout, TextField, Tabs, Layout, Card } from "@shopify/polaris";
import { useCallback, useState } from "react";

export function QAForm({
  inputText,
  inputTextTopic,
  setInputText,
  setInputTextTopic,
}) {
  return (
    <>
      <Layout.Section>
        <FormLayout>
          <FormLayout.Group condensed>
            <TextField
              multiline={4}
              placeholder={"Type your text here..."}
              value={inputText}
              onChange={(newValue) => setInputText(newValue)}
              connectedLeft={
                <TextField
                  labelHidden
                  autoComplete="off"
                  multiline={4}
                  placeholder={"Topic"}
                  value={inputTextTopic}
                  onChange={(newValue) => setInputTextTopic(newValue)}
                />
              }
            />
          </FormLayout.Group>
        </FormLayout>
      </Layout.Section>
      <Layout.Section>
        {/*<div style={{ textAlign: "right" }}>*/}
        {/*  <Button primarySuccess={true} onClick={handleAddAnother}>*/}
        {/*    Add another*/}
        {/*  </Button>*/}
        {/*</div>*/}
      </Layout.Section>
    </>
  );
}
