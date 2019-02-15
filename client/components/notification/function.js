import Vue from 'vue'
import Component from './fn-notification'

const NotificationConstructor = Vue.extend(Component)

const instances = []
let seed = 1
const MARGIN_HEIGHT = 16

const removeInstance = instance => {
  if (!instance) return
  const len = instances.length
  const index = instances.findIndex(item => item.id === instance.id)
  instances.splice(index, 1)

  if (len <= 1) return
  const removeHeight = instance.vm.height
  for (let i = index; i < len - 1; i++) {
    instances[i].verticalOffset = 
    parseInt(instances[i].verticalOffset) - removeHeight - MARGIN_HEIGHT
  }
}

const notify = (options) => {
  if (Vue.prototype.$isServer) {
    return
  }
  const {
    autoClose,
    ...rest
  } = options
  const instance = new NotificationConstructor({
    propsData: {
      ...rest
    },
    data: {
      autoClose: autoClose || 3000
    }
  })
  const id = `notification_${seed++}`
  instance.id = id
  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)
  instance.vm.visiable = true

  let verticalOffset = 0
  instances.forEach(item => {
    verticalOffset += item.$el.offsetHeight + MARGIN_HEIGHT
  })
  verticalOffset += MARGIN_HEIGHT
  instance.verticalOffset = verticalOffset
  instances.push(instance)

  instance.vm.$on('closed', () => {
    removeInstance(instance)
    document.body.removeChild(instance.vm.$el)
    instance.vm.$destroy()
  })
  instance.vm.$on('close', () => {
    instance.vm.visiable = false
  })
  return instance.vm
}

export default notify