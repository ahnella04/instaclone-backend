export default {
    Query: {
        seeFollowing: async(_, { username, lastId }) => {
            const ok = await client.user.findUnique({ where: { username }, select: { id: true }})
            if(!ok) {
                return {
                    ok: false,
                    error: "Users not found"
                }
            }
            const following = await client.user.findUnique({ where: { username }}).following({ take: 5, skip: lastId ? 1 : 0, ...(cursor && { cursor: { id: lastId }}) })
            return {
                ok: true,
                following
            }
        }
    }
}