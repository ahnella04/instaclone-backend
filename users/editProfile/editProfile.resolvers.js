import { createWriteStream } from "fs";
import bcrypt from "bcrypt";
import client from "../../client";
import { protectedResolver } from "../users.utils";
import { uploadPhoto } from "../../shared/shared.utils";
import { GraphQLUpload } from "graphql-upload";

const resolverFn = async (
  _,
  { firstName, lastName, username, email, password: newPassword, bio, avatar },
  { loggedInUser }
) => {
  let avatarUrl = null;
  if (avatar) {
    avatarUrl = await uploadToS3(avatar, loggedInUser.id, "avatars")
    /* const { filename, createReadStream } = await avatar;
    const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`
    const readStream = createReadStream()
    readStream.pipe(writeStream) // 이 stream은 위 경로에 write
    avatarUrl = `http://localhost:4000/static/${newFilename}`; */
  }
  let uglyPassword = null;
  if (newPassword) {
    uglyPassword = await bcrypt.hash(newPassword, 10);
  }
  const updatedUser = await client.user.update({
    where: {
      id: loggedInUser.id,
    },
    data: {
      firstName,
      lastName,
      username,
      email,
      bio,
      ...(uglyPassword && { password: uglyPassword }),
      ...(avatarUrl && { avatar: avatarUrl })
    },
  });
  if (updatedUser.id) {
    return {
      ok: true,
    };
  } else {
    return {
      ok: false,
      error: "Could not update profile.",
    };
  }
};

export default {
  Upload: GraphQLUpload,
  Mutation: {
    editProfile: protectedResolver(resolverFn),
  },
};