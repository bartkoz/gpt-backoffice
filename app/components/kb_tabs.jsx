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
  Text,
  Thumbnail,
  EmptySearchResult,
  Frame,
  TextContainer,
} from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  ContentMinor,
  FileFilledMinor,
  NoteMinor,
} from "@shopify/polaris-icons";

export function QAForm({ actionData, setActiveContent, toggleActive }) {
  const [inputText, setInputText] = useState("");
  const [inputTextTopic, setInputTextTopic] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async () => {
    setIsUploading(true);
    const domains = actionData.host;
    if (inputText.length > 0) {
      await axios.post(
        `https://backend-rvm4xlf6ba-ey.a.run.app/update-embeddings-text/?store_name=${domains}`,
        {
          question: inputTextTopic,
          answer: inputText,
        }
      );
    }
    setInputText("");
    setInputTextTopic("");
    setIsUploading(false);
    setActiveContent(null);
    toggleActive();
  };

  return (
    <>
      <Layout.Section>
        In the "Topic" field, specify the main subject or inquiry you're
        exploring, and in the "Answer" field, provide specific details or
        context that best describes the topic or directly answers the initial
        question. This structured information will aid the bot in generating
        more accurate and detailed responses.
      </Layout.Section>
      <Layout.Section>
        <FormLayout>
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
            <TextField
              multiline={3}
              placeholder={"Answer"}
              value={inputText}
              onChange={(newValue) => setInputText(newValue)}
            />
          </FormLayout.Group>
          <FormLayout.Group>
            <Button
              primarySuccess
              onClick={handleSubmit}
              disabled={isUploading}
            >
              Save
            </Button>
          </FormLayout.Group>
        </FormLayout>
      </Layout.Section>
    </>
  );
}

