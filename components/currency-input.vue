<template>
  <input v-model="currencyString" type="text" @blur="handleChange" />
</template>

<script>
/**
 * 这是一个用于输入金额的组件，让用户可以看到友好的金额格式
 */
export default {
  props: {
    value: {
      type: [Number, String],
      default: ''
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      currencyString: ''
    }
  },
  watch: {
    value: {
      handler: function() {
        this.currencyString = this.numToCurrency(this.value)
      },
      immediate: true,
    }
  },
  methods: {
    handleChange() {
      if (this.isNumberString(this.currencyString)) {
        this.$emit('change', this.currencyString)
        this.currencyString = this.numToCurrency(this.currencyString)
      } else {
        const num = this.currencyToNum(this.currencyString)
        this.$emit('change', num)
        if (num !== 0 && !num) {
          this.currencyString = ''
        }
      }
    },
    isNumberString(val) {
      let res = false
      if (typeof val === 'number') {
        res = true
      } else if (typeof val === 'string') {
        const numberRegex = /^[0-9][0-9.]+$/
        res = numberRegex.test(val)
      }
      return res
    },
    isCurrencyFormat(val) {
      const currencyRegex = /^₹?[0-9]{0,3}.?[0-9]{1}$/
      const res = currencyRegex.test(val)
      return res
    },
    currencyToNum(currency) {
      if (typeof currency === 'number') return currency
      if (typeof currency === 'string') {
        currency = currency.replace(/[^0-9.]/g, '')
        const num = Number.parseFloat(currency)
        return num !== num ?  '' : num
      }
      return ''
    },
    numToCurrency(num) {
      const vNum = parseFloat(num)
      // NaN !== NaN is true
      if (vNum !== vNum) {
        return ''
      }
      return vNum.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
    },
  }
}
</script>
