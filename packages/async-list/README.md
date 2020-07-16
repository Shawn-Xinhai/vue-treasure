# Async List

## 介绍

Async List是用来快速获取列表数据的一个插件。由于后台返回的列表结构，分页格式，查询过滤排序往往是统一的。

我们可以通过一次性的设置，封装成一个插件，植入组件当中，就可以达到以较少的代码处理列表获取，分页，查询过滤排序。

## 安装

```js
import Vue from 'vue'
import { AslPlugin }  from 'src/packages/async-list'

Vue.use(AslPlugin, {
  /**
   * @param {String} url 列表地址
   * @param {Object} params 列表参数, 例如 { condition1: 'value1' }
   * @return {Object} 返回的一个对象，并包含 items(列表数组), total(总数), error(错误信息) 三个属性
   */
  fetcher: async (url, params) => {
    const { ok, error, data } = await get(url, params)
    if (ok) {
      const items = data.results || []
      const total = data.count || 0
      return { items, total, error: null }
    } else {
      return { error }
    }
  },
  // 设置列表查询参数名
  queryOptions: {
    searchParam: 'search', // 查询参数
    pageParam: 'page', // 页码参数
    timeFrom: 'fromDate', // 时间段开始
    timeTo: 'toDate', // 时间段结束
    debounceInterval: 600 // 查询截流
  }
})
```

`fetcher` 函数就是用来从服务器获取列表数据的。
接受`url` 和 `params`两个参数，返回一个带有items, total, error属性的对象。
items为列表数据，total为列表总长度，error是在获取列表错误时候的错误信息。

## 使用

```vue
<template>
  <div>
    <!-- 列表加载时的占位符 -->
    <div v-if="asl.isLoading">
      正在加载...
    </div>
    <div v-else>
      <ul>
        <!-- 展示列表内容 -->
        <li v-for="item in asl.items" :key="item.id">
          {{ item.value }}
        </li>
      </ul>
      <!-- 传入分页参数 -->
      <button @click="aslUpdateQuery({ page: 2 })">Page 2</button>
      <!-- 传入搜索参数 -->
      <button @click="aslUpdateSearch('keyword')">Search keyword</button>
      <!-- 传入排序参数 -->
      <button @click="aslUpdateSort({ order: 'desending', prop: 'age' })">Order by age desending</button>
      <!-- 传入过滤参数 -->
      <button @click="aslUpdateFilter({ color: ['red', 'blue', 'green'] })">Filter by color</button>
      <!-- 传入时间段参数 -->
      <button @click="aslUpdateTimeRange(['2020-01-01', '2020-02-01'])">Limit time range</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      asl: {
        /**
         * ’/api/list'列表数据：
         * [{ id: 1, value: 'item1' }, { id: 2, value: 'item2' }]
         */
        url: '/api/list'
      }
    }
  }
}
</script>
```

**基本用法**

在组件的data中设置一个 `asl`属性：`{ url: <列表地址> }`，之后插件会自动拉取数据。
获取数据之后，就可以通过 asl.items展示列表数据，asl.total列表总数，asl.isLoading列表是否正在加载。
另外，还提供一些方法进行查询参数的设置，例如：`aslUpdateQuery({ page: 2 })`, 设置`page=2`。

## 接口

**数据：**

|  属性   | 简介  | 类型 |
|  ----  | ----  | ---- |
| `asl.items` | 当前列表数据 | `Array` |
| `asl.total` | 列表总长度 | `Number` |
| `asl.error` | 获取列表错误信息 | `String` |
| `asl.isLoading` | 是否正在加载列表 | `Boolean` |

**方法：**

|  方法名   | 简介  | 参数 |
|  ----  | ----  | ---- |
| `aslFetchData` | 按当前的查询条件，刷新数据 | N/A |
| `aslUpdateQuery` | 增加或替换查询参数 | (query), query: 为一个或多个键值对, 例如 { gender: 'male', grade: 6 } |
| `aslUpdateSearch` | 用于更新搜索参数 | (keyword, debounce?), keyword为查询字符串，debounce不传则立即查询，debounce传入一个数字，则截流相应的ms数 |
| `aslUpdateSort` | 更新列表排序参数 | ({ order, prop }), order: 'desending'降序, 'asending'升序, prop: 为排序的列名, 例如 { 'desending', 'amount' } |
| `aslUpdateFilter` | 更新列表过滤参数，支持多选 | (filters), filters: 格式为 { filterName: ['value1', 'value2'] } |
| `aslUpdateTimeRange` | 更新时间段过滤参数 | (timeRange), timeRange: 格式为 [<fromDate>, <toDate>], 例如['2020-01-01', '2020-02-01'] |
