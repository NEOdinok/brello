import { reflect } from "@effector/reflect";
import cn from "clsx";
import { useUnit } from "effector-react";
import { FormEvent } from "react";

import { LayoutBase } from "@/layouts/base";

import { noop } from "@/shared/lib/noop";
import { Button, Input, Textarea } from "@/shared/ui";
import { ImageUpload } from "@/shared/ui/image-upload";

import {
  $avatarUrl,
  $description,
  $error,
  $name,
  $pending,
  $slug,
  WorkspaceSettingsError,
  avatarFileSelected,
  descriptionChanged,
  formSubmitted,
  nameChanged,
  slugBlur,
  slugChanged,
} from "./model";
import styles from "./styles.module.css";

export const WorkspacesSettingsPage = () => {
  const [handleFormSubmit, pending] = useUnit([formSubmitted, $pending]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleFormSubmit();
  };

  return (
    <LayoutBase>
      <section className={styles.section}>
        <h1 className={styles.title}>Workspace Settings</h1>
        <div className={cn(styles.divider, styles.mainDivider)} />
        <form className={styles.form} onSubmit={onSubmit}>
          <AvatarUpload />
          <div className={styles.divider} />
          <div className={styles.formField}>
            <label className={styles.label} htmlFor="name">
              <span className={styles.labelText}>Name</span>
              <span className={styles.labelHint}>This will be displayed on your profile.</span>
            </label>
            <div className={styles.fieldsGroup}>
              <Name className={styles.field} id="name" placeholder="Your Company Co." />
              <Slug className={styles.field} id="slug" placeholder="your-company-co" />
            </div>
          </div>
          <div className={styles.divider} />
          <div className={styles.formField}>
            <label className={styles.label} htmlFor="description">
              <span className={styles.labelText}>Description</span>
              <span className={styles.labelHint}>A quick snapshot of your workspace.</span>
            </label>
            <Description
              className={styles.field}
              placeholder="Our team organizes everything here."
            />
          </div>
          <div className={styles.divider} />
          <Error />
          <div className={styles.actions}>
            <Button size="md" variant="secondary-gray" disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" size="md" loading={pending}>
              Save
            </Button>
          </div>
        </form>
      </section>
    </LayoutBase>
  );
};

const AvatarUpload = () => {
  const [avatarUrl, orgName, pending] = useUnit([$avatarUrl, $name, $pending]);
  const [handleFileSelect] = useUnit([avatarFileSelected]);

  const onSelectFile = ({ file }: { file: File }) => {
    handleFileSelect(file);
  };

  return (
    <div className={styles.formField}>
      <label className={styles.label} htmlFor="logo">
        <span className={styles.labelText}>Logo</span>
        <span className={styles.labelHint}>Update your logo.</span>
      </label>
      <div className={styles.fieldsGroup}>
        <ImageUpload.Root className={styles.field}>
          <ImageUpload.Preview src={avatarUrl} placeholder={orgName} />
          <ImageUpload.Upload
            isDisabled={pending}
            label="logo"
            buttonText="Select image"
            onSelectFile={onSelectFile}
          />
        </ImageUpload.Root>
      </div>
    </div>
  );
};

const Name = reflect({
  view: Input,
  bind: {
    name: "name",
    value: $name,
    onValue: nameChanged,
    disabled: $pending,
  },
});

const Slug = reflect({
  view: Input,
  bind: {
    name: "slug",
    value: $slug,
    onValue: slugChanged,
    onBlur: slugBlur.prepend(noop),
    disabled: $pending,
  },
});

const Description = reflect({
  view: Textarea,
  bind: {
    name: "description",
    value: $description,
    onValue: descriptionChanged,
    disabled: $pending,
  },
});

const errorText: { [Key in WorkspaceSettingsError]: string } = {
  NotFound: "Workspace not found or you don't have access to",
  InvalidFile: "You're uploaded an incorrect file, please upload another one",
  UnknownError: "Something goes wrong. Please, try again later",
  EmptyName: "Please, fill the organization name. It must be longer than 1 symbol",
  SlugTaken: "This URL is already taken, please choose another one",
};

const Error = () => {
  const error = useUnit($error);

  return (
    <div className={styles.formField}>
      <div className={styles.label}>&nbsp;</div>
      <div className={styles.error}>{error ? errorText[error] : null}</div>
    </div>
  );
};
