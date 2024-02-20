import { useUnit } from "effector-react";
import { FC } from "react";

import { LayoutAuthn } from "@/layouts/authn";

import { IconArrowLeft, IconMail01 } from "@/shared/assets/icons";
import { Button, FeaturedIcon, Input } from "@/shared/ui";

import {
  $email,
  $error,
  $finished,
  $pending,
  type SignInError,
  backToLoginClicked,
  emailChanged,
  formSubmitted,
} from "./model";
import styles from "./styles.module.css";

export const SignInPage = () => {
  const finished = useUnit($finished);

  return <LayoutAuthn>{finished ? <LoginSucceeded /> : <LoginForm />}</LayoutAuthn>;
};

export const PageLoader = () => {
  return <LayoutAuthn>Session loading…</LayoutAuthn>;
};

const errorText: { [Key in SignInError]: string } = {
  UnknownError: "Something wrong happened. Please try again.",
  InvalidEmail: "Must be a valid email address.",
  RateLimit: "Too much logins. Try again later.",
};

const LoginForm: FC = () => {
  const [email, error, pending] = useUnit([$email, $error, $pending]);
  const [handleEmail, handleSubmit] = useUnit([emailChanged, formSubmitted]);

  return (
    <>
      <h1 className={styles.headline}>Sign in</h1>
      <p className={styles.description}>Start your 30-day free trial.</p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <Input
          className={styles.input}
          name="email"
          disabled={pending}
          value={email}
          error={error ? errorText[error] : undefined}
          label="Email"
          placeholder="Enter your email"
          // onValue={({ value }) => handleEmail(value)}
          onValue={handleEmail}
        />
        <Button loading={pending} className={styles.button} type="submit">
          Get started
        </Button>
      </form>
    </>
  );
};

const LoginSucceeded: FC = () => {
  const [email, handleBack] = useUnit([$email, backToLoginClicked]);

  return (
    <>
      <FeaturedIcon className={styles.featuredIcon} color="primary" Icon={IconMail01} />
      <h1 className={styles.headline}>Check your email</h1>
      <p className={styles.description}>
        We sent a login link to <span className={styles.descriptionAccent}>{email}</span>
      </p>
      <Button variant="link-gray" className={styles.buttonBack} onClick={() => handleBack()}>
        <IconArrowLeft className={styles.backIcon} />
        Back to login
      </Button>
    </>
  );
};
