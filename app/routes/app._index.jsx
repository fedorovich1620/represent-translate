import { useState } from "react";
import { json } from "@remix-run/node";
import axios from "axios";
import { useActionData, useNavigation, useSubmit, useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

const BACKEND_URL = 'http://localhost:8050'

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  return json({
    admin: admin,
  });
};

export default function Index() {
  const [file, setFile] = useState(null);
  const shopify = useAppBridge();

  const fileUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('csvFile', file);
      const response = axios.post(BACKEND_URL + "/api/v1/translate/shopify", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('send CSV response:', response.data);
    } catch (error) {
      console.error('send CSV error:', error);
    }
  }

  return (
    <Page>
      <TitleBar title="Represent Translate">
      </TitleBar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Please upload a csv file for translation
                  </Text>
                </BlockStack>
                <InlineStack gap="300">
                  <input type="file" onChange={(e) => setFile(e.target.files[0])} />

                </InlineStack>
                <InlineStack gap="300">

                  <Button onClick={fileUpload}>
                    Upload
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
