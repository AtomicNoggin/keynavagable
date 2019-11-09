declare module "keynavagable" {
  interface KeyNavagable {
    getTabNext(element: Element): () => (void) | Element;
    setTabNext(
      element: Element,
      target?: () => (void) | string | Element
    ): KeyNavagable;
    getTabPrevious(element: Element): () => (void) | Element;
    setTabPrevious(
      element: Element,
      target?: () => void | string | Element
    ): KeyNavagable;
    hasKeyAction(element: Element, key: string): boolean;
    getKeyAction(element: Element, key: string): () => void | null;
    setKeyAction(
      element: Element,
      key: string,
      method: () => void | string,
      target?: () => void | string | Element
    ): KeyNavagable;
    removeKeyAction(element: Element, key: string): KeyNavagable;
    hasCaptureKeyAction(element: Element, key: string): boolean;
    getCaptureKeyAction(element: Element, key: string): () => (void) | null;
    captureKeyAction(
      element: Element,
      key: string,
      method: () => void | string,
      target?: () => void | string | Element
    ): KeyNavagable;
    releaseKeyAction(element: Element, key: string): KeyNavagable;
  }
  export const KeyNavagable: KeyNavagable;
  export default KeyNavagable;
}
