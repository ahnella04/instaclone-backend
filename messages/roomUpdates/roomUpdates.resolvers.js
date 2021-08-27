import { withFilter } from "apollo-server-express";
import client from "../../client";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";

export default {
    Subscription: {
        roomUpdates: {
            subscribe: async (root, args, context, info) => {
                // console.log(context)
                const room = await client.room.findFirst({
                    where: {
                        id: args.id,
                        users: {
                            some: {
                                id: context.loggedInUser.id
                            }
                        }
                    },
                    select: {
                        id: true
                    }
                });
                if (!room) {
                    throw new Error("You shall not see this.")
                } // 만약 room이 지금 존재하지 않으면, 사람이 room을 listening 하지 못하게 막는 거임
                return withFilter(
                    () => pubsub.asyncIterator(NEW_MESSAGE),
                    async ({ roomUpdates }, { id }, { loggedInUser }) => {
                        // console.log(loggedInUser)
                        if (roomUpdates.roomId === id) { // roomUpdates.roomId는 여기 있는 sendMessage에서 옴
                            const room = await client.room.findFirst({
                                where: {
                                    id,
                                    users: {
                                        some: {
                                            id: loggedInUser.id
                                        }
                                    }
                                },
                                select: {
                                    id: true
                                }
                            });
                            if (!room) {
                                return false;
                            }
                            return true;
                        }; // user가 room 안에 위치해 있는지 체크
                    }
                )(root, args, context, info); // withFilter로 보내기
            }
        }
    }
}

// subscribe function 생성
// asyncIterator: 얘가 바로 trigger들을 listen

// 이 경우에는 새 메세지라는 event를 listen하고 있을 거임
// 우리는 event에 대해 subscribe