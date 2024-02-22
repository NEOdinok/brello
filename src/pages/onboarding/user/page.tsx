import { Link } from "atomic-router-react";
import { useUnit } from "effector-react";
import { FormEventHandler } from "react";

import { IconUser01 } from "@/shared/assets/icons";
import { routes } from "@/shared/routing";
import { Button, FeaturedIcon, Input } from "@/shared/ui";

import {
  $error,
  $firstName,
  $lastName,
  $pending,
  OnboardingUserError,
  firstNameChanged,
  formSubmitted,
  lastNameChanged,
} from "./model";
import styles from "./styles.module.css";

export const PageLoader = () => (
  <main className={styles.root}>
    <section className={styles.section}>
      <FeaturedIcon
        className={styles.featuredIcon}
        color="primary"
        theme="modern"
        Icon={IconUser01}
      />
      <h1 className={styles.headline}>Session loading…</h1>
    </section>
  </main>
);

const errorText: { [Key in OnboardingUserError]: string } = {
  UnknownError: "Something wrong happened. Please try again.",
  FirstNameRequired: "Please, fill at least the first name.",
};

export const OnboardingUserPage = () => {
  const [firstName, lastName, pending, error] = useUnit([
    $firstName,
    $lastName,
    $pending,
    $error,
  ]) as [string, string, boolean, OnboardingUserError | null];

  const [handleFormSubmit, handleFirstName, handleLastName] = useUnit([
    formSubmitted,
    firstNameChanged,
    lastNameChanged,
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
          Icon={IconUser01}
        ></FeaturedIcon>
        <h1 className={styles.headline}>Please, introduce yourself</h1>
        <p className={styles.description}>
          You can do this later on Profile page.{" "}
          <Link className={styles.link} to={routes.home}>
            Skip
          </Link>
        </p>
        <form onSubmit={onSubmit}>
          <div className={styles.row}>
            <Input
              className={styles.input}
              label="First name"
              name="firstName"
              placeholder="First name"
              value={firstName}
              onValue={handleFirstName}
              disabled={pending}
            />
            <Input
              className={styles.input}
              label="Last name"
              name="lastName"
              placeholder="Last name"
              value={lastName}
              onValue={handleLastName}
              disabled={pending}
            />
          </div>
          <div className={styles.error}>{error ? errorText[error] : <span>&nbsp;</span>}</div>
          <Button loading={pending} className={styles.button} type="submit" size="xl">
            Continue
          </Button>
        </form>
      </section>
    </main>
  );
};
