import {
  Button,
  Layout,
  Page,
  DropZone,
  LegacyStack,
  Thumbnail,
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { NoteMinor } from "@shopify/polaris-icons";
import { KBActions, KBFilesList } from "~/components/kb_tabs";
import { authenticate } from "~/shopify.server";
import { useActionData, useSubmit } from "@remix-run/react";

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

  return (
    <Page>
      <Layout>
        <ui-title-bar title="Knowledge base" />
        <Layout.Section>
          <KBActions
            inputText={inputText}
            inputTextTopic={inputTextTopic}
            setInputText={setInputText}
            setInputTextTopic={setInputTextTopic}
            handleDropZoneDrop={handleDropZoneDrop}
            uploadedFiles={uploadedFiles}
            fileUpload={fileUpload}
            setFiles={setFiles}
            actionData={actionData}
            files={files}
            setIsUploading={setIsUploading}
          />
        </Layout.Section>
        <Layout.Section>
          {actionData && (
            <KBFilesList
              isUploading={isUploading}
              isDeleting={isDeleting}
              setIsDeleting={setIsDeleting}
              shop={actionData.primaryDomain.host}
            />
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
