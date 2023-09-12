import {
  FormLayout,
  TextField,
  Layout,
  DropZone,
  IndexTable,
  LegacyCard,
  useIndexResourceState,
  Icon,
  Link,
  PageActions,
  Modal,
  Button,
} from "@shopify/polaris";
import { useEffect, useState } from "react";
import axios from "axios";
import { FileFilledMinor } from "@shopify/polaris-icons";

export function QAForm({
  inputText,
  inputTextTopic,
  setInputText,
  setInputTextTopic,
  handleSubmit,
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
        <FormLayout.Group>
          <Button primarySuccess onClick={handleSubmit}>
            Save
          </Button>
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
  handleSubmit,
}) {
  return (
    <>
      <Layout.Section>
        <DropZone onDrop={handleDropZoneDrop} disabled={isUploading}>
          {uploadedFiles}
          {fileUpload}
        </DropZone>
      </Layout.Section>
      <Layout.Section>
        <Button primarySuccess onClick={handleSubmit}>
          Save
        </Button>
      </Layout.Section>
    </>
  );
}

export function KBFilesList({ isDeleting, isUploading, setIsDeleting, shop }) {
  const handleDelete = async () => {
    setIsDeleting(true);
    selectedResources.forEach(async function (element, index, arr) {
      await axios.post(
        `http://localhost:8000/kb/delete/${shop}?uid=${element}`
      );
    });
    setIsDeleting(false);
  };

  useEffect(() => {
    const getKBFiles = async () => {
      const response = await axios.get(`http://localhost:8000/kb/${shop}`);
      setUploadedFilesList(response.data);
    };
    getKBFiles();
  }, [isDeleting, isUploading]);
  const [uploadedFilesList, setUploadedFilesList] = useState([]);
  const resourceName = {
    singular: "Data",
    plural: "Data",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(uploadedFilesList);

  const rowMarkup = uploadedFilesList.map(
    ({ id, topic, type, preview }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>{topic}</IndexTable.Cell>
        <IndexTable.Cell>{type}</IndexTable.Cell>
        <IndexTable.Cell>
          {preview && (
            <Link
              onClick={() => {
                window.open(preview, "_blank");
              }}
            >
              <Icon source={FileFilledMinor} color="base" />
            </Link>
          )}
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  const promotedBulkActions = [
    {
      content: "Delete",
      onAction: () => {
        handleDelete();
      },
    },
  ];

  return (
    uploadedFilesList && (
      <LegacyCard>
        <IndexTable
          resourceName={resourceName}
          itemCount={uploadedFilesList.length}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: "Topic" },
            { title: "Type" },
            { title: "Preview" },
          ]}
          promotedBulkActions={promotedBulkActions}
        >
          {rowMarkup}
        </IndexTable>
      </LegacyCard>
    )
  );
}

export function KBActions({
  handleDropZoneDrop,
  isUploading,
  uploadedFiles,
  fileUpload,
  inputText,
  inputTextTopic,
  setInputText,
  setInputTextTopic,
  setFiles,
  actionData,
  files,
  setIsUploading,
}) {
  const [activeContent, setActiveContent] = useState(null);
  const handleSubmit = async () => {
    setIsUploading(true);
    const domains = actionData.primaryDomain.host;
    if (files.length > 0) {
      for (const file of files) {
        const formData = new FormData();
        formData.append(`file`, file);
        await axios.post(
          `https://backend-rvm4xlf6ba-ey.a.run.app/update-embeddings-pdf/?store_name=${domains}`,
          formData
        );
      }
    }
    if (inputText.length > 0) {
      await axios.post(
        `https://backend-rvm4xlf6ba-ey.a.run.app/update-embeddings-text/?store-name=${domains}`,
        {
          question: inputTextTopic,
          answer: inputText,
        }
      );
    }
    setFiles([]);
    setInputText("");
    setInputTextTopic("");
    setIsUploading(false);
  };
  const createQAContent = (
    <KbFileUpload
      handleDropZoneDrop={handleDropZoneDrop}
      isUploading={isUploading}
      uploadedFiles={uploadedFiles}
      fileUpload={fileUpload}
      handleSubmit={handleSubmit}
    />
  );
  const CreateFileUploadContent = (
    <QAForm
      inputText={inputText}
      inputTextTopic={inputTextTopic}
      setInputText={setInputText}
      setInputTextTopic={setInputTextTopic}
      handleSubmit={handleSubmit}
    />
  );

  return (
    <>
      {activeContent && (
        <Modal
          title="KB Definition"
          open={!!activeContent}
          onClose={() => setActiveContent(null)}
        >
          <Modal.Section>{activeContent}</Modal.Section>
        </Modal>
      )}
      <PageActions
        secondaryActions={[
          {
            content: "Create QA",
            onAction: () => setActiveContent(createQAContent),
          },
          {
            content: "Upload File",
            onAction: () => setActiveContent(CreateFileUploadContent),
          },
        ]}
      />
    </>
  );
}
