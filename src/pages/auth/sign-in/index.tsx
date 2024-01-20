import { useUnit } from "effector-react";

import { Input, Button, Logo, FeaturedIcon } from "@/shared/ui";
import { ImageLogomark } from "@/shared/assets/images";
import { IconArrowLeft, IconMail01 } from "@/shared/assets/icons";

import styles from "./styles.module.css";

import {
  type SignInError,
  emailChanged,
  $email,
  $pending,
  $finished,
  formSubmitted,
  $error,
  backToLoginClicked,
} from "./model";
import { FC } from "react";

export const SignInPage = () => {
  const finished = useUnit($finished);

  return (
    <>
      <main className={styles.root}>
        <div className={styles.content}>
          <header className={styles.header}>
            <Logo />
          </header>
          <section className={styles.form}>
            <img
              className={styles.logomark}
              src={ImageLogomark}
              alt="Brello logomark"
            />
            {finished ? <LoginSucceded /> : <LoginForm />}
          </section>
          <footer className={styles.footer}>
            <p className={styles.info}>&copy; Brello 2023</p>
            <p className={styles.info}>
              <IconMail01 className={styles.mail} /> help@brello.io
            </p>
          </footer>
        </div>
        <div className={styles.geometric} />
      </main>
    </>
  );
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
          onValue={({ value }) => handleEmail(value)}
        />
        <Button loading={pending} className={styles.button} type="submit">
          Get started
        </Button>
      </form>
    </>
  );
};

const LoginSucceded: FC = () => {
  const [email, handleBack] = useUnit([$email, backToLoginClicked]);

  return (
    <>
      <FeaturedIcon
        className={styles.featuredIcon}
        color="primary"
        Icon={IconMail01}
      />
      <h1 className={styles.headline}>Check your email</h1>
      <p className={styles.description}>
        We sent a login link to{" "}
        <span className={styles.descriptionAccent}>{email}</span>
      </p>
      <Button
        variant="link-gray"
        className={styles.buttonBack}
        onClick={() => handleBack()}
      >
        <IconArrowLeft className={styles.backIcon} />
        Back to login
      </Button>
    </>
  );
};
