import { IdentityStore } from "aws-sdk";
import client from "../client";

export default {
    Room: {
        users: ({ id }) => client.room.findUnique({
            where: {
                id
            }
        }).users(), // 대화방 안에 있는 사용자를 찾아서 원한다면 skip, take, cursor 같은 것들을 만들 수 있음
        messages: ({ id }) => client.message.findMany({
            where: {
                roomId: id
            }
        }),
        unreadTotal: ({ id }, _, { loggedInUser }) => {
            if (!loggedInUser) {
                return 0;
            }
            return client.message.count({
                where: {
                    read: false,
                    roomId: id,
                    user: {
                        id: {
                            not: loggedInUser.id
                        } // count 대상: 아직 안 읽혔고, 이 대화방 안에 있고, 내가 생성한게 아닌 메세지들
                    }
                }
            }) // read값이 false인 메세지를 찾아서 갯수를 셀 수 있음
        }
    },
    Message: {
        user: ({ id }) => client.message.findUnique({
            where: {
                id
            }
        }).user()
    }
}