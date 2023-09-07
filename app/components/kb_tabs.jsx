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
import { useEffect, useState } from "react";
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
  const domains = "test";
  const handleDelete = async (title) => {
    setIsDeleting(true);
    await axios.post(
      `http://localhost:8000/kb/delete/${domains}?kb_file_name=${title}`
    );
    setIsDeleting(false);
  };

  useEffect(() => {
    const getKBFiles = async () => {
      const response = await axios.get(`http://localhost:8000/kb/${domains}`);
      setUploadedFilesList(response.data);
    };
    getKBFiles();
  }, [isDeleting, isUploading]);
  const [uploadedFilesList, setUploadedFilesList] = useState([]);
  return uploadedFilesList.map((file, index) => (
    <Card key={index}>
      <Grid>
        <Grid.Cell columnSpan={{ xs: 11, sm: 11, md: 11, lg: 11, xl: 11 }}>
          <Card>
            <Text as="h2" variant="bodyMd">
              {file}
            </Text>
          </Card>
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
            Delete
          </Button>
        </Grid.Cell>
      </Grid>
    </Card>
  ));
}

export function uploadModal({ showModal, handleChange }) {
  return (
    <Modal
      title="Uplading in progress."
      open={showModal}
      onClose={handleChange}
    >
      <Modal.Section>
        <Text>
          <p>We are uploading your files, please wait...</p>
        </Text>
      </Modal.Section>
    </Modal>
  );
}
