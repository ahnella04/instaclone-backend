import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
    Mutation: {
        readMessage: protectedResolver(async (_, { id }, { loggedInUser }) => {
            const message = await client.message.findFirst({
                where: {
                    id,
                    userId: {
                        not: loggedInUser.id
                    },
                    room: {
                        users: {
                            some: {
                                id: loggedInUser.id
                            }
                        }
                    }
                },
                select: {
                    id: true
                }
            });
            if (!message) {
                return {
                    ok: false,
                    error: "Message not found."
                }
            }
            await client.message.update({
                where: {
                    id
                },
                data: {
                    read: true
                }
            })
            return {
                ok: true
            }
        })
    }
}

// 먼저 argument상의 id랑 똑같은 id를 가진 메세지를 검색하고, 
// 이제 메세지를 검색하는데 이 메세지를 보낸 사용자가 현재 로그인 되어 있는 사용자가 아닌 경우일 때만 검색하고
// 현재 로그인 된 사용자가 들어가 있는 대화방에서 보내진 메세지를 검색하고 있음
// 그러니까 오직 나만 그 메세지를 읽음 표시할 수 있음
// 내가 그 대화방 안에 들어가 있고 내가 그 메세지를 보낸 사용자가 아닐 때
// 그리고 내가 그 메세지가 전달된 걸 알고 있을 때, 그 메세지를 읽음 표시할 수 있다는 걸 확인