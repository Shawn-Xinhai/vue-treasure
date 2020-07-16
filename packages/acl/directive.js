import { testPermission } from './permission'

export const directive = {
  bind: (el, binding, vnode) => {
    if (!testPermission(binding.value)) {
      // 思路是把当前的元素替换为一个“comment"元素
      const comment = document.createComment(' ')
      Object.defineProperty(comment, 'setAttribute', {
        value: () => undefined,
      })
      vnode.elm = comment
      vnode.text = ' '
      vnode.isComment = true
      vnode.context = undefined
      vnode.tag = undefined
      vnode.data.directives = undefined

      if (vnode.componentInstance) {
        vnode.componentInstance.$el = comment
      }

      if (el.parentNode) {
        el.parentNode.replaceChild(comment, el)
      }
    }
  }
}
