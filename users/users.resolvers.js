import { ExitStatus } from "typescript";
import client from "../client";

export default {
    User: {
        totalFollowing: ({ id }) => client.user.count({ where: {
            followers: {
                some: {
                    id
                }
            } // 내가 그들의 팔로우 리스트에 있다면 내가 그들을 팔로잉하고 있다는 것을 알 수 있음
        }}),
        totalFollowers: ({ id }) => client.user.count({ where: {
            following: {
                some: {
                    id
                }
            }
        }}), // 내 id를 자신의 팔로우 리스트에 가지고 있는 사람
        isMe: ({ id }, _, {loggedInUser}) => {
            console.log(id, loggedInUser)
            if(!loggedInUser) {
                return false;
            }
            return id === loggedInUser.id;
        },
        isFollowing: async ({id}, _, {loggedInUser}) => {
            if(!loggedInUser) {
                return false;
            }
            const exists = await client.user.count({
                where: {
                    username: loggedInUser.username, // 우리의 이상적인 user, username이 로그인 된 username과 같은 user
                    following: {
                        some: {
                            id
                        }
                    } // following 리스트에 있는 id를 가지고 있는 user와 우리가 보고 있는 user의 id가 같은지 비교
                }
            })
            return Boolean(exists)
        } // exist.length === 1 이면 user를 팔로잉
    }
} // totalFollowing의 parent = User
// graphql은 이 두 field를 데이터베이스에서 찾은 user로 resolve 하려 할 것

// prisma query는 await이 필요 없음
// 하지만 computed fields에 prisma를 사용하거나 어떤 것을 리턴하기 위해서는 await 필요