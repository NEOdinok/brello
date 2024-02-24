import cn from "clsx";
import { useUnit } from "effector-react";
import { FC, FormEvent } from "react";

import { LayoutBase } from "@/layouts/base";

import { noop } from "@/shared/lib/noop";
import { Button, Input, Textarea } from "@/shared/ui";
import { ImageUpload } from "@/shared/ui/image-upload";

import { $imageSrc, $workspaceName, fileSelected } from "./model";
import styles from "./styles.module.css";

const LogoUpload: FC = () => {
  const [imageSrc, placeholder] = useUnit([$imageSrc, $workspaceName]);
  const [onSelectFile] = useUnit([fileSelected]);
  const handleSelectFile = ({ file }: { file: File }) => {
    onSelectFile(file);
  };

  return (
    <div className={styles.formField}>
      <label className={styles.label} htmlFor="logo">
        <span className={styles.labelText}>Logo</span>
        <span className={styles.labelHint}>Update your logo.</span>
      </label>
      <div className={styles.fieldsGroup}>
        <ImageUpload.Root className={styles.field}>
          <ImageUpload.Preview src={imageSrc} placeholder={placeholder} />
          <ImageUpload.Upload label="logo" onSelectFile={handleSelectFile} />
        </ImageUpload.Root>
      </div>
    </div>
  );
};

export const WorkspacesSettingsPage = () => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <LayoutBase>
      <section className={styles.section}>
        <h1 className={styles.title}>Workspace Settings</h1>
        <div className={cn(styles.divider, styles.mainDivider)} />
        <form className={styles.form} onSubmit={handleSubmit}>
          <LogoUpload />
          <div className={styles.divider} />
          <div className={styles.formField}>
            <label className={styles.label} htmlFor="name">
              <span className={styles.labelText}>Name</span>
              <span className={styles.labelHint}>This will be displayed on your profile.</span>
            </label>
            <div className={styles.fieldsGroup}>
              <Input
                className={styles.field}
                id="name"
                onValue={noop}
                name="name"
                value={""}
                placeholder="Your Company Co."
              />
              <Input
                className={styles.field}
                id="slug"
                onValue={noop}
                name="slug"
                value={""}
                placeholder="your-company-co"
              />
            </div>
          </div>
          <div className={styles.divider} />
          <div className={styles.formField}>
            <label className={styles.label} htmlFor="description">
              <span className={styles.labelText}>Description</span>
              <span className={styles.labelHint}>A quick snapshot of your workspace.</span>
            </label>
            <Textarea
              className={styles.field}
              onValue={noop}
              name="description"
              value={""}
              placeholder="Our team organizes everything here."
            />
          </div>
          <div className={styles.divider} />
          <div className={styles.actions}>
            <Button size="md" variant="secondary-gray">
              Cancel
            </Button>
            <Button type="submit" size="md">
              Save
            </Button>
          </div>
        </form>
      </section>
    </LayoutBase>
  );
};
