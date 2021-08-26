import { GraphQLUpload } from "graphql-upload";
import client from "../../client";
import { uploadToS3 } from "../../shared/shared.utils";
import { protectedResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

export default {
    Upload: GraphQLUpload,
    Mutation: {
        uploadPhoto: protectedResolver(
            async (_, { file, caption }, { loggedInUser }) => {
                let hashtagObj = [];
                if (caption) {
                    hashtagObj = processHashtags(caption);
                }
                const fileUrl = await uploadToS3(file, loggedInUser.id, "avatars");
                // AWS avatars 폴더 & uploads 폴더 안에 fileUrl 저장
                return client.photo.create({
                    data: {
                        file: fileUrl,
                        caption,
                        user: {
                            connect: {
                                id: loggedInUser.id,
                            },
                        },
                        ...(hashtagObj.length > 0 && {
                            hashtags: {
                                connectOrCreate: hashtagObj,
                            },
                        }),
                    },
                });
            }
        ),
    },
};