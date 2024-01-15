import styles from "./styles.module.css";
import { useUnit } from "effector-react";
import { IconMail01 } from "@/shared/assets/icons";
import { Logo, Button, Input } from "@/shared/ui";
import { ImageLogomark } from "@/shared/assets/images";
import { emailChanged, formSubmitted, $email } from "./model";

export const SignInPage = () => {
  const [email, handleEmail, handleSubmit] = useUnit([
    $email,
    emailChanged,
    formSubmitted,
  ]);

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
                value={email}
                label="Email"
                placeholder="Enter your email"
                onValue={({ value }) => handleEmail(value)}
              />
              <Button className={styles.button} type="submit" size="md">
                Get started
              </Button>
            </form>
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
