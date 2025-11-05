import App from '../App.vue'
import { mount } from '@vue/test-utils'
import { it, expect, describe } from 'vitest'

describe('App', () => {
  it('mounts without router provided by stubbing RouterView', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          RouterView: true
        }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })
})
