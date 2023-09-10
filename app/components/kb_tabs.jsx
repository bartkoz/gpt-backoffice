import {
  FormLayout,
  TextField,
  Tabs,
  Layout,
  Card,
  DropZone,
  Grid,
  Text,
  Button,
  Modal,
} from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

export function QAForm({
  inputText,
  inputTextTopic,
  setInputText,
  setInputTextTopic,
}) {
  return (
    <Layout.Section>
      <FormLayout>
        <FormLayout.Group condensed>
          <TextField
            multiline={4}
            placeholder={"Answer"}
            value={inputText}
            onChange={(newValue) => setInputText(newValue)}
            connectedLeft={
              <TextField
                labelHidden
                autoComplete="off"
                multiline={4}
                placeholder={"Question"}
                value={inputTextTopic}
                onChange={(newValue) => setInputTextTopic(newValue)}
              />
            }
          />
        </FormLayout.Group>
      </FormLayout>
    </Layout.Section>
  );
}

export function KbFileUpload({
  handleDropZoneDrop,
  isUploading,
  uploadedFiles,
  fileUpload,
}) {
  return (
    <Layout.Section>
      <DropZone onDrop={handleDropZoneDrop} disabled={isUploading}>
        {uploadedFiles}
        {fileUpload}
      </DropZone>
    </Layout.Section>
  );
}

export function KBFilesList({ isDeleting, isUploading, setIsDeleting, shop }) {
  const handleDelete = async (title) => {
    setIsDeleting(true);
    await axios.post(
      `https://backend-rvm4xlf6ba-ey.a.run.app/kb/delete/${shop}?kb_file_name=${title}`
    );
    setIsDeleting(false);
  };

  useEffect(() => {
    const getKBFiles = async () => {
      const response = await axios.get(`https://backend-rvm4xlf6ba-ey.a.run.app/kb/${shop}`);
      setUploadedFilesList(response.data);
    };
    getKBFiles();
  }, [isDeleting, isUploading]);
  const [uploadedFilesList, setUploadedFilesList] = useState([]);
  return uploadedFilesList.map((file, index) => (
    <Card key={index}>
      <Grid>
        <Grid.Cell columnSpan={{ xs: 11, sm: 11, md: 11, lg: 11, xl: 11 }}>
          <Text as="h2" variant="bodyMd">
            {file}
          </Text>
        </Grid.Cell>
        <Grid.Cell
          columnSpan={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            destructive={true}
            onClick={() => {
              handleDelete(file);
            }}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting" : "Delete"}
          </Button>
        </Grid.Cell>
      </Grid>
    </Card>
  ));
}

export function KbTabs({
  handleDropZoneDrop,
  isUploading,
  uploadedFiles,
  fileUpload,
  inputText,
  inputTextTopic,
  setInputText,
  setInputTextTopic,
}) {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const tabs = [
    {
      id: "file",
      title: "file-upload",
      content: "File upload",
    },
    {
      id: "inline",
      title: "QA",
      content: "QA",
    },
  ];

  return (
    <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
      {selected === 0 ? (
        <KbFileUpload
          handleDropZoneDrop={handleDropZoneDrop}
          isUploading={isUploading}
          uploadedFiles={uploadedFiles}
          fileUpload={fileUpload}
        />
      ) : (
        <QAForm
          inputText={inputText}
          inputTextTopic={inputTextTopic}
          setInputText={setInputText}
          setInputTextTopic={setInputTextTopic}
        />
      )}
    </Tabs>
  );
}
