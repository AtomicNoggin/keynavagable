declare module "keynavagable" {
  type method = () => void;
  interface KeyNavagableDfn {
    getTabNext(element: Element): method | Element;
    setTabNext(
      element: Element,
      target?: method | string | Element
    ): KeyNavagableDfn;
    getTabPrevious(element: Element): method | Element;
    setTabPrevious(
      element: Element,
      target?: method | string | Element
    ): KeyNavagableDfn;
    hasKeyAction(element: Element, key: string): boolean;
    getKeyAction(element: Element, key: string): method | null;
    setKeyAction(
      element: Element,
      key: string,
      method: method | string,
      target?: method | string | Element
    ): KeyNavagableDfn;
    removeKeyAction(element: Element, key: string): KeyNavagableDfn;
    hasCaptureKeyAction(element: Element, key: string): boolean;
    getCaptureKeyAction(element: Element, key: string): method | null;
    captureKeyAction(
      element: Element,
      key: string,
      method: method | string,
      target?: method | string | Element
    ): KeyNavagableDfn;
    releaseKeyAction(element: Element, key: string): KeyNavagableDfn;
  }
  export const KeyNavagable: KeyNavagableDfn;
  export default KeyNavagable;
}
