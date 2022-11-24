<template>
  <div>
    <div class="relative">
      <input
        ref="input"
        v-model="innerValue"
        :class="`py-3 w-full px-4 border-solid border rounded-md placeholder:text-charcoal ${
          error && 'border-danger border-2 text-danger'
        }`"
        :type="type === 'email' ? 'text' : showPassword ? 'text' : type"
        :placeholder="placeholder"
      />

      <div
        v-if="type === 'password'"
        class="absolute h-full inset-y-0 right-0 mr-4 flex items-center"
        @click="updateShowPassword"
      >
        <img v-if="!showPassword" src="~/assets/eye-icon.svg" />
        <img v-else src="~/assets/hide-eye-icon.svg" />
      </div>
    </div>
    <p v-if="error" class="text-danger text-sm mt-1">{{ error }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

/**
 * Append PropType type on the provided Props type
 * Example:
 * turns {type: 'email' | 'password', placeholder: string} to {type: PropType<'email' | 'password'>, placeholder: PropType<string>}
 */
type MapProps<T extends Record<string, any>> = {
  [K in keyof T]: PropType<T[K]>
}

type Props = MapProps<{
  type: 'email' | 'password'
  handleBlur: () => {}
}>

export default defineComponent({
  name: 'FormInput',

  props: {
    // type of input (email | password)
    type: {
      type: String as Props['type'],
      required: true,
      default: 'email',
    },
    // value of the input
    value: {
      type: String,
      required: true,
      default: '',
    },
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
    error: {
      type: String,
      required: false,
      default: '',
    },
  },

  data: () => ({
    innerValue: '',
    showPassword: false,
  }),

  watch: {
    innerValue(value) {
      this.$emit('input', value)
    },
    value(val) {
      if (val !== this.innerValue) {
        this.innerValue = val
      }
    },
  },

  created() {
    if (this.value) {
      this.innerValue = this.value
    }
  },

  methods: {
    // toggle password type input's type attribute between text and password
    updateShowPassword() {
      this.showPassword = !this.showPassword
    },
  },
})
</script>
