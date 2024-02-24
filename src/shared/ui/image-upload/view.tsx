import cn from "clsx";
import { type ChangeEvent, FC, ReactNode, useRef } from "react";

import { Avatar, Button, visuallyHiddenStyles } from "@/shared/ui";

import styles from "./styles.module.css";

const Root: FC<{ className?: string; children: ReactNode }> = ({ className, children }) => {
  return <div className={cn(styles.root, className)}>{children}</div>;
};

const Preview: FC<{
  className?: string;
  src?: string | null;
  placeholder?: string;
}> = ({ className, src = null, placeholder }) => {
  return <Avatar className={className} size="2xl" src={src} text={placeholder} />;
};

const Upload: FC<{
  className?: string;
  src?: string;
  accept?: string;
  isDisabled?: boolean;
  label?: string;
  text?: string;
  supportingText?: string;
  buttonText?: string;
  onSelectFile: ({ file }: { file: File }) => void;
}> = ({
  className,
  onSelectFile,
  accept = "image/*",
  isDisabled = false,
  label,
  text = "Upload image",
  supportingText = "SVG, PNG, JPG or GIF (max. 500×500px)",
  buttonText = "Upload",
}) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? []);

    if (files.length === 0) {
      return;
    }

    const file = files[0];

    onSelectFile({ file });
  };

  const handleClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  return (
    <div className={cn(styles.wrapper, className)}>
      <div>
        <p className={styles.text}>{text}</p>
        <p className={styles.supportingText}>{supportingText}</p>
      </div>
      <input
        id={label}
        ref={inputFileRef}
        className={visuallyHiddenStyles}
        type="file"
        onChange={handleChange}
        multiple={false}
        accept={accept}
        disabled={isDisabled}
      />
      <Button
        type="button"
        variant="secondary-gray"
        size="md"
        onClick={handleClick}
        disabled={isDisabled}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export const ImageUpload = {
  Root,
  Preview,
  Upload,
};
