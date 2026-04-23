<template>
  <div class="login-page min-h-screen overflow-hidden px-3 py-3 sm:px-5 sm:py-5 lg:px-8 lg:py-6">
    <div class="login-page__orb login-page__orb--left"></div>
    <div class="login-page__orb login-page__orb--right"></div>
    <div class="login-page__dots" aria-hidden="true"></div>
    <div class="login-page__wave" aria-hidden="true">
      <svg viewBox="0 0 1440 560" preserveAspectRatio="none" class="h-full w-full">
        <path d="M0,384L48,362.7C96,341,192,299,288,256C384,213,480,171,576,176C672,181,768,235,864,240C960,245,1056,203,1152,165.3C1248,128,1344,96,1392,80L1440,64L1440,560L1392,560C1344,560,1248,560,1152,560C1056,560,960,560,864,560C768,560,672,560,576,560C480,560,384,560,288,560C192,560,96,560,48,560L0,560Z" fill="rgba(47, 120, 221, 0.11)"></path>
        <path d="M0,448L48,437.3C96,427,192,405,288,384C384,363,480,341,576,352C672,363,768,405,864,400C960,395,1056,341,1152,304C1248,267,1344,245,1392,234.7L1440,224L1440,560L1392,560C1344,560,1248,560,1152,560C1056,560,960,560,864,560C768,560,672,560,576,560C480,560,384,560,288,560C192,560,96,560,48,560L0,560Z" fill="rgba(23, 66, 120, 0.15)"></path>
      </svg>
    </div>

    <div class="relative z-10 mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-6xl items-center justify-center">
      <div class="login-frame login-card w-full max-w-[560px] overflow-hidden rounded-[30px] border border-[#d7e5f4] bg-white/92 shadow-[0_30px_80px_rgba(18,58,99,0.16)] backdrop-blur-sm">
        <div class="login-card__wave" aria-hidden="true">
          <div class="login-card__wave-track">
            <svg viewBox="0 0 1200 180" preserveAspectRatio="none" class="login-card__wave-svg">
              <path d="M0,100 C120,30 240,170 360,100 C480,30 600,170 720,100 C840,30 960,170 1080,100 C1140,65 1170,70 1200,100 L1200,180 L0,180 Z" fill="rgba(48,120,221,0.18)"></path>
              <path d="M0,88 C120,18 240,158 360,88 C480,18 600,158 720,88 C840,18 960,158 1080,88 C1140,53 1170,58 1200,88" fill="none" stroke="rgba(25,79,146,0.92)" stroke-width="4"></path>
              <path d="M0,105 C120,35 240,175 360,105 C480,35 600,175 720,105 C840,35 960,175 1080,105 C1140,70 1170,75 1200,105" fill="none" stroke="rgba(94,163,245,0.85)" stroke-width="2.5" stroke-dasharray="4 12"></path>
            </svg>
            <svg viewBox="0 0 1200 180" preserveAspectRatio="none" class="login-card__wave-svg" aria-hidden="true">
              <path d="M0,100 C120,30 240,170 360,100 C480,30 600,170 720,100 C840,30 960,170 1080,100 C1140,65 1170,70 1200,100 L1200,180 L0,180 Z" fill="rgba(48,120,221,0.18)"></path>
              <path d="M0,88 C120,18 240,158 360,88 C480,18 600,158 720,88 C840,18 960,158 1080,88 C1140,53 1170,58 1200,88" fill="none" stroke="rgba(25,79,146,0.92)" stroke-width="4"></path>
              <path d="M0,105 C120,35 240,175 360,105 C480,35 600,175 720,105 C840,35 960,175 1080,105 C1140,70 1170,75 1200,105" fill="none" stroke="rgba(94,163,245,0.85)" stroke-width="2.5" stroke-dasharray="4 12"></path>
            </svg>
          </div>
        </div>

        <section class="relative px-5 py-6 sm:px-7 sm:py-7 lg:px-8 lg:py-8">
          <div class="relative z-10 mx-auto w-full max-w-md">
            <div class="flex items-center justify-center">
              <div class="mobile-logo-dots mobile-logo-dots--large">
                <img class="h-9 w-auto" :src="logoUrl" alt="TERA Logo" />
              </div>
            </div>

            <div class="mt-5 text-center">
              <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2d6aaf]">TERA BPM</p>
              <h2 class="mt-2 text-[1.95rem] font-bold tracking-tight leading-tight text-[#183b63] sm:text-[2.2rem]">Sign in to continue</h2>
              <p class="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#68839f]">
                Access your work account and continue inside the TERA platform.
              </p>
            </div>

            <div class="mt-6 rounded-[26px] border border-[#dce7f3] bg-white/82 p-4 shadow-[0_18px_40px_rgba(18,58,99,0.06)] sm:p-6">
              <form @submit.prevent="LoginMethod" class="space-y-4 sm:space-y-5">
                <div>
                  <label for="email" class="mb-2 block text-sm font-semibold text-[#2f4f6f]">
                    Email Address
                  </label>
                  <div class="input-shell">
                    <div class="input-icon">
                      <i class="fas fa-envelope text-sm"></i>
                    </div>
                    <input
                      id="email"
                      v-model="email"
                      type="email"
                      autocomplete="email"
                      required
                      class="login-input"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label for="password" class="mb-2 block text-sm font-semibold text-[#2f4f6f]">
                    Password
                  </label>
                  <div class="input-shell">
                    <div class="input-icon">
                      <i class="fas fa-lock text-sm"></i>
                    </div>
                    <input
                      :type="passwordVisible ? 'text' : 'password'"
                      id="password"
                      v-model="password"
                      autocomplete="current-password"
                      required
                      class="login-input pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      @click="passwordVisible = !passwordVisible"
                      class="absolute inset-y-0 right-0 flex items-center pr-4 text-[#6b86a5] transition hover:text-[#1f5aa6]"
                    >
                      <i :class="passwordVisible ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                    </button>
                  </div>
                </div>

                <div class="flex flex-col gap-2 text-sm text-[#58718b] sm:flex-row sm:items-center sm:justify-between">
                  <label class="inline-flex items-center gap-3">
                    <input type="checkbox" class="h-4 w-4 rounded border-[#bfd5ec] text-[#2f78dd] focus:ring-[#2f78dd]/25" />
                    <span>Remember me</span>
                  </label>

                  <router-link to="/reset-password" class="font-semibold text-[#1f5aa6] transition hover:text-[#2f78dd]">
                    Forgot password?
                  </router-link>
                </div>

                <button
                  type="submit"
                  :disabled="loading"
                  class="login-submit"
                >
                  <span v-if="loading" class="inline-flex items-center gap-2">
                    <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 100 12v2a8 8 0 01-8-8z" />
                    </svg>
                    Signing in...
                  </span>
                  <span v-else class="inline-flex items-center gap-2">
                    Enter Dashboard
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              </form>
            </div>

            <div class="login-meta mt-4 flex flex-col items-center gap-2 text-center text-xs text-[#7b93aa] sm:flex-row sm:justify-center sm:gap-4">
              <p>TERA Business Processes Management System</p>
              <div class="flex items-center gap-4">
                <span>© 2026 TERA</span>
                <span>Version 1.0</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import axios from '@/axios'
