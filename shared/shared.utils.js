import AWS from "aws-sdk";
import { GraphQLUpload } from "graphql-upload"

AWS.config.update({
    credentials: {
        accessKeyId: process.env.AWS_KEY,
        secretAccessKey: process.env.AWS_SECRET
    }
})

export default {
    Upload: GraphQLUpload
}

export const uploadToS3 = async (file, userId, folderName) => {
    const { filename, createReadStream } = await file;
    const readStream = createReadStream();
    const objectName = `${folderName}/${userId}-${Date.now()}-${filename}`
    const { Location } = await new AWS.S3().upload({
        Bucket: "instaclone-uploads-lemon",
        Key: objectName,
        ACL: "public-read",
        Body: readStream
    }).promise() // 아직 url을 리턴할 수 없음
    return Location
}