<script lang="ts">
import { h, Transition } from 'vue';

interface HTMLExpandElement extends HTMLElement {
  _parent?: (Node & ParentNode & HTMLElement) | null;
  _initialStyle?: {
    transition: string;
    overflow: string;
    height?: string | null;
    width?: string | null;
  };
}

const sizeProperty = 'height';
const offsetProperty = 'offsetHeight';
function onBeforeEnter(el: HTMLExpandElement) {
  el._parent = el.parentNode as (Node & ParentNode & HTMLElement) | null;
  el._initialStyle = {
    transition: el.style.transition,
    overflow: el.style.overflow,
    [sizeProperty]: el.style[sizeProperty],
  };
}

function onEnter(el: HTMLExpandElement) {
  const initialStyle = el._initialStyle!;

  el.style.setProperty('transition', 'none', 'important');
  // Hide overflow to account for collapsed margins in the calculated height
  el.style.overflow = 'hidden';
  const offset = `${el[offsetProperty]}px`;

  el.style[sizeProperty] = '0';

  void el.offsetHeight; // force reflow

  el.style.transition = initialStyle.transition;

  requestAnimationFrame(() => {
    el.style[sizeProperty] = offset;
  });
}

const onAfterEnter = resetStyles;
const onEnterCancelled = resetStyles;

function onLeave(el: HTMLExpandElement) {
  el._initialStyle = {
    transition: '',
    overflow: el.style.overflow,
    [sizeProperty]: el.style[sizeProperty],
  };

  el.style.overflow = 'hidden';
  el.style[sizeProperty] = `${el[offsetProperty]}px`;
  void el.offsetHeight; // force reflow

  requestAnimationFrame(() => (el.style[sizeProperty] = '0'));
}
const onLeaveCancelled = onAfterLeave;

function onAfterLeave(el: HTMLExpandElement) {
  resetStyles(el);
}

function resetStyles(el: HTMLExpandElement) {
  const size = el._initialStyle![sizeProperty];
  el.style.overflow = el._initialStyle!.overflow;
  if (size != null) el.style[sizeProperty] = size;
  delete el._initialStyle;
}

export default defineComponent({
  name: 'ExpandTransition',

  setup(props, { slots }) {
    return () => {
      return h(
        // @ts-expect-error
        Transition,
        {
          name: 'expand',
          onBeforeEnter,
          onEnter,
          onAfterLeave,
          onLeave,
          onAfterEnter,
          onEnterCancelled,
          onLeaveCancelled,
        },
        slots.default
      );
    };
  },
});
</script>

<style scoped>
* {
  will-change: height;
  transition: height 0.5s ease-in-out;
}
</style>

<style>
.expand-enter-active,
.expand-leave-active {
  overflow: hidden;
}

.expand-enter,
.expand-leave-to {
  height: 0;
}
</style>
