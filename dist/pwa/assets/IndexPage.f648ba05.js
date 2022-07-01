import { f as createComponent, i as inject, q as layoutKey, W as pageContainerKey, c as computed, h, j as hSlot, g as getCurrentInstance, a4 as defineComponent, aj as toRef, a5 as _export_sfc, r as ref, a6 as openBlock, ag as createElementBlock, af as createBaseVNode, ac as toDisplayString, F as Fragment, ah as renderList, ad as resolveComponent, a7 as createBlock, a8 as withCtx, d as createVNode } from "./index.ca91cb47.js";
var QPage = createComponent({
  name: "QPage",
  props: {
    padding: Boolean,
    styleFn: Function
  },
  setup(props, { slots }) {
    const { proxy: { $q } } = getCurrentInstance();
    const $layout = inject(layoutKey);
    inject(pageContainerKey, () => {
      console.error("QPage needs to be child of QPageContainer");
    });
    const style = computed(() => {
      const offset = ($layout.header.space === true ? $layout.header.size : 0) + ($layout.footer.space === true ? $layout.footer.size : 0);
      if (typeof props.styleFn === "function") {
        const height = $layout.isContainer.value === true ? $layout.containerHeight.value : $q.screen.height;
        return props.styleFn(offset, height);
      }
      return {
        minHeight: $layout.isContainer.value === true ? $layout.containerHeight.value - offset + "px" : $q.screen.height === 0 ? offset !== 0 ? `calc(100vh - ${offset}px)` : "100vh" : $q.screen.height - offset + "px"
      };
    });
    const classes = computed(() => `q-page ${props.padding === true ? " q-layout-padding" : ""}`);
    return () => h("main", {
      class: classes.value,
      style: style.value
    }, hSlot(slots.default));
  }
});
function useClickCount() {
  const clickCount = ref(0);
  function increment() {
    clickCount.value += 1;
    return clickCount.value;
  }
  return { clickCount, increment };
}
function useDisplayTodo(todos) {
  const todoCount = computed(() => todos.value.length);
  return { todoCount };
}
const _sfc_main$1 = defineComponent({
  name: "ExampleComponent",
  props: {
    title: {
      type: String,
      required: true
    },
    todos: {
      type: Array,
      default: () => []
    },
    meta: {
      type: Object,
      required: true
    },
    active: {
      type: Boolean
    }
  },
  setup(props) {
    return { ...useClickCount(), ...useDisplayTodo(toRef(props, "todos")) };
  }
});
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", null, [
    createBaseVNode("p", null, toDisplayString(_ctx.title), 1),
    createBaseVNode("ul", null, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.todos, (todo) => {
        return openBlock(), createElementBlock("li", {
          key: todo.id,
          onClick: _cache[0] || (_cache[0] = (...args) => _ctx.increment && _ctx.increment(...args))
        }, toDisplayString(todo.id) + " - " + toDisplayString(todo.content), 1);
      }), 128))
    ]),
    createBaseVNode("p", null, "Count: " + toDisplayString(_ctx.todoCount) + " / " + toDisplayString(_ctx.meta.totalCount), 1),
    createBaseVNode("p", null, "Active: " + toDisplayString(_ctx.active ? "yes" : "no"), 1),
    createBaseVNode("p", null, "Clicks on todos: " + toDisplayString(_ctx.clickCount), 1)
  ]);
}
var ExampleComponent = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "ExampleComponent.vue"]]);
const _sfc_main = defineComponent({
  name: "IndexPage",
  components: { ExampleComponent },
  setup() {
    const todos = ref([
      {
        id: 1,
        content: "ct1"
      },
      {
        id: 2,
        content: "ct2"
      },
      {
        id: 3,
        content: "ct3"
      },
      {
        id: 4,
        content: "ct4"
      },
      {
        id: 5,
        content: "ct5"
      }
    ]);
    const meta = ref({
      totalCount: 1200
    });
    return { todos, meta };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_example_component = resolveComponent("example-component");
  return openBlock(), createBlock(QPage, { class: "row items-center justify-evenly" }, {
    default: withCtx(() => [
      createVNode(_component_example_component, {
        title: "Example component",
        active: "",
        todos: _ctx.todos,
        meta: _ctx.meta
      }, null, 8, ["todos", "meta"])
    ]),
    _: 1
  });
}
var IndexPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "IndexPage.vue"]]);
export { IndexPage as default };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5kZXhQYWdlLmY2NDhiYTA1LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcXVhc2FyL3NyYy9jb21wb25lbnRzL3BhZ2UvUVBhZ2UuanMiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9FeGFtcGxlQ29tcG9uZW50LnZ1ZSIsIi4uLy4uLy4uL3NyYy9wYWdlcy9JbmRleFBhZ2UudnVlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGgsIGNvbXB1dGVkLCBpbmplY3QsIGdldEN1cnJlbnRJbnN0YW5jZSB9IGZyb20gJ3Z1ZSdcblxuaW1wb3J0IHsgY3JlYXRlQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vdXRpbHMvcHJpdmF0ZS9jcmVhdGUuanMnXG5pbXBvcnQgeyBoU2xvdCB9IGZyb20gJy4uLy4uL3V0aWxzL3ByaXZhdGUvcmVuZGVyLmpzJ1xuaW1wb3J0IHsgcGFnZUNvbnRhaW5lcktleSwgbGF5b3V0S2V5IH0gZnJvbSAnLi4vLi4vdXRpbHMvcHJpdmF0ZS9zeW1ib2xzLmpzJ1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVDb21wb25lbnQoe1xuICBuYW1lOiAnUVBhZ2UnLFxuXG4gIHByb3BzOiB7XG4gICAgcGFkZGluZzogQm9vbGVhbixcbiAgICBzdHlsZUZuOiBGdW5jdGlvblxuICB9LFxuXG4gIHNldHVwIChwcm9wcywgeyBzbG90cyB9KSB7XG4gICAgY29uc3QgeyBwcm94eTogeyAkcSB9IH0gPSBnZXRDdXJyZW50SW5zdGFuY2UoKVxuXG4gICAgY29uc3QgJGxheW91dCA9IGluamVjdChsYXlvdXRLZXkpXG4gICAgaW5qZWN0KHBhZ2VDb250YWluZXJLZXksICgpID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1FQYWdlIG5lZWRzIHRvIGJlIGNoaWxkIG9mIFFQYWdlQ29udGFpbmVyJylcbiAgICB9KVxuXG4gICAgY29uc3Qgc3R5bGUgPSBjb21wdXRlZCgoKSA9PiB7XG4gICAgICBjb25zdCBvZmZzZXRcbiAgICAgICAgPSAoJGxheW91dC5oZWFkZXIuc3BhY2UgPT09IHRydWUgPyAkbGF5b3V0LmhlYWRlci5zaXplIDogMClcbiAgICAgICAgKyAoJGxheW91dC5mb290ZXIuc3BhY2UgPT09IHRydWUgPyAkbGF5b3V0LmZvb3Rlci5zaXplIDogMClcblxuICAgICAgaWYgKHR5cGVvZiBwcm9wcy5zdHlsZUZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbnN0IGhlaWdodCA9ICRsYXlvdXQuaXNDb250YWluZXIudmFsdWUgPT09IHRydWVcbiAgICAgICAgICA/ICRsYXlvdXQuY29udGFpbmVySGVpZ2h0LnZhbHVlXG4gICAgICAgICAgOiAkcS5zY3JlZW4uaGVpZ2h0XG5cbiAgICAgICAgcmV0dXJuIHByb3BzLnN0eWxlRm4ob2Zmc2V0LCBoZWlnaHQpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1pbkhlaWdodDogJGxheW91dC5pc0NvbnRhaW5lci52YWx1ZSA9PT0gdHJ1ZVxuICAgICAgICAgID8gKCRsYXlvdXQuY29udGFpbmVySGVpZ2h0LnZhbHVlIC0gb2Zmc2V0KSArICdweCdcbiAgICAgICAgICA6IChcbiAgICAgICAgICAgICAgJHEuc2NyZWVuLmhlaWdodCA9PT0gMFxuICAgICAgICAgICAgICAgID8gKG9mZnNldCAhPT0gMCA/IGBjYWxjKDEwMHZoIC0gJHsgb2Zmc2V0IH1weClgIDogJzEwMHZoJylcbiAgICAgICAgICAgICAgICA6ICgkcS5zY3JlZW4uaGVpZ2h0IC0gb2Zmc2V0KSArICdweCdcbiAgICAgICAgICAgIClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgY29uc3QgY2xhc3NlcyA9IGNvbXB1dGVkKCgpID0+XG4gICAgICBgcS1wYWdlICR7IHByb3BzLnBhZGRpbmcgPT09IHRydWUgPyAnIHEtbGF5b3V0LXBhZGRpbmcnIDogJycgfWBcbiAgICApXG5cbiAgICByZXR1cm4gKCkgPT4gaCgnbWFpbicsIHtcbiAgICAgIGNsYXNzOiBjbGFzc2VzLnZhbHVlLFxuICAgICAgc3R5bGU6IHN0eWxlLnZhbHVlXG4gICAgfSwgaFNsb3Qoc2xvdHMuZGVmYXVsdCkpXG4gIH1cbn0pXG4iLCI8dGVtcGxhdGU+XG4gIDxkaXY+XG4gICAgPHA+e3sgdGl0bGUgfX08L3A+XG4gICAgPHVsPlxuICAgICAgPGxpIHYtZm9yPVwidG9kbyBpbiB0b2Rvc1wiIDprZXk9XCJ0b2RvLmlkXCIgQGNsaWNrPVwiaW5jcmVtZW50XCI+XG4gICAgICAgIHt7IHRvZG8uaWQgfX0gLSB7eyB0b2RvLmNvbnRlbnQgfX1cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cbiAgICA8cD5Db3VudDoge3sgdG9kb0NvdW50IH19IC8ge3sgbWV0YS50b3RhbENvdW50IH19PC9wPlxuICAgIDxwPkFjdGl2ZToge3sgYWN0aXZlID8gJ3llcycgOiAnbm8nIH19PC9wPlxuICAgIDxwPkNsaWNrcyBvbiB0b2Rvczoge3sgY2xpY2tDb3VudCB9fTwvcD5cbiAgPC9kaXY+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0IGxhbmc9XCJ0c1wiPlxuaW1wb3J0IHtcbiAgZGVmaW5lQ29tcG9uZW50LFxuICBQcm9wVHlwZSxcbiAgY29tcHV0ZWQsXG4gIHJlZixcbiAgdG9SZWYsXG4gIFJlZixcbn0gZnJvbSAndnVlJztcbmltcG9ydCB7IFRvZG8sIE1ldGEgfSBmcm9tICcuL21vZGVscyc7XG5cbmZ1bmN0aW9uIHVzZUNsaWNrQ291bnQoKSB7XG4gIGNvbnN0IGNsaWNrQ291bnQgPSByZWYoMCk7XG4gIGZ1bmN0aW9uIGluY3JlbWVudCgpIHtcbiAgICBjbGlja0NvdW50LnZhbHVlICs9IDFcbiAgICByZXR1cm4gY2xpY2tDb3VudC52YWx1ZTtcbiAgfVxuXG4gIHJldHVybiB7IGNsaWNrQ291bnQsIGluY3JlbWVudCB9O1xufVxuXG5mdW5jdGlvbiB1c2VEaXNwbGF5VG9kbyh0b2RvczogUmVmPFRvZG9bXT4pIHtcbiAgY29uc3QgdG9kb0NvdW50ID0gY29tcHV0ZWQoKCkgPT4gdG9kb3MudmFsdWUubGVuZ3RoKTtcbiAgcmV0dXJuIHsgdG9kb0NvdW50IH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbXBvbmVudCh7XG4gIG5hbWU6ICdFeGFtcGxlQ29tcG9uZW50JyxcbiAgcHJvcHM6IHtcbiAgICB0aXRsZToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgcmVxdWlyZWQ6IHRydWVcbiAgICB9LFxuICAgIHRvZG9zOiB7XG4gICAgICB0eXBlOiBBcnJheSBhcyBQcm9wVHlwZTxUb2RvW10+LFxuICAgICAgZGVmYXVsdDogKCkgPT4gW11cbiAgICB9LFxuICAgIG1ldGE6IHtcbiAgICAgIHR5cGU6IE9iamVjdCBhcyBQcm9wVHlwZTxNZXRhPixcbiAgICAgIHJlcXVpcmVkOiB0cnVlXG4gICAgfSxcbiAgICBhY3RpdmU6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW5cbiAgICB9XG4gIH0sXG4gIHNldHVwIChwcm9wcykge1xuICAgIHJldHVybiB7IC4uLnVzZUNsaWNrQ291bnQoKSwgLi4udXNlRGlzcGxheVRvZG8odG9SZWYocHJvcHMsICd0b2RvcycpKSB9O1xuICB9LFxufSk7XG48L3NjcmlwdD5cbiIsIjx0ZW1wbGF0ZT5cbiAgPHEtcGFnZSBjbGFzcz1cInJvdyBpdGVtcy1jZW50ZXIganVzdGlmeS1ldmVubHlcIj5cbiAgICA8ZXhhbXBsZS1jb21wb25lbnRcbiAgICAgIHRpdGxlPVwiRXhhbXBsZSBjb21wb25lbnRcIlxuICAgICAgYWN0aXZlXG4gICAgICA6dG9kb3M9XCJ0b2Rvc1wiXG4gICAgICA6bWV0YT1cIm1ldGFcIlxuICAgID48L2V4YW1wbGUtY29tcG9uZW50PlxuICA8L3EtcGFnZT5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQgbGFuZz1cInRzXCI+XG5pbXBvcnQgeyBUb2RvLCBNZXRhIH0gZnJvbSAnY29tcG9uZW50cy9tb2RlbHMnO1xuaW1wb3J0IEV4YW1wbGVDb21wb25lbnQgZnJvbSAnY29tcG9uZW50cy9FeGFtcGxlQ29tcG9uZW50LnZ1ZSc7XG5pbXBvcnQgeyBkZWZpbmVDb21wb25lbnQsIHJlZiB9IGZyb20gJ3Z1ZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbXBvbmVudCh7XG4gIG5hbWU6ICdJbmRleFBhZ2UnLFxuICBjb21wb25lbnRzOiB7IEV4YW1wbGVDb21wb25lbnQgfSxcbiAgc2V0dXAgKCkge1xuICAgIGNvbnN0IHRvZG9zID0gcmVmPFRvZG9bXT4oW1xuICAgICAge1xuICAgICAgICBpZDogMSxcbiAgICAgICAgY29udGVudDogJ2N0MSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiAyLFxuICAgICAgICBjb250ZW50OiAnY3QyJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IDMsXG4gICAgICAgIGNvbnRlbnQ6ICdjdDMnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogNCxcbiAgICAgICAgY29udGVudDogJ2N0NCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiA1LFxuICAgICAgICBjb250ZW50OiAnY3Q1J1xuICAgICAgfVxuICAgIF0pO1xuICAgIGNvbnN0IG1ldGEgPSByZWY8TWV0YT4oe1xuICAgICAgdG90YWxDb3VudDogMTIwMFxuICAgIH0pO1xuICAgIHJldHVybiB7IHRvZG9zLCBtZXRhIH07XG4gIH1cbn0pO1xuPC9zY3JpcHQ+XG4iXSwibmFtZXMiOlsiX3NmY19tYWluIiwiX2NyZWF0ZUVsZW1lbnRCbG9jayIsIl9jcmVhdGVFbGVtZW50Vk5vZGUiLCJfb3BlbkJsb2NrIiwiX0ZyYWdtZW50IiwiX3JlbmRlckxpc3QiLCJfdG9EaXNwbGF5U3RyaW5nIiwiX2NyZWF0ZUJsb2NrIiwiX3dpdGhDdHgiLCJfY3JlYXRlVk5vZGUiXSwibWFwcGluZ3MiOiI7QUFNQSxJQUFBLFFBQWUsZ0JBQWdCO0FBQUEsRUFDN0IsTUFBTTtBQUFBLEVBRU4sT0FBTztBQUFBLElBQ0wsU0FBUztBQUFBLElBQ1QsU0FBUztBQUFBLEVBQ1Y7QUFBQSxFQUVELE1BQU8sT0FBTyxFQUFFLFNBQVM7QUFDdkIsVUFB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
