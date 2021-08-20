import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
    Query: {
        seeFeed: protectedResolver((_, __, { loggedInUser }) =>
            client.photo.findMany({
                where: {
                    OR: [
                        {
                            user: {
                                followers: {
                                    some: {
                                        id: loggedInUser.id
                                    }
                                }
                            }
                        }, // 우리가 팔로잉하는 유저들의 photo와 우리가 만든 photo를 가져오고 있음
                        {
                            user: {
                                userId: loggedInUser.id
                            }
                        }
                    ]
                },
                orderBy: {
                    createdAt: "desc"
                }
            }))
    }
}