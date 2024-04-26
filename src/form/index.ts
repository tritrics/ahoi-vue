import Form from './Form'
import type { ApiPlugin, Object, FormOptions } from '../types'

/**
 * Factory to create a new form, returns the interface.
 */
function createUserForm(options: FormOptions = {}, fields: Object|null = null): Object {
  const form: Form = new Form(options, fields)
  return {
    fields: form.fields,
    valid: form.valid,
    processing: form.processing,
    validate: (immediate: boolean = false) => form.validate(immediate),
    data: () => form.data(),
    submit: async () => await form.submit(),
    reset: () =>form.reset(),
  }
}

/**
 * Plugin
 */
export function createForm(): ApiPlugin {
  return {
    id: 'tric-vue-form-plugin',
    name: 'form',
    export: {
      createUserForm,
    }
  }
}