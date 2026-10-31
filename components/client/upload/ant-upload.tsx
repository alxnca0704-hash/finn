"use client";

import * as React from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { message, Upload } from "antd";
import { Camera } from "lucide-react";

import { FinnAntProvider } from "@/components/client/antd/finn-provider";
import { Button } from "@/components/client/ui/button";
import { MAX_PROFILE_PHOTO_BYTES } from "@/constants/profile";
import { cn } from "@/lib/utils";

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
    <FinnAntProvider>
      {contextHolder}
      <Upload {...props} className={className}>
        <Button type="button" variant="outline">
          <UploadOutlined />
          Click to Upload
        </Button>
      </Upload>
    </FinnAntProvider>
  );
}

function ProfilePhotoUpload({
  onFileSelected,
}: {
  onFileSelected?: (file: File) => void
}) {
  const [messageApi, contextHolder] = message.useMessage();
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const previewUrlRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const props: UploadProps = {
    accept: "image/*",
    showUploadList: false,
    beforeUpload: (file) => {
      if (!file.type.startsWith("image/")) {
        messageApi.error("Choose an image file.");
        return Upload.LIST_IGNORE;
      }

      if (file.size > MAX_PROFILE_PHOTO_BYTES) {
        messageApi.error(
          `Keep your photo under ${MAX_PROFILE_PHOTO_BYTES / (1024 * 1024)} MB.`
        );
        return Upload.LIST_IGNORE;
      }

      onFileSelected?.(file)

      const nextUrl = URL.createObjectURL(file);

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }

      previewUrlRef.current = nextUrl;
      setPreviewUrl(nextUrl);

      return false;
    },
  };

  return (
    <FinnAntProvider>
      {contextHolder}
      <Upload {...props}>
        <Button
          type="button"
          variant="outline"
          aria-label={previewUrl ? "Change profile photo" : "Add profile photo"}
          className={cn(
            "relative size-20 shrink-0 overflow-hidden rounded-full border-border-default bg-bg-surface p-0 hover:bg-bg-raised sm:size-24",
            previewUrl && "bg-cover bg-center"
          )}
          style={
            previewUrl ? { backgroundImage: `url(${previewUrl})` } : undefined
          }
        >
          {!previewUrl && <Camera className="size-5 text-muted-foreground" />}
        </Button>
      </Upload>
    </FinnAntProvider>
  );
}

export { AntUpload, ProfilePhotoUpload };