import { useRouter } from 'vue-router'
import logoUrl from '@/assets/images/logo.png'

const router = useRouter()
const toast = useToast()

const email = ref('')
const password = ref('')
const passwordVisible = ref(false)
const loading = ref(false)

const LoginMethod = async () => {
  if (!email.value.trim() || !password.value) {
    toast.warning('Please enter your email and password')
    return
  }

  loading.value = true

  try {
    const response = await axios.post('/api/auth/login', {
      email: email.value.trim(),
      password: password.value
    })

    const { token, user, role_id } = response.data

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))

    localStorage.setItem('role_id', String(role_id))

    toast.success(`Welcome back, ${user.name}`)

    const roleRoutes = {
      1: '/dashboard',
      2: '/hod/dashboard',
      3: '/user/dashboard',
      4: '/tenders/dashboard',
      5: '/accountDash',
      6: '/hrDash',
      7: '/ceo/dashboard'
    }

    const route = roleRoutes[Number(role_id)]
    if (route) {
      await router.replace(route)
    } else {
      toast.error('Unknown user role')
      await router.replace('/')
    }
  } catch (err) {
    const msg = err.response?.data?.message || 'Login failed. Please check your credentials.'
    toast.error(msg)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  position: relative;
  background:
    radial-gradient(circle at 10% 14%, rgba(115, 184, 255, 0.36), transparent 24%),
    radial-gradient(circle at 86% 16%, rgba(70, 135, 240, 0.28), transparent 22%),
    radial-gradient(circle at 74% 72%, rgba(48, 196, 227, 0.16), transparent 20%),
    linear-gradient(135deg, #edf4fb 0%, #f7fbff 48%, #eaf3ff 100%);
}

.login-page__orb {
  position: absolute;
  border-radius: 9999px;
  filter: blur(28px);
  pointer-events: none;
}

.login-page__orb--left {
  left: -3rem;
  top: 3rem;
  height: 13rem;
  width: 13rem;
  background: rgba(94, 163, 245, 0.28);
}

.login-page__orb--right {
  right: -2rem;
  top: 7rem;
  height: 11rem;
  width: 11rem;
  background: rgba(62, 123, 232, 0.2);
}

.login-page__dots {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.42;
  background-image: radial-gradient(rgba(43, 116, 215, 0.85) 1px, transparent 1px);
  background-size: 18px 18px;
  mask-image: linear-gradient(135deg, transparent 8%, rgba(0, 0, 0, 0.85) 44%, transparent 84%);
}

.login-page__wave {
  position: absolute;
  inset: auto 0 0 0;
  height: min(42vh, 21rem);
  pointer-events: none;
}

.login-frame {
  position: relative;
}

.login-frame::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.68);
}

