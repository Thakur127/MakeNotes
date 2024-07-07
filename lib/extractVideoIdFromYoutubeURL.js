const extractVideoIdFromYoutubeURL = (url) => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=)?([\w-]{10,12})/;

  //   const url = "https://www.youtube.com/watch?v=ycPr5-27vSI";
  const match = url.match(regex);

  if (match) {
    const videoId = match[1];
    return videoId;
  } else {
    throw new Error("Invalid Youtube URL");
  }
};

export default extractVideoIdFromYoutubeURL;
