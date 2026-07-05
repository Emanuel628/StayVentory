import { Platform } from 'react-native';

export function blurActiveWebElement() {
  if (Platform.OS !== 'web') {
    return;
  }

  const activeElement = globalThis.document?.activeElement;

  if (activeElement instanceof HTMLElement) {
    activeElement.blur();
  }
}
