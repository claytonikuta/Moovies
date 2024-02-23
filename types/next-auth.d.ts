import 'next-auth';

declare module 'next-auth' {
  /**
   * Represents the shape of a user object in `next-auth` after successful sign-in.
   */
  interface User {
    id?: string; // Assuming your User model defines an `id` field
  }

  /**
   * The shape of the session object with the extended User type.
   */
  interface Session {
    user?: User & {
      id: string;
    };
  }
}
