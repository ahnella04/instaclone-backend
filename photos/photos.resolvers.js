import client from "../client"

export default {
    Photo: {
        user: ({ id }) => {
            return client.user
                .findUnique({ where: { id: user.id } })
        },
        hashtags: ({ id }) =>
            client.hashtag.findMany({
                where: {
                    photos: {
                        some: {
                            id
                        }
                    }
                }
            })
    }
}