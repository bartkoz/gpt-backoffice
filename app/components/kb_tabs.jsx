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
  IndexTable,
  LegacyCard,
  useIndexResourceState,
  Badge, Icon, Link,
} from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  AttachmentMajor, FileFilledMinor
} from '@shopify/polaris-icons';

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
      const response = await axios.get(
        `http://localhost:8000/kb/${shop}`
      );
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
    (
      { id, topic, type, preview },
      index
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>{topic}</IndexTable.Cell>
        <IndexTable.Cell>{type}</IndexTable.Cell>
        <IndexTable.Cell>{preview && <Link onClick={()=>window.open(preview, '_blank')}><Icon
          source={FileFilledMinor}
          color="base"
        /></Link>}</IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  const promotedBulkActions = [
    {
      content: "Delete",
      onAction: () => {console.log("Todo: delete"); console.log(selectedResources)},
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
