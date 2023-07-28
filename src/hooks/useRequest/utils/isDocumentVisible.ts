import { isBrowser } from "./isBrowser";

 const  isDocumentVisible = (): boolean =>{
  if (isBrowser) {
    return document.visibilityState !== 'hidden';
  }
  return true;
}
export default isDocumentVisible
