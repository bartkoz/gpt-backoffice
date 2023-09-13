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
  LegacyStack,
  Thumbnail,
} from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { FileFilledMinor, NoteMinor } from "@shopify/polaris-icons";

export function QAForm({ actionData }) {
  const [inputText, setInputText] = useState("");
  const [inputTextTopic, setInputTextTopic] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async () => {
    setIsUploading(true);
    const domains = actionData.primaryDomain.host;
    if (inputText.length > 0) {
      await axios.post(
        `https://backend-rvm4xlf6ba-ey.a.run.app/update-embeddings-text/?store-name=${domains}`,
        {
          question: inputTextTopic,
          answer: inputText,
        }
      );
    }
    setInputText("");
    setInputTextTopic("");
    setIsUploading(false);
  };

  return (
    <Layout.Section>
      <FormLayout>
        <FormLayout.Group>
          <TextField
            multiline={3}
            placeholder={"Answer"}
            value={inputText}
            onChange={(newValue) => setInputText(newValue)}
          />
        </FormLayout.Group>
        <FormLayout.Group>
          <TextField
            labelHidden
            autoComplete="off"
            multiline={3}
            placeholder={"Question"}
            value={inputTextTopic}
            onChange={(newValue) => setInputTextTopic(newValue)}
          />
        </FormLayout.Group>
        <FormLayout.Group>
          <Button primarySuccess onClick={handleSubmit} disabled={isUploading}>
            Save
          </Button>
        </FormLayout.Group>
      </FormLayout>
    </Layout.Section>
  );
}

export function KbFileUpload({ actionData }) {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) => {
      const pdfFiles = acceptedFiles.filter(
        (file) => file.type === "application/pdf"
      );
      setFiles((files) => [...files, ...pdfFiles]);
    },
    []
  );

  const validImageTypes = ["application/pdf"];

  const fileUpload = !files.length && (
    <DropZone.FileUpload actionHint="Accepts .pdf" />
  );

  const uploadedFiles = files.length > 0 && (
    <Layout.Section>
      {files.map((file, index) => (
        <LegacyStack alignment="center" key={index}>
          <Thumbnail
            size="small"
            alt={file.name}
            source={
              validImageTypes.includes(file.type)
                ? window.URL.createObjectURL(file)
                : NoteMinor
            }
          />
          <div style={{ textAlign: "center" }}>{file.name} </div>
        </LegacyStack>
      ))}
    </Layout.Section>
  );

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
    setFiles([]);
    setIsUploading(false);
  };

  return (
    <>
      <Layout.Section>
        <DropZone onDrop={handleDropZoneDrop} disabled={isUploading}>
          {uploadedFiles}
          {fileUpload}
        </DropZone>
      </Layout.Section>
      <Layout.Section>
        <Button primarySuccess onClick={handleSubmit} disabled={isUploading}>
          Save
        </Button>
      </Layout.Section>
    </>
  );
}

export function KBFilesList({ shop }) {
  const handleDelete = async () => {
    setIsDeleting(true);
    selectedResources.forEach(async function (element, index, arr) {
      await axios.post(
        `https://backend-rvm4xlf6ba-ey.a.run.app/kb/delete/${shop}?uid=${element}`
      );
    });
    setIsDeleting(false);
  };

  useEffect(() => {
    const getKBFiles = async () => {
      const response = await axios.get(
        `https://backend-rvm4xlf6ba-ey.a.run.app/kb/${shop}`
      );
      setUploadedFilesList(response.data);
    };
    getKBFiles();
  }, []);
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

export function KBActions({ actionData }) {
  const [activeContent, setActiveContent] = useState(null);
  const CreateFileUploadContent = <KbFileUpload actionData={actionData} />;
  const createQAContent = <QAForm actionData={actionData} />;

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
