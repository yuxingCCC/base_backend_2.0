export default {
    bind(el, bindings, vNode, content) {
    },

    inserted(el, bindings) {
        // el.parentNode.removeChild(el)
        // console.log(bindings)
        if(String(bindings.value).charAt(0)!='/')bindings.value = '/'+bindings.value
        let menuData = JSON.parse(sessionStorage.getItem("menuList"));
        let index = menuData.findIndex((item) => item.requestUrl === bindings.value);
        // console.log(index);
        if (index === -1) {
            // 如果有 ban 则 不能点击
            if (bindings.modifiers.ban) {
                el.style.pointerEvents = "none";
            } else {
                // remove
                el.parentNode.removeChild(el)
            }
        }
    },
    unbind(el, binding) {
    },
}