.login-card {
  position: relative;
  isolation: isolate;
}

.login-card__wave {
  position: absolute;
  left: -24%;
  right: -24%;
  top: 48%;
  z-index: 0;
  height: 11rem;
  transform: translateY(-50%) rotate(-22deg);
  opacity: 0.95;
  pointer-events: none;
}

.login-card__wave-track {
  display: flex;
  height: 100%;
  width: 200%;
  will-change: transform;
  animation: drift-wave 11s linear infinite;
}

.login-card__wave-svg {
  flex: 0 0 50%;
  height: 100%;
  width: 50%;
}

.mobile-logo-dots {
  display: flex;
  height: 3.25rem;
  width: 3.25rem;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  background-image: radial-gradient(rgba(47, 120, 221, 0.92) 1px, transparent 1px);
  background-size: 8px 8px;
}

.mobile-logo-dots--large {
  height: 4.5rem;
  width: 4.5rem;
  border-radius: 1.4rem;
  background-size: 9px 9px;
}

.input-shell {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  display: flex;
  width: 3rem;
  align-items: center;
  justify-content: center;
  color: #6b86a5;
  pointer-events: none;
}

.login-input {
  width: 100%;
  border-radius: 16px;
  border: 1px solid #d0e2f8;
  background: #f5f9ff;
  padding: 0.88rem 1rem 0.88rem 3rem;
  color: #183b63;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease;
}

.login-input::placeholder {
  color: #8aa7c5;
}

.login-input:focus {
  border-color: #2f78dd;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(47, 120, 221, 0.14);
}

.login-submit {
  display: inline-flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: linear-gradient(135deg, #194f92 0%, #2f78dd 100%);
  padding: 0.88rem 1.2rem;
  color: #ffffff;
  font-size: 0.97rem;
  font-weight: 600;
  box-shadow: 0 16px 30px rgba(35, 96, 182, 0.22);
  transition: transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease;
}

.login-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 18px 34px rgba(35, 96, 182, 0.28);
}

.login-submit:disabled {
  cursor: not-allowed;
  opacity: 0.75;
}

@media (max-width: 767px) {
  .login-frame {
    border-radius: 24px;
  }

  .login-page__wave {
    height: 13rem;
  }

  .login-card__wave {
    left: -42%;
    right: -42%;
    height: 9rem;
    transform: translateY(-50%) rotate(-26deg);
  }

  .login-meta {
    display: none;
  }
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(30, 77, 142, 0.22);
  border-radius: 9999px;
}

@media (max-width: 1023px) {
  .login-page__dots {
    mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 18%, transparent 75%);
  }

  .login-page__wave {
    height: 14rem;
  }
}

@keyframes drift-wave {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}
</style>