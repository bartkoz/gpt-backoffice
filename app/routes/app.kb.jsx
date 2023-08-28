import {
  Button,
  Layout,
  Page,
  Card,
  Grid,
  Modal
} from "@shopify/polaris";
import {DropZone, LegacyStack, Thumbnail, Text} from '@shopify/polaris';
import {useState, useCallback, useEffect} from 'react';
import {NoteMinor} from '@shopify/polaris-icons';
import axios from "axios";

export default function KBUpload() {
  const [files, setFiles] = useState([]);
  const [uploadedFilesList, setUploadedFilesList] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const getKBFiles = async () => {
    try {
      const response = await axios.get('http://localhost:8000/kb/test');
      setUploadedFilesList(response.data)
    } catch (error) {
      console.error("Failed to fetch kb data:", error);
    }
  };

  useEffect(() => {
    getKBFiles();
  }, [])

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) => {
      const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
      setFiles((files) => [...files, ...pdfFiles]);
    },
    [],
  );


  const validImageTypes = ['application/pdf'];

  const fileUpload = !files.length && (
    <DropZone.FileUpload actionHint="Accepts .pdf" />
  );

  const handleSubmit = async () => {
    setIsUploading(true)
    setShowModal(true)
    for (const file of files) {
      const formData = new FormData();
      formData.append(`file`, file);
      try {
        const response = await axios.post('http://localhost:8000/update-embeddings-pdf/test', formData,);

        console.log('Files uploaded successfully:', response.data);

      } catch (error) {
        console.error('Error while uploading files:', error.response?.data || error.message);
      }
    }
    setFiles([])
    setShowModal(false)
    setIsUploading(false)
    getKBFiles()
  };

  const handleDelete = async () => {
    console.log('delete')
  }

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
          <div style={{ textAlign: "center" }}>
            {file.name}{' '}
          </div>
        </LegacyStack>
      ))}
    </Layout.Section>
  );

  const KBFilesList = (
  uploadedFilesList.map((file, index) => (
    <Card key={index}>
      <Grid>
        <Grid.Cell columnSpan={{xs: 11, sm: 11, md: 11, lg: 11, xl: 11}}>
          <Card>
            <Text as="h2" variant="bodyMd">
              {file}
            </Text>
          </Card>
        </Grid.Cell>
        <Grid.Cell columnSpan={{xs: 1, sm: 1, md: 1, lg: 1, xl: 1}} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button destructive={true} onClick={handleDelete}>Delete</Button>
        </Grid.Cell>
      </Grid>
    </Card>
  )));
  // const [active, setActive] = useState(true);
  const handleChange = useCallback(() => setShowModal(!showModal), [showModal]);
  const uploadModal = (
      <Modal
        title="Uplading in progress."
        open={showModal}
        onClose={handleChange}
      >
        <Modal.Section>
          <Text>
            <p>
              We are uploading your files, please wait...
            </p>
          </Text>
        </Modal.Section>
      </Modal>
  );
  return (
    <Page>
      {uploadModal}
      <Layout>
        <ui-title-bar title="Knowledge base" />
        <Layout.Section>
        </Layout.Section>
        <Layout.Section>
        </Layout.Section>
      <Layout.Section>
          <Button primarySuccess={true} disabled={isUploading} onClick={handleSubmit}>Save</Button>
      </Layout.Section>
        <Layout.Section>
      <DropZone onDrop={handleDropZoneDrop} disabled={isUploading}>
      {uploadedFiles}
      {fileUpload}
    </DropZone>
        </Layout.Section>
        <Layout.Section>
        {KBFilesList}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
