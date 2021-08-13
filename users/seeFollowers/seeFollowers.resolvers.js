import client from "../../client"

export default {
    Query: {
        seeFollowers: async(_, {username, page}) => {
            const ok = await client.user.findUnique({ where: { username }, select: { id: true }})
            if(!ok) {
                return {
                    ok: false,
                    error: "Users not found"
                }
            }
            const followers = await client.user.findUnique({ where: { username }}).followers({ take: 5, skip: (page-1) * 5 }) 
            // 넘겨받은 페이지가 1일 때, 1페이지에선 우린 어떤 아이템도 skip 하지 않음
            const totalFollowers = await client.user.count({
                where: { following: { some: { username }}}
            })
            return {
                ok: true,
                followers,
                totalFollowers: Math.ceil(totalFollowers / 5)
            }
        }
    }
}