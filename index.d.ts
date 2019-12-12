declare module "keynavagable" {
  type method = () => void;
  interface IKeyNavagable {
    getTabNext(element: Element): method | Element;
    setTabNext(
      element: Element,
      target?: method | string | Element
    ): IKeyNavagable;
    getTabPrevious(element: Element): method | Element;
    setTabPrevious(
      element: Element,
      target?: method | string | Element
    ): IKeyNavagable;
    hasKeyAction(element: Element, key: string): boolean;
    getKeyAction(element: Element, key: string): method | null;
    setKeyAction(
      element: Element,
      key: string,
      method: method | string,
      target?: method | string | Element
    ): IKeyNavagable;
    removeKeyAction(element: Element, key: string): IKeyNavagable;
    hasCaptureKeyAction(element: Element, key: string): boolean;
    getCaptureKeyAction(element: Element, key: string): method | null;
    captureKeyAction(
      element: Element,
      key: string,
      method: method | string,
      target?: method | string | Element
    ): IKeyNavagable;
    releaseKeyAction(element: Element, key: string): IKeyNavagable;
  }
  export const KeyNavagable: IKeyNavagable;
  export default KeyNavagable;
}