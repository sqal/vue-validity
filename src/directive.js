import { addClass, removeClass, getObjectByString } from './utils'

const defaultClassNames = {
  touched: 'touched', // the control has been blurred
  untouched: 'untouched', // the control hasn't been blurred
  valid: 'valid', // model is valid
  invalid: 'invalid', // model is invalid
  pristine: 'pristine', // control has not been interacted with
  dirty: 'dirty' // control has been interacted with
}

export default (inputClasses) => ({
  bind (el, binding, vnode) {
    setPristine(el, inputClasses)

    el.onfocus = () => {
      setDirty(el, inputClasses)
    }

    addClasses(el, binding, vnode, inputClasses)

    el.onblur = function () {
      const model = getValidationModel(binding, vnode)

      if (!model) {
        return
      }

      model.$validate()
    }
  },

  inserted (el, binding, vnode) {
    addClasses(el, binding, vnode, inputClasses)
  },

  update (el, binding, vnode) {
    addClasses(el, binding, vnode, inputClasses)
  }
})

function setDirty (el, classNames) {
  classNames = Object.assign({}, defaultClassNames, classNames)

  addClass(el, classNames.dirty)
  removeClass(el, classNames.pristine)
}

function setPristine (el, classNames) {
  classNames = Object.assign({}, defaultClassNames, classNames)

  addClass(el, classNames.pristine)
  removeClass(el, classNames.dirty)
}

function getValidationModel (binding, vnode) {
  if (!vnode.context.$v) {
    return
  }

  const vmodels = vnode.data.directives.filter((d) => {
    return d.name === 'model'
  })

  if (!vmodels.length) {
    console.warn('v-model must be present on element for class binding and touch to work')
    return null
  }

  const modelName = vmodels[0].expression

  return getObjectByString(vnode.context.$v, modelName)
}

function addClasses (el, binding, vnode, classNames = null) {
  classNames = Object.assign(defaultClassNames, classNames)

  const model = getValidationModel(binding, vnode)

  if (!model) {
    return
  }

  const isDirty = model.$dirty
  const isValid = !model.$invalid

  if (isDirty) {
    addClass(el, classNames.touched)
    removeClass(el, classNames.untouched)
  } else {
    addClass(el, classNames.untouched)
    removeClass(el, classNames.touched)
  }

  if (isValid) {
    addClass(el, classNames.valid)
    removeClass(el, classNames.invalid)
  } else {
    addClass(el, classNames.invalid)
    removeClass(el, classNames.valid)
  }
}
