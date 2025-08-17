import { defineAuth } from '@aws-amplify/backend';

export const myAuth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    email: {
      required: true,
    },
  },
});
