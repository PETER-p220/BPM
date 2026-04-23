<template>
  <div class="min-h-screen bg-[#edf4fb] px-4 py-4 lg:px-5 perf-shell">
    <div class="perf-frame mx-auto flex min-h-[calc(100vh-32px)] max-w-[1580px] flex-col overflow-hidden rounded-[34px] border border-[#d9e6f3] bg-white/84 shadow-[0_28px_70px_rgba(18,58,99,0.14)] backdrop-blur-sm">

      <!-- ── Header ─────────────────────────────────────────────── -->
      <div class="relative overflow-hidden border-b border-[#dbe7f3] bg-[linear-gradient(135deg,#eef5ff_0%,#ffffff_46%,#f7fbff_100%)] px-6 py-4 lg:px-7">
        <div class="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-[#dce9fb] blur-3xl"></div>
        <div class="relative flex items-center justify-between gap-4">
          <div class="flex items-center gap-3.5">
            <div class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#194f92,#2f78dd)] text-white shadow-[0_10px_24px_rgba(35,96,182,0.22)]">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 class="text-lg font-bold tracking-tight text-[#183b63]">Team Updates</h1>
              <p class="text-[11px] text-[#67819d]">All-time performance · Mon–Fri required</p>
            </div>
          </div>
          <!-- Compact stat pills -->
          <div class="hidden gap-2.5 sm:flex">
            <div class="flex items-center gap-2 rounded-full bg-[#194f92] px-3.5 py-1.5 text-white">
              <span class="text-[10px] font-medium uppercase tracking-wide opacity-70">Team</span>
              <span class="text-sm font-bold">{{ summaryUsers.length }}</span>
            </div>
            <div class="flex items-center gap-2 rounded-full bg-emerald-600 px-3.5 py-1.5 text-white">
              <span class="text-[10px] font-medium uppercase tracking-wide opacity-70">Today</span>
              <span class="text-sm font-bold">{{ summaryUsers.filter(u => u.posted_today).length }}</span>
            </div>
            <div class="flex items-center gap-2 rounded-full bg-red-500 px-3.5 py-1.5 text-white">
              <span class="text-[10px] font-medium uppercase tracking-wide opacity-70">Missed</span>
              <span class="text-sm font-bold">{{ summaryUsers.filter(u => !u.posted_today).length }}</span>
            </div>
          </div>
        </div>

        <!-- Tab toggle -->
        <div class="relative mt-3 flex gap-1 rounded-xl bg-[#edf3fa] p-1">
          <button
            v-for="tab in ['Updates', 'Performance']" :key="tab"
            @click="activeTab = tab"
            :class="[
              'flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all',
              activeTab === tab
                ? 'bg-white text-[#183b63] shadow-sm'
                : 'text-[#67819d] hover:text-[#183b63]'
            ]"
          >{{ tab }}</button>
        </div>
      </div>

      <!-- ── Body ───────────────────────────────────────────────── -->
      <div class="flex flex-1 overflow-hidden">

        <!-- ==== UPDATES TAB (iMessage layout) ==== -->
        <template v-if="activeTab === 'Updates'">
          <!-- LEFT: Users list (grouped from feed) -->
          <div class="flex w-full flex-col border-r border-[#e6eef7] bg-[#f8fbff] lg:w-[400px] lg:flex-shrink-0">
            <div class="border-b border-[#e6eef7] px-4 py-3">
              <div class="relative">
                <svg class="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8aa0b7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input v-model="searchQuery" placeholder="Search updates…" class="w-full rounded-xl border border-[#dce7f3] bg-white py-2 pl-9 pr-3 text-[13px] text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/15" />
              </div>
            </div>
            <div class="panel-scroll flex-1 overflow-y-auto" @scroll="onFeedScroll">
              <div v-if="feedLoading && !feedMessages.length" class="space-y-1 p-2">
                <div v-for="i in 8" :key="i" class="animate-pulse rounded-2xl bg-white p-4 h-16"></div>
              </div>
              <div v-else-if="!filteredUserList.length" class="flex h-full items-center justify-center p-8">
                <p class="text-sm text-[#8aa0b7]">No updates found</p>
              </div>
              <div v-else class="p-2 space-y-1">
                <div
                  v-for="entry in filteredUserList" :key="entry.user_id"
                  @click="openUserThread(entry)"
                  :class="[
                    'group flex cursor-pointer items-start gap-3 rounded-2xl px-3 py-3 transition-all',
                    activeThreadUser?.user_id === entry.user_id
                      ? 'bg-[#2f78dd] shadow-[0_4px_16px_rgba(43,116,215,0.25)]'
                      : 'hover:bg-white hover:shadow-[0_2px_8px_rgba(18,58,99,0.06)]'
                  ]"
                >
                  <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    :style="`background:${activeThreadUser?.user_id === entry.user_id ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg,#194f92,#2f78dd)'};`">
                    {{ (entry.name || '?').charAt(0).toUpperCase() }}
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-baseline justify-between gap-2">
                      <p class="truncate text-[13px] font-semibold" :class="activeThreadUser?.user_id === entry.user_id ? 'text-white' : 'text-[#183b63]'">
                        {{ entry.name }}
                      </p>
                      <span class="flex-shrink-0 text-[10px]" :class="activeThreadUser?.user_id === entry.user_id ? 'text-white/60' : 'text-[#8aa0b7]'">
                        {{ formatShortTime(entry.latestMsg.created_at) }}
                      </span>
                    </div>
                    <p class="mt-0.5 truncate text-[12px] font-medium" :class="activeThreadUser?.user_id === entry.user_id ? 'text-white/90' : 'text-[#183b63]'">
                      {{ entry.latestMsg.title }}
                    </p>
                    <p class="mt-0.5 truncate text-[11px]" :class="activeThreadUser?.user_id === entry.user_id ? 'text-white/50' : 'text-[#8aa0b7]'">
                      {{ entry.latestMsg.description || 'No description' }}
                    </p>
                  </div>
                  <div class="flex flex-col items-center gap-1 pt-1">
                    <span class="flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold"
                      :class="activeThreadUser?.user_id === entry.user_id ? 'bg-white/20 text-white' : 'bg-[#2f78dd] text-white'">
                      {{ entry.messages.length }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-if="feedLoadingMore" class="flex justify-center py-4">
                <div class="h-5 w-5 animate-spin rounded-full border-[3px] border-[#dce9f9] border-t-[#2f78dd]"></div>
              </div>
            </div>
          </div>

          <!-- RIGHT: User conversation thread (all updates as bubbles) -->
          <div class="hidden flex-1 flex-col bg-white lg:flex">
            <div v-if="!activeThreadUser" class="flex flex-1 items-center justify-center">
              <div class="text-center">
                <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#edf4ff]">
                  <svg class="h-7 w-7 text-[#a4bee0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p class="text-sm font-semibold text-[#183b63]">Select a team member</p>
                <p class="mt-1 text-xs text-[#8aa0b7]">Choose from the list to view all their updates</p>
              </div>
            </div>
            <template v-else>
              <!-- Thread header -->
              <div class="flex items-center gap-3 border-b border-[#e6eef7] px-6 py-3.5">
                <div class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#194f92,#2f78dd)] text-sm font-bold text-white">
                  {{ (activeThreadUser.name || '?').charAt(0).toUpperCase() }}
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-semibold text-[#183b63]">{{ activeThreadUser.name }}</p>
                  <p class="text-[11px] text-[#8aa0b7]">{{ activeThreadUser.email }} · {{ activeThreadMessages.length }} updates</p>
                </div>
                <div v-if="activeUserPerf" class="flex items-center gap-2">
                  <span class="rounded-full px-2.5 py-1 text-[10px] font-bold"
                    :class="activeUserPerf.compliance_pct >= 80 ? 'bg-emerald-50 text-emerald-700' : activeUserPerf.compliance_pct >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'">
                    {{ activeUserPerf.compliance_pct }}% compliance
                  </span>
                </div>
                <button @click="activeThreadUser = null" class="rounded-lg p-1.5 text-[#8aa0b7] hover:bg-[#eef5ff] hover:text-[#183b63]">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              <!-- Scrollable conversation (all updates + their comments) -->
              <div class="panel-scroll flex-1 overflow-y-auto px-6 py-5" ref="threadRef">
                <template v-for="(msg, mIdx) in activeThreadMessages" :key="msg.chat_id">
                  <!-- Date separator between messages on different days -->
                  <div v-if="mIdx === 0 || formatDateLabel(msg.created_at) !== formatDateLabel(activeThreadMessages[mIdx - 1].created_at)"
                    class="flex items-center justify-center py-3">
                    <span class="rounded-full bg-[#dce7f3]/90 px-3 py-0.5 text-[10px] font-semibold text-[#4e6781]">{{ formatDateLabel(msg.created_at) }}</span>
                  </div>

                  <!-- The update (incoming bubble) -->
                  <div class="mb-4">
                    <div class="max-w-[85%] rounded-[20px] rounded-tl-[4px] border border-[#dce7f3] bg-[#f0f6ff] px-5 py-4">
                      <h3 class="text-[15px] font-bold text-[#183b63]">{{ msg.title }}</h3>
                      <p class="mt-2 text-sm leading-relaxed text-[#4e6781]" style="white-space:pre-line;">{{ msg.description }}</p>
                      <img v-if="msg.update_photo" :src="msg.update_photo" class="mt-3 max-h-64 w-full rounded-xl object-cover" @error="$event.target.style.display='none'" />
                      <div v-if="msg.update_file" class="mt-3">
                        <a :href="msg.update_file" target="_blank" class="inline-flex items-center gap-1.5 rounded-lg bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#2f78dd] border border-[#c3d9f5] hover:bg-white">
                          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                          Attachment
                        </a>
                      </div>
                      <p class="mt-2.5 text-[10px] text-[#8aa0b7]">{{ formatTime(msg.created_at) }}</p>
                    </div>

                    <!-- CEO comments for this specific update (outgoing bubbles) -->
                    <div v-if="msg.comments?.length" class="mt-3 space-y-2">
                      <div v-for="c in msg.comments" :key="c.id" class="flex justify-end">
                        <div class="max-w-[75%] rounded-[20px] rounded-br-[4px] bg-[linear-gradient(135deg,#194f92,#2f78dd)] px-5 py-3 text-white shadow-[0_4px_14px_rgba(35,96,182,0.18)]">
                          <p class="text-sm leading-relaxed">{{ c.comment }}</p>
                          <p class="mt-1.5 text-right text-[10px] text-white/50">{{ c.ceo_name }} · {{ formatShortTime(c.created_at) }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>

              <!-- Compose bar (comment on the latest update) -->
              <div class="border-t border-[#e6eef7] bg-[#f8fbff] px-4 py-3">
                <p class="mb-1.5 text-[10px] text-[#8aa0b7]">Replying to: {{ latestThreadMsg?.title }}</p>
                <div class="flex items-end gap-3">
                  <textarea v-model="commentText" rows="1" @keydown.enter.exact.prevent="sendComment" @input="autoGrow" ref="composeRef" placeholder="Write a comment…"
                    class="flex-1 resize-none rounded-2xl border border-[#dce7f3] bg-white px-4 py-2.5 text-sm text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/15" style="max-height:120px;"></textarea>
                  <button @click="sendComment" :disabled="commentSending || !commentText.trim()"
                    class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#194f92,#2f78dd)] text-white shadow-[0_6px_16px_rgba(35,96,182,0.22)] transition hover:brightness-105 disabled:opacity-40">
                    <svg v-if="!commentSending" class="h-4.5 w-4.5 -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <div v-else class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  </button>
                </div>
              </div>
            </template>
          </div>
        </template>

        <!-- ==== PERFORMANCE TAB ==== -->
        <template v-else>
          <!-- LEFT: User performance list -->
          <div class="flex w-full flex-col border-r border-[#e6eef7] bg-[#f8fbff] lg:w-[420px] lg:flex-shrink-0">
            <div class="border-b border-[#e6eef7] px-4 py-3">
              <div class="relative">
                <svg class="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8aa0b7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input v-model="perfSearchQuery" placeholder="Search team members…" class="w-full rounded-xl border border-[#dce7f3] bg-white py-2 pl-9 pr-3 text-[13px] text-[#183b63] outline-none focus:border-[#2f78dd] focus:ring-2 focus:ring-[#2f78dd]/15" />
              </div>
            </div>
            <div class="panel-scroll flex-1 overflow-y-auto p-2 space-y-1.5">
              <div v-if="perfLoading" class="space-y-2 p-2">
                <div v-for="i in 6" :key="i" class="animate-pulse rounded-2xl bg-white p-4 h-20"></div>
              </div>
              <div v-else-if="!filteredPerfUsers.length" class="flex h-full items-center justify-center p-8">
                <p class="text-sm text-[#8aa0b7]">No team members found</p>
              </div>
              <div
                v-for="u in filteredPerfUsers" :key="u.user_id"
                @click="selectPerfUser(u)"
                :class="[
                  'group flex cursor-pointer items-start gap-3 rounded-2xl px-4 py-3 transition-all',
                  selectedPerfUser?.user_id === u.user_id
                    ? 'bg-[#2f78dd] shadow-[0_4px_16px_rgba(43,116,215,0.25)]'
                    : 'bg-white hover:shadow-[0_2px_8px_rgba(18,58,99,0.06)]'
                ]"
              >
                <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  :style="`background:${selectedPerfUser?.user_id === u.user_id ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg,#194f92,#2f78dd)'};`">
                  {{ u.name.charAt(0).toUpperCase() }}
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between gap-2">
                    <p class="truncate text-[13px] font-semibold" :class="selectedPerfUser?.user_id === u.user_id ? 'text-white' : 'text-[#183b63]'">
                      {{ u.name }}
                    </p>
                    <span class="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
                      :class="complianceClass(u, selectedPerfUser?.user_id === u.user_id)">
                      {{ u.compliance_pct }}%
                    </span>
                  </div>
                  <div class="mt-1.5 flex items-center gap-3">
                    <span class="text-[11px]" :class="selectedPerfUser?.user_id === u.user_id ? 'text-white/60' : 'text-[#8aa0b7]'">
                      {{ u.total_updates }} updates
                    </span>
                    <span class="text-[11px]" :class="selectedPerfUser?.user_id === u.user_id ? 'text-white/60' : 'text-[#8aa0b7]'">
                      {{ u.active_days }}/{{ u.working_days_total }} days
                    </span>
                    <span class="text-[11px]" :class="u.posted_today ? (selectedPerfUser?.user_id === u.user_id ? 'text-emerald-200' : 'text-emerald-600') : (selectedPerfUser?.user_id === u.user_id ? 'text-red-200' : 'text-red-500')">
                      {{ u.posted_today ? '✓ Today' : '✗ Missed today' }}
                    </span>
                  </div>
                  <!-- Mini inline bar showing compliance -->
                  <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full" :class="selectedPerfUser?.user_id === u.user_id ? 'bg-white/15' : 'bg-[#e6eef7]'">
                    <div class="h-full rounded-full transition-all" :style="`width:${Math.min(u.compliance_pct, 100)}%`"
                      :class="u.compliance_pct >= 80 ? 'bg-emerald-500' : u.compliance_pct >= 50 ? 'bg-amber-400' : 'bg-red-500'"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT: Weekly performance chart -->
          <div class="hidden flex-1 flex-col bg-white lg:flex">
            <div v-if="!selectedPerfUser" class="flex flex-1 items-center justify-center">
              <div class="text-center">
                <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#edf4ff]">
                  <svg class="h-7 w-7 text-[#a4bee0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p class="text-sm font-semibold text-[#183b63]">Select a team member</p>
                <p class="mt-1 text-xs text-[#8aa0b7]">Choose from the list to view their weekly performance</p>
              </div>
            </div>
            <template v-else>
              <!-- User detail header -->
              <div class="flex items-center gap-3 border-b border-[#e6eef7] px-6 py-4">
                <div class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#194f92,#2f78dd)] text-sm font-bold text-white">
                  {{ selectedPerfUser.name.charAt(0).toUpperCase() }}
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-[15px] font-bold text-[#183b63]">{{ selectedPerfUser.name }}</p>
                  <p class="text-[11px] text-[#8aa0b7]">{{ selectedPerfUser.email }} · Since {{ selectedPerfUser.first_update_date || 'N/A' }}</p>
                </div>
                <button @click="selectedPerfUser = null" class="rounded-lg p-1.5 text-[#8aa0b7] hover:bg-[#eef5ff] hover:text-[#183b63]">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              <div class="panel-scroll flex-1 overflow-y-auto px-6 py-5">
                <!-- Stats cards row -->
                <div class="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  <div class="rounded-2xl border border-[#dce7f3] bg-[#f8fbff] p-4 text-center">
                    <p class="text-2xl font-bold text-[#183b63]">{{ selectedPerfUser.compliance_pct }}%</p>
                    <p class="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#8aa0b7]">Compliance</p>
                  </div>
                  <div class="rounded-2xl border border-[#dce7f3] bg-[#f8fbff] p-4 text-center">
                    <p class="text-2xl font-bold text-[#183b63]">{{ selectedPerfUser.total_updates }}</p>
                    <p class="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#8aa0b7]">Total Updates</p>
                  </div>
                  <div class="rounded-2xl border border-[#dce7f3] bg-[#f8fbff] p-4 text-center">
                    <p class="text-2xl font-bold text-[#183b63]">{{ selectedPerfUser.avg_per_day }}</p>
                    <p class="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#8aa0b7]">Avg / Day</p>
                  </div>
                  <div class="rounded-2xl border border-[#dce7f3] bg-[#f8fbff] p-4 text-center">
                    <p class="text-2xl font-bold" :class="selectedPerfUser.missed_this_week > 0 ? 'text-red-500' : 'text-emerald-600'">{{ selectedPerfUser.missed_this_week }}</p>
                    <p class="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#8aa0b7]">Missed This Week</p>
                  </div>
                </div>

                <!-- Weekly chart -->
                <div class="rounded-2xl border border-[#dce7f3] bg-[#f8fbff] p-5">
                  <h3 class="mb-4 text-sm font-bold text-[#183b63]">Weekly Performance (Last 8 Weeks)</h3>

                  <div v-if="weeklyChartLoading" class="flex items-center justify-center py-12">
                    <div class="h-6 w-6 animate-spin rounded-full border-[3px] border-[#dce9f9] border-t-[#2f78dd]"></div>
                  </div>
                  <div v-else-if="!weeklyChartData.length" class="py-12 text-center text-sm text-[#8aa0b7]">No data available</div>
                  <div v-else>
                    <!-- SVG Bar Chart -->
                    <div class="relative">
                      <svg :viewBox="`0 0 ${chartWidth} ${chartHeight + 40}`" class="w-full" preserveAspectRatio="xMidYMid meet">
                        <!-- Grid lines -->
                        <line v-for="i in 5" :key="'g'+i"
                          :x1="chartPad" :x2="chartWidth - 10"
                          :y1="chartPad + (chartInner / 5) * (i - 1)" :y2="chartPad + (chartInner / 5) * (i - 1)"
                          stroke="#e6eef7" stroke-width="1" />
                        <!-- Y-axis labels -->
                        <text v-for="i in 5" :key="'y'+i"
                          :x="chartPad - 6" :y="chartPad + (chartInner / 5) * (i - 1) + 4"
                          text-anchor="end" class="fill-[#8aa0b7]" font-size="10">
                          {{ Math.round(100 - (i - 1) * 20) }}%
                        </text>
                        <!-- Bars -->
                        <g v-for="(w, idx) in weeklyChartData" :key="idx">
                          <!-- Background bar (working days capacity) -->
                          <rect
                            :x="barX(idx)" :y="chartPad"
                            :width="barWidth" :height="chartInner"
                            rx="6" fill="#eef3fa" />
                          <!-- Compliance bar -->
                          <rect
                            :x="barX(idx)" :y="chartPad + chartInner - (chartInner * w.compliance_pct / 100)"
                            :width="barWidth" :height="chartInner * w.compliance_pct / 100"
                            rx="6"
                            :fill="w.compliance_pct >= 80 ? '#10b981' : w.compliance_pct >= 50 ? '#f59e0b' : '#ef4444'" />
                          <!-- Percentage label on bar -->
                          <text
                            :x="barX(idx) + barWidth / 2"
                            :y="chartPad + chartInner - (chartInner * w.compliance_pct / 100) - 6"
                            text-anchor="middle" font-size="10" font-weight="700"
                            :fill="w.compliance_pct >= 80 ? '#10b981' : w.compliance_pct >= 50 ? '#f59e0b' : '#ef4444'">
                            {{ w.compliance_pct }}%
                          </text>
                          <!-- Week label -->
                          <text
                            :x="barX(idx) + barWidth / 2"
                            :y="chartPad + chartInner + 16"
                            text-anchor="middle" font-size="10" class="fill-[#67819d]">
                            {{ w.week_label }}
                          </text>
                          <!-- Active/total days -->
                          <text
                            :x="barX(idx) + barWidth / 2"
                            :y="chartPad + chartInner + 30"
                            text-anchor="middle" font-size="9" class="fill-[#a4bee0]">
                            {{ w.active_days }}/{{ w.working_days }}d
                          </text>
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>

    <!-- Mobile detail overlay (Updates tab) -->
    <Teleport to="body">
      <Transition name="slide-up">
        <div v-if="activeTab === 'Updates' && activeThreadUser && isMobileDetail" class="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
          <div class="flex items-center gap-3 border-b border-[#e6eef7] px-4 py-3">
            <button @click="activeThreadUser = null" class="rounded-lg p-1 text-[#2f78dd]">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#194f92,#2f78dd)] text-xs font-bold text-white">
              {{ (activeThreadUser.name || '?').charAt(0).toUpperCase() }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-[#183b63]">{{ activeThreadUser.name }}</p>
              <p class="text-[10px] text-[#8aa0b7]">{{ activeThreadMessages.length }} updates</p>
            </div>
          </div>
          <div class="panel-scroll flex-1 overflow-y-auto px-4 py-4">
            <template v-for="(msg, mIdx) in activeThreadMessages" :key="msg.chat_id">
              <div v-if="mIdx === 0 || formatDateLabel(msg.created_at) !== formatDateLabel(activeThreadMessages[mIdx - 1].created_at)"
                class="flex items-center justify-center py-2">
                <span class="rounded-full bg-[#dce7f3]/90 px-3 py-0.5 text-[10px] font-semibold text-[#4e6781]">{{ formatDateLabel(msg.created_at) }}</span>
              </div>
              <div class="mb-4">
                <div class="rounded-[20px] rounded-tl-[4px] border border-[#dce7f3] bg-[#f0f6ff] px-4 py-3">
                  <h3 class="text-[14px] font-bold text-[#183b63]">{{ msg.title }}</h3>
                  <p class="mt-1.5 text-[13px] leading-relaxed text-[#4e6781]" style="white-space:pre-line;">{{ msg.description }}</p>
                  <img v-if="msg.update_photo" :src="msg.update_photo" class="mt-2 max-h-48 w-full rounded-xl object-cover" @error="$event.target.style.display='none'" />
                  <p class="mt-2 text-[10px] text-[#8aa0b7]">{{ formatTime(msg.created_at) }}</p>
                </div>
                <div v-if="msg.comments?.length" class="mt-2 space-y-2">
                  <div v-for="c in msg.comments" :key="c.id" class="flex justify-end">
                    <div class="max-w-[80%] rounded-[18px] rounded-br-[4px] bg-[linear-gradient(135deg,#194f92,#2f78dd)] px-4 py-2.5 text-white">
                      <p class="text-[13px] leading-relaxed">{{ c.comment }}</p>
                      <p class="mt-1 text-right text-[10px] text-white/50">{{ formatShortTime(c.created_at) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div class="border-t border-[#e6eef7] bg-[#f8fbff] px-3 py-2.5 safe-bottom">
            <p class="mb-1 text-[9px] text-[#8aa0b7]">Replying to: {{ latestThreadMsg?.title }}</p>
            <div class="flex items-end gap-2">
              <textarea v-model="commentText" rows="1" @keydown.enter.exact.prevent="sendComment" placeholder="Comment…"
                class="flex-1 resize-none rounded-2xl border border-[#dce7f3] bg-white px-3.5 py-2 text-[13px] text-[#183b63] outline-none focus:border-[#2f78dd]" style="max-height:100px;"></textarea>
              <button @click="sendComment" :disabled="commentSending || !commentText.trim()"
                class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#194f92,#2f78dd)] text-white disabled:opacity-40">
                <svg v-if="!commentSending" class="h-4 w-4 -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                <div v-else class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Mobile performance detail overlay -->
    <Teleport to="body">
      <Transition name="slide-up">
        <div v-if="activeTab === 'Performance' && selectedPerfUser && isMobileDetail" class="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
          <div class="flex items-center gap-3 border-b border-[#e6eef7] px-4 py-3">
            <button @click="selectedPerfUser = null" class="rounded-lg p-1 text-[#2f78dd]">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#194f92,#2f78dd)] text-xs font-bold text-white">
              {{ selectedPerfUser.name.charAt(0).toUpperCase() }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-[#183b63]">{{ selectedPerfUser.name }}</p>
            </div>
          </div>
          <div class="panel-scroll flex-1 overflow-y-auto px-4 py-4">
            <div class="mb-4 grid grid-cols-2 gap-2">
              <div class="rounded-xl border border-[#dce7f3] bg-[#f8fbff] p-3 text-center">
                <p class="text-xl font-bold text-[#183b63]">{{ selectedPerfUser.compliance_pct }}%</p>
                <p class="text-[9px] font-semibold uppercase text-[#8aa0b7]">Compliance</p>
              </div>
              <div class="rounded-xl border border-[#dce7f3] bg-[#f8fbff] p-3 text-center">
                <p class="text-xl font-bold text-[#183b63]">{{ selectedPerfUser.total_updates }}</p>
                <p class="text-[9px] font-semibold uppercase text-[#8aa0b7]">Updates</p>
              </div>
              <div class="rounded-xl border border-[#dce7f3] bg-[#f8fbff] p-3 text-center">
                <p class="text-xl font-bold text-[#183b63]">{{ selectedPerfUser.avg_per_day }}</p>
                <p class="text-[9px] font-semibold uppercase text-[#8aa0b7]">Avg / Day</p>
              </div>
              <div class="rounded-xl border border-[#dce7f3] bg-[#f8fbff] p-3 text-center">
                <p class="text-xl font-bold" :class="selectedPerfUser.missed_this_week > 0 ? 'text-red-500' : 'text-emerald-600'">{{ selectedPerfUser.missed_this_week }}</p>
                <p class="text-[9px] font-semibold uppercase text-[#8aa0b7]">Missed Week</p>
              </div>
            </div>
            <div class="rounded-xl border border-[#dce7f3] bg-[#f8fbff] p-4">
              <h3 class="mb-3 text-sm font-bold text-[#183b63]">Weekly Performance</h3>
              <div v-if="weeklyChartLoading" class="flex items-center justify-center py-8">
                <div class="h-5 w-5 animate-spin rounded-full border-[3px] border-[#dce9f9] border-t-[#2f78dd]"></div>
              </div>
              <div v-else class="space-y-2">
                <div v-for="w in weeklyChartData" :key="w.week_start" class="flex items-center gap-3">
                  <span class="w-12 text-[10px] text-[#67819d]">{{ w.week_label }}</span>
                  <div class="flex-1 h-5 rounded-full bg-[#e6eef7] overflow-hidden">
                    <div class="h-full rounded-full transition-all" :style="`width:${Math.min(w.compliance_pct, 100)}%`"
                      :class="w.compliance_pct >= 80 ? 'bg-emerald-500' : w.compliance_pct >= 50 ? 'bg-amber-400' : 'bg-red-500'"></div>
                  </div>
                  <span class="w-8 text-right text-[10px] font-bold" :class="w.compliance_pct >= 80 ? 'text-emerald-600' : w.compliance_pct >= 50 ? 'text-amber-600' : 'text-red-500'">{{ w.compliance_pct }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { optimizedRequest, clearCache } from '@/utils/api';
import axios from '@/axios';

const toast = useToast();

// ── Tab ──
const activeTab = ref('Updates');

// ── Performance summary ──
const summaryUsers = ref([]);
const perfLoading = ref(true);
const perfSearchQuery = ref('');
const selectedPerfUser = ref(null);

// ── Weekly chart ──
const weeklyChartData = ref([]);
const weeklyChartLoading = ref(false);

// Chart dimensions
const chartWidth = 560;
const chartHeight = 220;
const chartPad = 40;
const chartInner = chartHeight - chartPad;
const barGap = 12;
const barWidth = computed(() => {
  const count = weeklyChartData.value.length || 8;
  return Math.max(20, (chartWidth - chartPad - 10 - barGap * (count + 1)) / count);
});

function barX(idx) {
  return chartPad + barGap + idx * (barWidth.value + barGap);
}

// ── Feed ──
const feedMessages = ref([]);
const feedLoading = ref(true);
const feedLoadingMore = ref(false);
const feedPage = ref(1);
const feedHasMore = ref(false);
const searchQuery = ref('');

// ── Detail (user thread) ──
const activeThreadUser = ref(null);
const commentText = ref('');
const commentSending = ref(false);
const threadRef = ref(null);
const composeRef = ref(null);

const isMobileDetail = computed(() => typeof window !== 'undefined' && window.innerWidth < 1024);

// ── Computed: group feed messages by user ──
const userList = computed(() => {
  const map = {};
  for (const msg of feedMessages.value) {
    const uid = msg.user?.user_id;
    if (!uid) continue;
    if (!map[uid]) {
      map[uid] = {
        user_id: uid,
        name: msg.user.name || 'Unknown',
        email: msg.user.email || '',
        messages: [],
        latestMsg: msg,
      };
    }
    map[uid].messages.push(msg);
    // Keep latestMsg pointing to the newest
    if (new Date(msg.created_at) > new Date(map[uid].latestMsg.created_at)) {
      map[uid].latestMsg = msg;
    }
  }
  // Sort by latest message time desc
  return Object.values(map).sort((a, b) => new Date(b.latestMsg.created_at) - new Date(a.latestMsg.created_at));
});

const filteredUserList = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return userList.value;
  return userList.value.filter(e =>
    e.name.toLowerCase().includes(q) ||
    e.messages.some(m => (m.title || '').toLowerCase().includes(q) || (m.description || '').toLowerCase().includes(q))
  );
});

const activeThreadMessages = computed(() => {
  if (!activeThreadUser.value) return [];
  const uid = activeThreadUser.value.user_id;
  return feedMessages.value
    .filter(m => m.user?.user_id === uid)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
});

const latestThreadMsg = computed(() => {
  const msgs = activeThreadMessages.value;
  return msgs.length ? msgs[msgs.length - 1] : null;
});

const activeUserPerf = computed(() => {
  if (!activeThreadUser.value) return null;
  return summaryUsers.value.find(u => u.user_id === activeThreadUser.value.user_id) || null;
});

const filteredPerfUsers = computed(() => {
  const q = perfSearchQuery.value.toLowerCase().trim();
  const list = summaryUsers.value;
  if (!q) return list;
  return list.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
});

// ── Lifecycle ──
onMounted(async () => {
  await Promise.all([fetchPerformance(), fetchFeed()]);
});

// Watch for perf user selection
watch(selectedPerfUser, (u) => {
  if (u) fetchWeeklyChart(u.user_id);
});

// ── Data fetching ──
async function fetchPerformance() {
  perfLoading.value = true;
  try {
    const data = await optimizedRequest('/api/ceo/updates/performance', { skipCache: true });
    summaryUsers.value = (data.data || []).sort((a, b) => a.name.localeCompare(b.name));
  } catch (e) {
    console.error('Performance fetch error', e);
  } finally {
    perfLoading.value = false;
  }
}

async function fetchFeed(page = 1) {
  if (page === 1) feedLoading.value = true;
  else feedLoadingMore.value = true;
  try {
    const data = await optimizedRequest(`/api/ceo/updates/feed?per_page=30&page=${page}`, { skipCache: true });
    const items = data.data || [];
    if (page === 1) {
      feedMessages.value = items;
    } else {
      feedMessages.value.push(...items);
    }
    feedPage.value = page;
    feedHasMore.value = data.pagination?.has_more || false;
  } catch (e) {
    console.error('Feed fetch error', e);
    toast.error('Failed to load updates feed');
  } finally {
    feedLoading.value = false;
    feedLoadingMore.value = false;
  }
}

async function fetchWeeklyChart(userId) {
  weeklyChartLoading.value = true;
  weeklyChartData.value = [];
  try {
    const data = await optimizedRequest(`/api/ceo/updates/weekly-chart?user_id=${userId}`, { skipCache: true });
    weeklyChartData.value = data.data || [];
  } catch (e) {
    console.error('Weekly chart error', e);
  } finally {
    weeklyChartLoading.value = false;
  }
}

function onFeedScroll(e) {
  const el = e.target;
  if (feedLoadingMore.value || !feedHasMore.value) return;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
    fetchFeed(feedPage.value + 1);
  }
}

// ── Interaction ──
function openUserThread(entry) {
  activeThreadUser.value = { user_id: entry.user_id, name: entry.name, email: entry.email };
  commentText.value = '';
  nextTick(() => {
    if (threadRef.value) threadRef.value.scrollTop = threadRef.value.scrollHeight;
  });
}

function selectPerfUser(u) {
  selectedPerfUser.value = u;
}

async function sendComment() {
  const target = latestThreadMsg.value;
  if (!commentText.value.trim() || !target) return;
  commentSending.value = true;
  try {
    await axios.post('/api/updates/ceo-comment', {
      chat_id: target.chat_id,
      comment: commentText.value.trim(),
    });
    const newComment = {
      id: Date.now(),
      comment: commentText.value.trim(),
      ceo_name: 'You',
      created_at: new Date().toISOString(),
    };
    if (!target.comments) target.comments = [];
    target.comments.push(newComment);
    commentText.value = '';
    nextTick(() => {
      if (threadRef.value) threadRef.value.scrollTop = threadRef.value.scrollHeight;
      if (composeRef.value) composeRef.value.style.height = 'auto';
    });
    toast.success('Comment sent');
  } catch (e) {
    toast.error('Failed to send comment');
  } finally {
    commentSending.value = false;
  }
}

function autoGrow(e) {
  const el = e.target;
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

// ── Helpers ──
function complianceClass(u, isSelected) {
  if (isSelected) return u.compliance_pct >= 80 ? 'bg-emerald-400/20 text-emerald-100' : u.compliance_pct >= 50 ? 'bg-amber-400/20 text-amber-100' : 'bg-red-400/20 text-red-100';
  return u.compliance_pct >= 80 ? 'bg-emerald-50 text-emerald-700' : u.compliance_pct >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700';
}

function formatDateLabel(dt) {
  if (!dt) return '';
  const d = new Date(dt);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = (today - date) / 86400000;
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return d.toLocaleDateString('en-GB', { weekday: 'long' });
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatShortTime(dt) {
  if (!dt) return '';
  return new Date(dt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function formatTime(dt) {
  if (!dt) return '';
  return new Date(dt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
</script>

<style scoped>
.perf-shell {
  background:
    radial-gradient(circle at top right, rgba(48, 120, 221, 0.08), transparent 22%),
    linear-gradient(180deg, #eff5fb 0%, #eaf1f8 100%);
}
.panel-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(43, 116, 215, 0.24) transparent;
}
.panel-scroll::-webkit-scrollbar { width: 6px; }
.panel-scroll::-webkit-scrollbar-track { background: transparent; }
.panel-scroll::-webkit-scrollbar-thumb { background: rgba(43, 116, 215, 0.18); border-radius: 9999px; }

.safe-bottom { padding-bottom: env(safe-area-inset-bottom, 8px); }

.slide-up-enter-active,
.slide-up-leave-active { transition: transform 0.3s ease; }
.slide-up-enter-from,
.slide-up-leave-to { transform: translateY(100%); }
</style>
