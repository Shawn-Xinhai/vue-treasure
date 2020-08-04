# Step Controller 

## 介绍

在许多业务场景中，都涉及到含有多个步骤的流程，例如分步表单。在处理这类分步流程时，往往都会需要进行如下操作：

- 列出所有步骤
- 跳到下一步/返回上一步
- 完成整个流程

然后各个步骤还需要一些状态位，进行控制。例如步骤是否可用，步骤完成状态等。

`Step Controller`就是为了将这些步骤操作和状态管理进行封装, 让用者无需关心步骤是如何跳转，如何进行状态管理。

而是只需要告知跳转到哪一步，或者从中 设定/获取 步骤状态等。

`Step Controller`会通过对外暴露一系列钩子函数，让使用者在步骤的跳转各个阶段执行自定义逻辑。


## 使用

```Vue
<template>
  <div>
    <!-- 渲染步骤列表 -->
    <ul>
      <!-- stepController是一个可迭代的对象 -->
      <li v-for="step in stepController" :key="step.name">
        {{ step.title }}
      </li>
    </ul>
  </div>
</template>

<script>
import StepController from 'step-controller'
import Step1 from 'path/to/step1'
import Step2 from 'path/to/step2'

export default {
  // 利用计算属性创建一个实例
  // 不放到data里面，是因为可以避免创建observer实例，消耗性能
  computed: {
    stepController() {
      return new StepController()
    },
  },
  // 给子组件提供步骤操作入口
  provide() {
    return this.stepController
  },
  created() {
    // 设定步骤列表
    this.setupSteps()
    // 设定所有步骤完成之后触发的动作
    this.setupFinishAction()
  },
  methods: {
    setupSteps() {
      const shortSideNavList = [
        { name: 'step1', title: 'Step 1', component: Step1 },
        { name: 'step2', title: 'Step 2', component: Step2 }
      ]
      stepList.forEach(item => {
        this.stepController.addStep(item)
      })
    },
    setupFinishAction() {
      this.stepController.onFinish(() => {
        console.log('Do something after step finish')
      })
    }
  }
}
</script>
```

## 接口

**方法：**

|  方法名   | 简介  | 参数 |
|  ----  | ----  | ---- |
| `aslFetchData` | 按当前的查询条件，刷新数据 | N/A |
| `aslUpdateQuery` | 增加或替换查询参数 | (query), query: 为一个或多个键值对, 例如 { gender: 'male', grade: 6 } |
| `aslUpdateSearch` | 用于更新搜索参数 | (keyword, debounce?), keyword为查询字符串，debounce不传则立即查询，debounce传入一个数字，则截流相应的ms数 |
| `aslUpdateSort` | 更新列表排序参数 | ({ order, prop }), order: 'desending'降序, 'asending'升序, prop: 为排序的列名, 例如 { 'desending', 'amount' } |
| `aslUpdateFilter` | 更新列表过滤参数，支持多选 | (filters), filters: 格式为 { filterName: ['value1', 'value2'] } |
| `aslUpdateTimeRange` | 更新时间段过滤参数 | (timeRange), timeRange: 格式为 [<fromDate>, <toDate>], 例如['2020-01-01', '2020-02-01'] |
