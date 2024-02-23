import { useUnit } from "effector-react";
import { FormEventHandler } from "react";

import { IconFolderShield } from "@/shared/assets/icons";
import { Button, FeaturedIcon, Input, Textarea } from "@/shared/ui";

import {
  $description,
  $error,
  $name,
  $pending,
  $slug,
  OnboardingWorkspaceError,
  descriptionChanged,
  formSubmitted,
  nameChanged,
  slugChanged,
} from "./model";
import styles from "./styles.module.css";

export const PageLoader = () => {
  return (
    <main className={styles.root}>
      <section className={styles.section}>
        <FeaturedIcon
          className={styles.featuredIcon}
          color="primary"
          theme="modern"
          Icon={IconFolderShield}
        />
        <h1 className={styles.headline}>Session loading…</h1>
      </section>
    </main>
  );
};

const errorText: { [Key in OnboardingWorkspaceError]: string } = {
  NameInvalid: "Please, check name of the workspace. It should be longer.",
  SlugInvalid: "Filled slug is incorrect. It can contain only a-z and dashes.",
  SlugTaken: "Filled slug already taken, please choose another one.",
  UnknownError: "Something wrong happened. Please try again.",
};

export const OnboardingWorkspacePage = () => {
  const [name, slug, description, error, pending] = useUnit([
    $name,
    $slug,
    $description,
    $error,
    $pending,
  ]);
  const [handleFormSubmit, handleName, handleSlug, handleDescription] = useUnit([
    formSubmitted,
    nameChanged,
    slugChanged,
    descriptionChanged,
  ]);

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    handleFormSubmit();
  };

  return (
    <main className={styles.root}>
      <section className={styles.section}>
        <FeaturedIcon
          className={styles.featuredIcon}
          color="primary"
          theme="modern"
          Icon={IconFolderShield}
        />
        <h1 className={styles.headline}>Let's build a Workspace</h1>
        <p className={styles.description}>
          Boost your productivity by making it easier for everyone to access boards in one location.
        </p>
        <form onSubmit={onSubmit}>
          <Input
            className={styles.input}
            label="Workspace name"
            onValue={handleName}
            name="name"
            value={name}
            placeholder="Your Company Co."
          />
          <Input
            className={styles.input}
            label="brello.io/workspaces/"
            onValue={handleSlug}
            name="slug"
            value={slug}
            placeholder="your-company-co"
          />
          <Textarea
            className={styles.input}
            label="Description"
            onValue={handleDescription}
            name="description"
            value={description}
            placeholder="Our team organizes everything here."
          />
          <div className={styles.error}>{error ? errorText[error] : <span>&nbsp;</span>}</div>
          <Button loading={pending} className={styles.button} type="submit" size="xl">
            Get started
          </Button>
        </form>
      </section>
    </main>
  );
};
