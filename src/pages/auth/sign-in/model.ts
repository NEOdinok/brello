import { createEvent, createStore } from "effector";

export const formSubmitted = createEvent();
export const emailChanged = createEvent<string>();

export const $email = createStore("");

$email.on(emailChanged, (_, email) => email);
