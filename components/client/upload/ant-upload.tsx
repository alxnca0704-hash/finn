"use client";

import * as React from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { ConfigProvider, message, Upload } from "antd";

import { Button } from "@/components/client/ui/button";

const finnTheme = {
  token: {
    colorPrimary: "var(--accent-primary)",
    colorText: "var(--text-primary)",
    colorTextSecondary: "var(--text-muted)",
    colorBorder: "var(--border-default)",
    colorBgContainer: "var(--bg-surface)",
    colorError: "var(--state-error)",
    colorSuccess: "var(--state-success)",
    fontFamily: "var(--font-sans)",
  },
};

function AntUpload({ className }: { className?: string }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);

  const props: UploadProps = {
    name: "file",
    multiple: false,
    beforeUpload: () => false,
    fileList,
    onChange: ({ file, fileList }) => {
      setFileList(fileList);

      if (file.status === "removed") {
        messageApi.info(`${file.name} removed`);
      } else {
        messageApi.success(`${file.name} selected`);
      }
    },
  };

  return (
    <ConfigProvider theme={finnTheme}>
      {contextHolder}
      <Upload {...props} className={className}>
        <Button type="button" variant="outline">
          <UploadOutlined />
          Click to Upload
        </Button>
      </Upload>
    </ConfigProvider>
  );
}

export { AntUpload };
