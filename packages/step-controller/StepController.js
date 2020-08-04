class Step {
  /**
   * @param {String} name step对应的唯一名称
   * @param {Vue Component} component step对应的vue compoent
   * @param {Key Pair} state step的状态
   * @param {String} title step的标题
   */
  constructor(name, component, state, title) {
    this.name = name
    this.component = component
    this.state = state || {}
    this.title = title || name
  }
  setStatus(state, override = false) {
    if (override) {
      this.state = state
    }
    this.state = { ...this.state, ...state }
    return this
  }
}

export default class StepController {
  constructor() {
    this.initialize()
  }

  // 初始化状态
  initialize() {
    this._nameStepMap = Object.create(null)
    this._stepList = []
    this._activeListners = []
    this._changeListners = []
    this._finishListners = []
    this._activeStep = null
  }

  /**
   * @param {String} name step名称, 具有唯一性
   * @param {Vue Component} component step的component
   * @param {Key Pair} state step的状态对象 (key-pair)
   */
  addStep({ name, component, state, title }) {
    const step = new Step(name, component, state, title)
    this._stepList.push(step)
    this._nameStepMap[name] = step
    this._changeListners.forEach(fn => fn())
    return this
  }

  /**
   * 把迭代直接委托给 _stepList
   */
  *[Symbol.iterator]() {
    yield* this._stepList
  }

  /**
   * 设置步骤的某一个状态,并触发相应回调
   * @param {String} name step名称
   * @param {Object} state step状态 key pair
   */
  setStepStatus(name, state) {
    const step = this._nameStepMap[name]
    if (step) {
      step.setStatus(state)
      this._changeListners.forEach(fn => fn())
    }
    return this
  }

  /**
   * 设置当前激活的步骤
   * @param {String} name 步骤名称
   */
  setActiveStep(name) {
    const step = this._nameStepMap[name]
    if (step) {
      this._activeStep = step
      this._activeListners.forEach(fn => fn(step))
    }
    return this
  }

  /**
   * 把active的步骤设置为当前active的下一步
   * 如果没有下一步则触发finish
   */
  nextStep() {
    const currentStep = this._activeStep
    const currentIdx = this._stepList.lastIndexOf(currentStep)
    if (currentIdx === -1) return
    if (currentIdx === this._stepList.length - 1) {
      this.finish()
    } else {
      const nextStep = this._stepList[currentIdx + 1]
      // 调用nextStep的话，就把下一步的dsiabled状态解除
      this.setStepStatus(nextStep.name, { disabled: false })
      this.setActiveStep(nextStep.name)
    }
  }

  /**
   * 触发监听结束事件的回调
   */
  finish() {
    this._finishListners.forEach(fn => fn())
  }

  /**
   * 增加一个监听active状态变化的回调
   * @param {function} listener 回调函数
   */
  addActiveListener(listener) {
    this._activeListners.push(listener)
    return this
  }

  /**
   * 增加一个监听state，以及增删步骤的回调
   * @param {function} listener 回调函数
   */
  onChange(listner) {
    this._changeListners.push(listner)
    return this
  }

  /**
   * 增加一个监听结束的回调
   * @param {function} listener 回调函数
   */
  onFinish(listner) {
    this._finishListners.push(listner)
    return this
  }
}
