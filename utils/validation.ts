export default {
  isImageUrl(url: string) {
    let image = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
    return image.test(url);
  }
}