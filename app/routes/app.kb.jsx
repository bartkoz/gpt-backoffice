import {
  Button,
  Layout,
  Page,
  DropZone,
  LegacyStack,
  Thumbnail,
  ButtonGroup,
  LegacyCard,
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { NoteMinor } from "@shopify/polaris-icons";
import axios from "axios";
import { KBFilesList, uploadModal, KbTabs } from "~/components/kb_tabs";
import { authenticate } from "~/shopify.server";
import { useActionData, useSubmit } from "@remix-run/react";
import { convertHosts } from "~/helpers";

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(
    `#graphql
    query {
  shop {
    primaryDomain {
      url
      host
    }
    domains {
      url
      host
    }
  }
}`
  );

  const responseJson = await response.json();
  return responseJson.data.shop;
}

export default function KBUpload() {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [inputText, setInputText] = useState("");
  const [inputTextTopic, setInputTextTopic] = useState("");
  const actionData = useActionData();
  const submit = useSubmit();
  const queryGQL = () => {
    submit({}, { replace: true, method: "POST" });
  };
  useEffect(() => {
    queryGQL();
  }, []);

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

  const handleSubmit = async () => {
    setIsUploading(true);
    setShowModal(true);
    const domains = convertHosts(actionData.domains);
    if (files.length > 0) {
      for (const file of files) {
        const formData = new FormData();
        formData.append(`file`, file);
        await axios.post(
          `http://localhost:8000/update-embeddings-pdf/${domains}`,
          formData
        );
      }
    }
    if (inputText.length > 0) {
      await axios.post(
        `http://localhost:8000/update-embeddings-text/${domains}`,
        {
          text: inputText,
        }
      );
    }
    setFiles([]);
    setInputText("");
    setInputTextTopic("");
    setShowModal(false);
    setIsUploading(false);
  };

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

  const handleChange = useCallback(() => setShowModal(!showModal), [showModal]);
  return (
    <Page>
      <uploadModal showModal={showModal} handleChange={handleChange} />
      <Layout>
        <ui-title-bar title="Knowledge base" />
        <Layout.Section>
          <ButtonGroup>
            {actionData && (
              <Button
                primarySuccess={true}
                disabled={isUploading}
                onClick={handleSubmit}
              >
                Save
              </Button>
            )}
            <Button
              destructive={true}
              onClick={() => {
                setFiles([]);
                setInputText("");
                setInputTextTopic("");
              }}
            >
              Clear
            </Button>
          </ButtonGroup>
        </Layout.Section>
        <Layout.Section>
          {actionData && (
            <KbTabs
              inputText={inputText}
              inputTextTopic={inputTextTopic}
              setInputText={setInputText}
              setInputTextTopic={setInputTextTopic}
              handleDropZoneDrop={handleDropZoneDrop}
              isUploading={isUploading}
              uploadedFiles={uploadedFiles}
              fileUpload={fileUpload}
            />
          )}
        </Layout.Section>
        <Layout.Section>
          <LegacyCard title="Knowledge Base data:" sectioned>
            {actionData && (
              <KBFilesList
                isUploading={isUploading}
                isDeleting={isDeleting}
                setIsDeleting={setIsDeleting}
                shop={actionData.domains}
              />
            )}
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
