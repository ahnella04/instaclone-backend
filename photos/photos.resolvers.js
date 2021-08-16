import client from "../client"

export default {
    Photo: {
        user: ({ id }) => {
            return client.user
                .findUnique({ where: { id: userId } })
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
    },
    Hashtag: {
        photos: ({ id }, { page }, { loggedInUser }) => {
            // console.log(args)
            return client.hashtag
                .findUnique({
                    where: {
                        id
                    }
                }).photos()
        }, // pagination
        totalPhotos: ({ id }) =>
            client.hashtag.count({
                where: {
                    hashtags: {
                        some: {
                            id
                        }
                    }
                }
            }) // 이 id를 가진 해시태그가 hashtags 리스트에 포함 돼 있는 사진들을 모두 count
    }
}