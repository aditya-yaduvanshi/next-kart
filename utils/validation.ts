export default {
  isImageUrl(url: string) {
    let image = /^(http(s?):)\/\/.+\/.+$/g;
    return image.test(url);
  }
}