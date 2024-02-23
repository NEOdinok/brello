import cn from "clsx";
import prettyBytes from "pretty-bytes";
import type { ChangeEvent, DragEvent, FC, ReactNode } from "react";
import { useState } from "react";

import {
  IconFile04,
  IconFilm02,
  IconImage01,
  IconTrash01,
  IconUploadCloud02,
} from "@/shared/assets/icons";
import { Button, FeaturedIcon, GhostButton, visuallyHiddenStyles } from "@/shared/ui";

import styles from "./styles.module.css";

interface RootProps {
  className?: string;
  children: ReactNode;
}

interface DropZoneProps {
  className?: string;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  supportingText: string;
  onSelectFiles: ({ files }: { files: FileList | null }) => void;
}

export interface UploadFile {
  id: string;
  name: string;
  type: string;
  size: number;
  progress: number;
}

interface QueueProps {
  className?: string;
  files: UploadFile[];
  onRemove: (id: string) => void;
}

const fileTypeIcons = {
  document: IconFile04,
  image: IconImage01,
  video: IconFilm02,
  misc: IconUploadCloud02,
};

type FileType = "video" | "image" | "document" | "misc";

const mimeTypes: Record<string, FileType> = {
  image: "image",
  video: "video",
  application: "document",
  default: "misc",
};

const FileUploadIcon: FC<{
  className?: string;
  fileType?: FileType;
}> = ({ className, fileType = "document" }) => {
  const icon = fileTypeIcons[fileType];

  return <FeaturedIcon className={className} theme="light-circle-outline" Icon={icon} />;
};

const CompletedIcon: FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <rect width="15" height="15" x=".5" y=".5" fill="currentColor" rx="7.5" />
      <path
        stroke="#ffffff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.667"
        d="M11.333 5.5 6.75 10.083 4.667 8"
      />
      <rect width="15" height="15" x=".5" y=".5" stroke="currentColor" rx="7.5" />
    </svg>
  );
};

const ProgressBar: FC<{
  value: number;
}> = ({ value }) => {
  return (
    <div className={styles.progressBar}>
      <progress className={styles.progress} value={value} max="100" />
      {value}%
    </div>
  );
};

const Queue: FC<QueueProps> = ({ className, files, onRemove }) => {
  if (files.length === 0) return;

  return (
    <ul className={cn(styles.queue, className)}>
      {files.map(({ id, name, type, size, progress }) => {
        const formattedSize = prettyBytes(size);
        const fileType = mimeTypes[type.split("/")[0]] || mimeTypes.default;
        const isUploadCompleted = progress === 100;
        const handleRemove = () => {
          onRemove(id);
        };

        return (
          <li
            key={id}
            className={cn(styles.item, {
              [styles.completed]: isUploadCompleted,
            })}
          >
            <FileUploadIcon fileType={fileType} className={styles.fileUploadIcon} />
            <div className={styles.itemInfo}>
              <p className={styles.fileName}>{name}</p>
              <p className={styles.fileSize}>{formattedSize}</p>
              <ProgressBar value={progress} />
              {isUploadCompleted ? (
                <CompletedIcon className={cn(styles.statusIcon, styles.statusCompleted)} />
              ) : (
                <Button
                  size="sm"
                  variant="tertiary-gray"
                  className={styles.statusButton}
                  iconOnly
                  onClick={handleRemove}
                >
                  <IconTrash01 />
                </Button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const Root: FC<RootProps> = ({ className, children }) => {
  return <div className={cn(styles.root, className)}>{children}</div>;
};

const UploadZone: FC<DropZoneProps> = ({
  className,
  supportingText,
  onSelectFiles,
  disabled = false,
  multiple = false,
  accept = "image/*",
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSelectFiles({ files: event.currentTarget.files });
  };

  const handleDragEnter = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer?.files?.length) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = () => {
    setIsDragging(false);
  };

  return (
    <GhostButton
      className={cn(styles.base, {
        [styles.draggable]: isDragging,
        [styles.disabled]: disabled,
        className,
      })}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        className={visuallyHiddenStyles}
        type="file"
        multiple={multiple}
        onChange={handleChange}
        accept={accept}
        disabled={disabled}
      />
      <FeaturedIcon color="gray" Icon={IconUploadCloud02} />
      <p className={styles.text}>
        <span
          className={cn(styles.actionText, {
            [styles.disabled]: disabled,
          })}
        >
          Click to upload
        </span>{" "}
        or drag and drop
      </p>
      <p className={styles.supportingText}>{supportingText}</p>
    </GhostButton>
  );
};

export const FileUpload = {
  Root,
  UploadZone,
  Queue,
};
