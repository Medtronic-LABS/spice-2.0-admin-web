/**
 * 
 * This method used for go to specific application based on url
 * 
 * @param {string} url The URL used for go to specific website.
 */
export const goToUrl = (url: any = '/') => {
    const link = document.createElement('a');
    link.href = url;
    document.body.appendChild(link);
    link.click();
}