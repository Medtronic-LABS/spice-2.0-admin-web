/**
 *
 * This method used for go to specific application based on url
 *
 * @param {string} url The URL used for go to specific website.
 */
export const goToUrl = (url: string = '/', locationRef: Pick<Location, 'replace'> = window.location) => {
  locationRef.replace(url);
};
