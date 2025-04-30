import {
  Form,
  Input,
  Collapse,
  Select,
  Row,
  Col,
  Button,
  Typography,
  Tooltip,
  message,
} from "antd";
import {
  SettingOutlined,
  LinkOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { CreateUrlFormValues, CreateShortUrlPayload } from "../types/api";
import {createShortUrl} from "../utils/api"
import {notify} from  "../utils/notification"
import { useEffect, useState } from "react";

const { Panel } = Collapse;
const { Option } = Select;
const { Text } = Typography;

const CreateURL = () => {
  const [form] = Form.useForm();

  const [shortCode, setShortCode] = useState<string | null>(null);

  const onFinish = async (values: CreateUrlFormValues) => {
    try {
      const {
        url,
        expiry,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content,
      } = values;

      // Handle expiry conversion
      let expires_at;
      if (!expiry || expiry === "1minute") {
        expires_at = new Date(Date.now() + 1 * 60 * 1000); // default 1 minute
      } else {
        const now = new Date();
        switch (expiry) {
          case "1day":
            expires_at = new Date(now.setDate(now.getDate() + 1));
            break;
          case "7days":
            expires_at = new Date(now.setDate(now.getDate() + 7));
            break;
          case "30days":
            expires_at = new Date(now.setDate(now.getDate() + 30));
            break;
          default:
            expires_at = new Date(Date.now() + 1 * 60 * 1000);
        }
      }

      const payload: CreateShortUrlPayload = {
        full_url: url,
        expires_at,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content,
      };

      const res = await createShortUrl(payload);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
     if (res?.status > 400) {
       notify({
         type: "warning",
         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
         //@ts-expect-error
         message: res?.data?.message,
       });
     } else {
       notify({
         type: "success",
         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
         //@ts-expect-error
         message: res?.data?.message,
       });
       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
       //@ts-expect-error
       setShortCode(res?.data?.data?.short_code);
     }

     console.log("✅ Short URL:", res.data);
    //  form.resetFields();
    } catch (err) {
       notify({
         type: "error",
         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
         //@ts-expect-error
         message: err?.response?.data?.message,
       });
    }
  };

  useEffect(() => {
    if(shortCode){
        setTimeout(()=>{
            setShortCode(null)
        },5000)
    }
  }, [shortCode]);

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item
        label="URL to shorten"
        name="url"
        rules={[
          { required: true, message: "Please input a URL!" },
          {
            type: "url",
            message: "Please enter a valid URL (must start with http or https)",
          },
        ]}
      >
        <Input placeholder="https://example.com/your-long-url-goes-here" />
      </Form.Item>

      {shortCode && (
        <Form.Item label="Generated Short URL">
          <Input
            value={`${import.meta.env.VITE_API_URL}${shortCode}`}
            readOnly
            addonAfter={
              <div style={{ display: "flex", gap: 8 }}>
                <Tooltip title="Copy to clipboard">
                  <CopyOutlined
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${import.meta.env.VITE_API_URL}${shortCode}`
                      );
                      message.success("Short URL copied to clipboard!");
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </Tooltip>
                <Tooltip title="Open in new tab">
                  <LinkOutlined
                    onClick={() => {
                      window.open(
                        `${import.meta.env.VITE_API_URL}${shortCode}`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </Tooltip>
              </div>
            }
          />
        </Form.Item>
      )}

      <Collapse ghost>
        <Panel header="Advanced Options" key="1" extra={<SettingOutlined />}>
          <Form.Item label="Expires after (optional)" name="expiry">
            <Select defaultValue="1minute">
              <Option value="1minute">1 Minute</Option>
              <Option value="1day">1 day</Option>
              <Option value="7days">7 days</Option>
              <Option value="30days">30 days</Option>
            </Select>
          </Form.Item>

          <Text strong>UTM Parameters (optional)</Text>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="UTM Source" name="utm_source">
                <Input placeholder="e.g., google" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="UTM Medium" name="utm_medium">
                <Input placeholder="e.g., cpc" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="UTM Campaign" name="utm_campaign">
                <Input placeholder="e.g., spring_sale" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="UTM Term" name="utm_term">
                <Input placeholder="e.g., running+shoes" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="UTM Content" name="utm_content">
            <Input placeholder="e.g., banner_ad" />
          </Form.Item>
        </Panel>
      </Collapse>

      <Form.Item className="mt-4">
        <Button type="primary" icon={<LinkOutlined />} htmlType="submit" block>
          Create Short URL
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateURL;
