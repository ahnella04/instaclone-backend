export const processHashtags = (caption) => {
    const hashtags = caption.match(/#[\w]+/g) || [];
    // console.log(hashtags) ===> null ===> 버그 발생 ===> [] 추가
    return hashtags.map(hashtag => ({
        where: { hashtag }, create: { hashtag }
    }));
}