import bcrypt from "bcrypt";
import client from "../../client";

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      try {
        // check if username or email is already on DB
        const existingUser = await client.user.findFirst({
          where: { OR: [{ username }, { email }] }
        });
        if (existingUser) {
          throw new Error("This username/password is already taken.");
        }
        // hash password
        const uglyPassword = await bcrypt.hash(password, 10);
        // save and return the user
        return client.user.create({
          data: {
            username,
            email,
            firstName,
            lastName,
            password: uglyPassword
          }
        });
      } catch (e) {
        // 어떤 에러가 생기든 catch 발생
        return e;
      }
    }
  }
};
