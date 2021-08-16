import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
    Mutation: {
        editPhoto: protectedResolver(async (_, { id, caption }, { loggedInUser }) => {
            const ok = await client.photo.findFirst({
                where: {
                    id,
                    userId: loggedInUser.id
                }
            });
            if (!ok) {
                return {
                    ok: false,
                    error: "Photo not found."
                }
            }
        })
    }
}