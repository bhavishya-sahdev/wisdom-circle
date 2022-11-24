<template>
  <div class="flex flex-col md:flex-row h-full px-5 md:px-0">
    <SideBar class="hidden md:block basis-2/5" />

    <div class="flex justify-center my-10 md:hidden">
      <img src="~/assets/logo-mobile.png" />
    </div>

    <div
      class="md:basis-3/5 w-full h-full flex md:items-center md:justify-center"
    >
      <div v-if="!isLoggedIn" class="w-full md:w-96">
        <h1 class="text-2xl font-bold mb-0.5">Sign In to WisdomCircle</h1>

        <p class="text-neutral-gray mb-6">
          Don’t have an account?
          <span class="text-accent font-bold">Sign Up</span>
        </p>

        <form class="flex flex-col" @submit.prevent="onSubmit">
          <FormInput
            v-model="email.value"
            type="email"
            placeholder="Email or Mobile Number"
            class="mb-4"
            :error="email.error"
          />

          <FormInput
            v-model="password.value"
            type="password"
            placeholder="Password"
            class="mb-1"
            :error="password.error"
          />

          <p class="text-accent font-semibold text-sm text-right mb-6">
            Forgot password
          </p>

          <button
            class="bg-primary py-3 font-semibold text-lg rounded-md disabled:bg-primary-light"
            :disabled="
              email.value && password.value && !(email.error || password.error)
                ? false
                : true
            "
          >
            Sign In
          </button>
        </form>
      </div>
      <div v-else>
        <h1 class="text-2xl font-bold mb-0.5">
          Successfully logged in to WisdomCircle
        </h1>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { extend, validate } from 'vee-validate'
import FormInput from '~/components/FormInput.vue'

type AuthenticationResponse = {
  error: { field?: 'email' | 'password'; message: string } | null
  data: Record<any, any> | null
}

extend('required', (value: string) => {
  if (value.length > 0) return true
  return 'Required'
})

extend('emailOrPhone', (value: string) => {
  if (value.match(/\w*@\w*\.\w{1,}|^\d{10}$/)) return true
  return 'Should be a valid email or phone number'
})

export default Vue.extend({
  name: 'IndexPage',
  components: { FormInput },

  data() {
    return {
      email: { error: '', value: '' },
      password: { error: '', value: '' },
      // toggles the login form
      isLoggedIn: false,
    }
  },

  watch: {
    // validate email input on value change
    'email.value'() {
      validate(this.email.value, 'emailOrPhone').then((res) => {
        if (!res.valid) this.email.error = res.errors[0]
        else this.email.error = ''
      })
    },

    // validate password input on value change
    'password.value'() {
      validate(this.password.value, 'required').then((res) => {
        if (!res.valid) this.password.error = res.errors[0]
        else this.password.error = ''
      })
    },
  },

  methods: {
    async onSubmit() {
      if (this.email.error || this.password.error) return

      // send an object with the shape {email: string, password: string} or {phone_number: string, password: string} depending on the input regex
      const creds = {
        [this.email.value.match(/\w*@\w*\.\w{1,}/) ? 'email' : 'phone_number']:
          this.email.value,
        password: this.password.value,
      }

      try {
        const res = await this.$axios.post<AuthenticationResponse>(
          'http://localhost:4000/user/authenticate',
          creds
        )

        if (res.data.error) {
          // if the error is for either email or password field, display it
          if (res.data.error.field) {
            this[res.data.error.field].error = res.data.error.message
          }
          // otherwise throw it
          else throw new Error(res.data.error.message)
        }

        // if successful, save the token in localstorage and hide the login form
        if (res.data.data) {
          window.localStorage.setItem('token', res.data.data.token)
          this.isLoggedIn = true
        }
      } catch (e) {
        console.error(e)
      }
    },
  },
})
</script>
