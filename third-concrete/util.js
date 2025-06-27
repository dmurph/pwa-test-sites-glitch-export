export const MOUSE_LEFT_BUTTON = 0;
export const MOUSE_RIGHT_BUTTON = 2;

export function inplaceRemove(array, item) {
  while (true) {
    const index = array.indexOf(item);
    if (index == -1) {
      return;
    }
    array.splice(index, 1);
  }
}
