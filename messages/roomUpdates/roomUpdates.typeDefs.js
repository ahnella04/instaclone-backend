import { gql } from "apollo-server-express";

export default gql`
    type Subscription {
        roomUpdates(id: Int!): Message
    }
`;

// 어떻게 id가 1인 room의 메세지만 리스닝할 수 있는지