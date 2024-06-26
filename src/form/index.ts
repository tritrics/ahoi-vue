import Form from './Form'
import type { IApiPlugin, Object, IFormOptions } from '../types'

/**
 * Factory to create a new form, returns the interface.
 */
function createUserForm(options: IFormOptions = {}, fields: Object|null = null): Object {
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
export function createForm(): IApiPlugin {
  return {
    name: 'form',
    export: {
      createUserForm,
    }
  }
}