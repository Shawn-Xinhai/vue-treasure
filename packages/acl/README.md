# Karbon 权限控制插件

## 安装
```js
import { AclPlugin } from 'acl'
import Vue from 'vue'
import router from './router'
Vue.use(AclPlugin, { router, notFound: '/404' })
```
**NotFound** 是你系统中的404页面路径

## 设置当前用户权限
```js
import { Acl } from 'acl'
// 从server获取到用户权限
// getPermissionFromServer只是一个例子，根据系统实际情况获取权限即可
const permissions = getPermissionFromServer()

// 设置用户权限
Acl.setPermissions(permissions)
```
**权限对象格式** 这里插件接受的权限为一个对象类型，例如：
```js
{
  productA: {
    feature1: true
    feature2: true
  },
  productB: {
    feature1: true
  }
}
```

## 路由里使用
```js
export default new Router({
  routes: [
    {
      path: '/productA/feature1',
      component: feature1,
      meta: {
        // 如果传入一个数组，则需要满足数组内全部规则
        acl: ['productA.feature1', 'productA.access1']
      }
    },
    {
      path: '/productA/feature2',
      component: feature2,
      meta: {
        acl: 'productA.feature2'
      }
    }
  ]
})
```

例如用户的权限为：
```js
{
  productA: {
    feature1: true
    access1: true
  }
}
```
那么用户可以正常访问`/productA/feature1`，但访问`/productA/feature2`则会看到404页面

## 组件模板中使用
```js
<button v-acl="'transaction.export'">
  Export
</button>
```

## 组件代码中使用
```js
if (this.$acl.check('someRule')) {
  // do something
} else {
  // do something else
}

```

**$acl**是通过`Vue.prototype`注册在全局的一个属性, `check`方法会检查权限是否符合。
