import React, { useState } from "react";
import { Tabs, Typography, Layout } from "antd";
import reactLogo from "../assets/react.svg";
import CreateURL from "../components/CreateURL";
import ShortUrlList from "../components/UrlList";

const { Title, Text } = Typography;
const { Content, Footer } = Layout;

export const MainPage = () => {
  const [activeTab, setActiveTab] = useState("1");

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f6f9fc" }}>
      <Content className="flex flex-col items-center justify-center px-4 pt-10">
        <div className="flex items-center space-x-2 mb-2">
          <img src={reactLogo} alt="React logo" className="w-10 h-10" />
          <Title level={3} style={{ marginBottom: 0 }}>
            LinkShort
          </Title>
        </div>
        <Text type="secondary" className="text-center max-w-xl">
          Create shorter links that redirect to your original URL. Customize
          your short links with expiration dates and UTM parameters.
        </Text>

        <div className="bg-white shadow-md rounded-md p-6 mt-6 w-full max-w-3xl">
          <Tabs activeKey={activeTab} onChange={handleTabChange}>
            <Tabs.TabPane tab="Create URL" key="1">
              <CreateURL />
            </Tabs.TabPane>
            <Tabs.TabPane tab="My URLs" key="2">
              <ShortUrlList active={activeTab === "2"} />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </Content>

      <Footer style={{ textAlign: "center", backgroundColor: "#f6f9fc" }}>
        <Text type="secondary">
          © 2025 Symph LinkShort. All rights reserved.
        </Text>
      </Footer>
    </Layout>
  );
};

export default MainPage;
