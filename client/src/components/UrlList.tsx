import React, { useEffect, useState } from "react";
import { Table, Tag, Space, Tooltip, message } from "antd";
import axios from "axios";
import { ColumnsType } from "antd/es/table";
import { CopyOutlined, LinkOutlined } from "@ant-design/icons";

interface ShortUrl {
  id: number;
  short_code: string;
  full_url: string;
  click_count: number;
  created_at: string;
  expires_at: string;
}


interface ShortUrlListProps {
  active: boolean;
}

const ShortUrlList: React.FC<ShortUrlListProps> = ({ active }) => {
  const [data, setData] = useState<ShortUrl[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchShortUrls = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "v1/symph/url/shorts"
        );
        setData(response.data.docs);
      } catch (error) {
        message.error("Failed to fetch short URLs.");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchShortUrls();
  }, [active]);

  const columns: ColumnsType<ShortUrl> = [
    {
      title: "Short Code",
      dataIndex: "short_code",
      key: "short_code",
      width: 150,
      render: (code: string) => (
        <Space>
          <a
            href={`${import.meta.env.VITE_API_URL}${code}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {code}
          </a>
          <Tooltip title="Copy to clipboard">
            <CopyOutlined
              onClick={() => {
                navigator.clipboard.writeText(
                  `${import.meta.env.VITE_API_URL}${code}`
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
                  `${import.meta.env.VITE_API_URL}${code}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
              style={{ cursor: "pointer" }}
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: "Full URL",
      dataIndex: "full_url",
      key: "full_url",
      width: 300,
      render: (url: string) => (
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      ),
    },
    {
      title: "Clicks",
      dataIndex: "click_count",
      key: "click_count",
      width: 100,
      align: "center",
    },
    {
      title: "Expires At",
      dataIndex: "expires_at",
      key: "expires_at",
      width: 200,
      render: (date: string) => {
        const isExpired = new Date(date) < new Date();
        return (
          <Tag color={isExpired ? "red" : "green"}>
            {new Date(date).toLocaleString()}
          </Tag>
        );
      },
    },
  ];

  return (
    <div style={{ overflowX: "auto" }}>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default ShortUrlList;