export function KbFileUpload({ actionData, setActiveContent, toggleActive }) {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState("");

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
    const domains = actionData.host;
    if (files.length > 0) {
      for (const file of files) {
        const formData = new FormData();
        formData.append(`file`, file);
        await axios.post(
          `https://backend-rvm4xlf6ba-ey.a.run.app/?store_name=${domains}&topic=${title}`,
          formData
        );
      }
    }
    setFiles([]);
    setIsUploading(false);
    setActiveContent(null);
    toggleActive();
  };

  return (
    <>
      <Layout.Section>
        Upload your PDF files here; their text will be extracted and used to
        enhance the bot’s ability to provide accurate and informative answers.
        Ensure the PDFs are text-readable to ensure accurate information
        extraction.
      </Layout.Section>
      <Layout.Section>
        <TextField
          label="Descriptive title"
          value={title}
          onChange={(newValue) => setTitle(newValue)}
          autoComplete="off"
          requiredIndicator={true}
        />
      </Layout.Section>
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

export function KBFilesList({ shop, activeContent, wip, actionData }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [preview, setPreview] = useState(null);
  const getKBFiles = async () => {
    const response = await axios.get(
      `https://backend-rvm4xlf6ba-ey.a.run.app/kb/${shop}`
    );
    setUploadedFilesList(response.data);
  };
  const handleDelete = async () => {
    setIsDeleting(true);
    const promises = selectedResources.map(async (element) => {
      await axios.post(
        `https://backend-rvm4xlf6ba-ey.a.run.app/kb/delete/${shop}?uid=${element}`
      );
      return Promise.resolve();
    });

    await Promise.all(promises).then(() => {
      setIsDeleting((prevShouldReload) => !prevShouldReload);
      clearSelection();
    });
  };

  useEffect(() => {
    getKBFiles();
  }, [activeContent, wip, isDeleting]);
  const [uploadedFilesList, setUploadedFilesList] = useState([]);
  const resourceName = {
    singular: "Data",
    plural: "Data",
  };

  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
    clearSelection,
  } = useIndexResourceState(uploadedFilesList);

  const rowMarkup = uploadedFilesList.map(
    ({ id, topic, answer, type, preview }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          {topic
            ? topic.length > 50
              ? `${topic.slice(0, 50)}...`
              : topic
            : ""}
        </IndexTable.Cell>
        <IndexTable.Cell>
          {answer
            ? answer.length > 50
              ? `${answer.slice(0, 50)}...`
              : answer
            : ""}
        </IndexTable.Cell>
        <IndexTable.Cell>{type}</IndexTable.Cell>
        <IndexTable.Cell>
          {preview ? (
            <Link
              onClick={(e) => {
                setPreview({ topic, answer });
                e.stopPropagation();
                window.open(preview, "_blank");
              }}
            >
              <Icon source={FileFilledMinor} color="base" />
            </Link>
          ) : (
            <Link
              onClick={(e) => {
                setPreview({ topic, answer, id });
                e.stopPropagation();
                setActive(true);
              }}
            >
              <Icon source={ContentMinor} color="base" />
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
      disabled: isDeleting,
    },
  ];

  const emptyStateMarkup = (
    <EmptySearchResult
      title={"No KB entries yet"}
      description={"Try adding some FAQs and uploading pdfs."}
      withIllustration
    />
  );
  const [active, setActive] = useState(false);
  const handleChange = useCallback(() => setActive(!active), [active]);
  const selectedFilesMarkup = () => {
    return (
      <div style={{ marginBottom: "10px" }}>
        {preview && (
          <>
            <Text as={"strong"}>{preview.topic}</Text>
            <Text>{preview.answer}</Text>
          </>
        )}
      </div>
    );
  };
  const [isEditing, setIsEditing] = useState(false);
  return (
    <Frame>
      {uploadedFilesList && uploadedFilesList.length > 0 ? (
        <LegacyCard>
          <IndexTable
            resourceName={resourceName}
            itemCount={uploadedFilesList.length}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
            emptyState={emptyStateMarkup}
            onSelectionChange={handleSelectionChange}
            headings={[
              { title: "Topic" },
              { title: "Content" },
              { title: "Type" },
              { title: "Preview" },
            ]}
            promotedBulkActions={promotedBulkActions}
          >
            {rowMarkup}
          </IndexTable>
        </LegacyCard>
      ) : null}
      <Modal
        open={active}
        onClose={handleChange}
        title="Preview"
        primaryAction={
          !isEditing
            ? {
                content: "Edit",
                onAction: () => {
                  setIsEditing(true);
                },
              }
            : null
        }
        secondaryActions={
          isEditing
            ? [
                {
                  content: "Back",
                  onAction: () => {
                    setIsEditing(false);
                  },
                },
              ]
            : []
        }
      >
        {" "}
        <Modal.Section>
          {isEditing && (
            <QAEdit
              setPreview={setPreview}
              setIsEditing={setIsEditing}
              actionData={actionData}
              initialAnswer={preview.answer}
              initialTopic={preview.topic}
              uid={preview.id}
              getKBFiles={getKBFiles}
            />
          )}
          {!isEditing && <TextContainer>{selectedFilesMarkup()}</TextContainer>}
        </Modal.Section>
      </Modal>
    </Frame>
  );
}

export function QAEdit({
  actionData,
  initialAnswer,
  initialTopic,
  setPreview,
  setIsEditing,
  uid,
  getKBFiles,
}) {
  const [inputText, setInputText] = useState(
    initialAnswer ? initialAnswer : ""
  );
  const [inputTextTopic, setInputTextTopic] = useState(
    initialTopic ? initialTopic : ""
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async () => {
    setIsUploading(true);
    const domains = actionData.host;
    await axios.post(
      `https://backend-rvm4xlf6ba-ey.a.run.app/kb/delete/${domains}?uid=${uid}`
    );
    if (inputText.length > 0) {
      await axios
        .post(
          `https://backend-rvm4xlf6ba-ey.a.run.app/update-embeddings-text/?store_name=${domains}`,
          {
            question: inputTextTopic,
            answer: inputText,
          }
        )
        .then((resp) => {
          setPreview(resp.data);
          getKBFiles();
        });
    }
    setInputText("");
    setInputTextTopic("");
    setIsUploading(false);
    setIsEditing(false);
  };

  return (
    <>
      <Layout.Section>
        In the "Topic" field, specify the main subject or inquiry you're
        exploring, and in the "Answer" field, provide specific details or
        context that best describes the topic or directly answers the initial
        question. This structured information will aid the bot in generating
        more accurate and detailed responses.
      </Layout.Section>
      <Layout.Section>
        <FormLayout>
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
            <TextField
              multiline={3}
              placeholder={"Answer"}
              value={inputText}
              onChange={(newValue) => setInputText(newValue)}
            />
          </FormLayout.Group>
          <FormLayout.Group>
            <Button
              primarySuccess
              onClick={handleSubmit}
              disabled={isUploading}
            >
              Save
            </Button>
          </FormLayout.Group>
        </FormLayout>
      </Layout.Section>
    </>
  );
}

export function KBActions({
  actionData,
  activeContent,
  setActiveContent,
  wip,
  setWip,
  toggleActive,
}) {
  const CreateFileUploadContent = (
    <KbFileUpload
      actionData={actionData}
      setActiveContent={setActiveContent}
      toggleActive={toggleActive}
    />
  );
  const createQAContent = (
    <QAForm
      actionData={actionData}
      setActiveContent={setActiveContent}
      toggleActive={toggleActive}
    />
  );

  function stripHtmlTags(input) {
    const tempDivElement = document.createElement("div");
    tempDivElement.innerHTML = input;
    return tempDivElement.textContent || tempDivElement.innerText || "";
  }

  const handleImportPolicies = async ({ setWip }) => {
    setWip(true);

    await axios.post(
      `https://backend-rvm4xlf6ba-ey.a.run.app/delete-existing-policies/?store_name=${actionData.host}`,
      {}
    );

    const promises = actionData.shopPolicies.map((e) => {
      if (e["body"].trim() !== "") {
        return axios.post(
          `https://backend-rvm4xlf6ba-ey.a.run.app/update-embeddings-text/?store_name=${actionData.host}`,
          {
            question: e["type"].replace(/_/g, " ").toLowerCase(),
            answer: stripHtmlTags(e["body"]),
          }
        );
      }
      return Promise.resolve();
    });
    await Promise.all(promises).then(() => {
      setWip(false);
    });
  };

  return (
    <>
      {activeContent && (
        <Frame>
          <Modal
            title="Create entry"
            open={!!activeContent}
            onClose={() => setActiveContent(null)}
          >
            <Modal.Section>{activeContent}</Modal.Section>
          </Modal>
        </Frame>
      )}
      <PageActions
        secondaryActions={[
          {
            content: "Create FAQ",
            onAction: () => setActiveContent(createQAContent),
          },
          {
            content: "Upload file",
            onAction: () => setActiveContent(CreateFileUploadContent),
          },
          {
            content: "Import policies",
            onAction: () => {
              handleImportPolicies({ setWip }).then(toggleActive);
            },
            disabled: wip,
            loading: wip,
          },
        ]}
      />
    </>
  );
}
