<template>
  <div style="font-family:'DM Sans',sans-serif;">

    <!-- ── Compact Header ─────────────────────────────────────────── -->
    <div class="sticky top-0 z-10 border-b border-[#dce7f3]" style="background:linear-gradient(135deg,#eef5ff 0%,#fff 46%,#f7fbff 100%);">
      <div class="mx-auto flex items-center justify-between px-5 py-3" style="max-width:1280px;">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl" style="background:linear-gradient(135deg,#194f92,#2f78dd);">
            <i class="fas fa-clipboard-list text-white text-sm"></i>
          </div>
          <div>
            <h1 class="text-base font-bold leading-tight" style="color:#183b63;">My Updates</h1>
            <p class="text-[11px]" style="color:#7a93af;">Performance & activity tracker</p>
          </div>
        </div>
        <button @click="openAddModal"
          class="inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
          style="background:linear-gradient(135deg,#194f92,#2f78dd);box-shadow:0 6px 16px rgba(35,96,182,0.22);">
          <i class="fas fa-plus text-xs"></i> Post Update
        </button>
      </div>
    </div>

    <!-- ── Main Content ───────────────────────────────────────────── -->
    <div class="mx-auto px-5 py-5" style="max-width:1280px;">

      <!-- ═══ ROW 1: Performance bar + 3 stat pills ═══════════════ -->
      <div class="mb-5 grid grid-cols-12 gap-3">

        <!-- Performance Rate — wide hero card -->
        <div class="col-span-12 lg:col-span-5 relative overflow-hidden rounded-2xl border border-[#d0e2f8] bg-white px-5 py-4" style="box-shadow:0 4px 24px rgba(18,58,99,0.07);">
          <div class="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full" style="background:radial-gradient(circle,rgba(47,120,221,0.08),transparent 70%);"></div>
          <div class="flex items-center gap-4">
            <!-- Circular gauge -->
            <div class="relative flex-shrink-0" style="width:72px;height:72px;">
              <svg viewBox="0 0 36 36" class="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e8f0fb" stroke-width="3"/>
                <circle cx="18" cy="18" r="15.5" fill="none" stroke-width="3" stroke-linecap="round"
                  :stroke-dasharray="97.4"
                  :stroke-dashoffset="heatmapLoading ? 97.4 : 97.4 - (97.4 * performanceStats.rate / 100)"
                  :style="`stroke:${performanceStats.rate >= 70 ? '#2f78dd' : performanceStats.rate >= 40 ? '#d97706' : '#dc2626'};transition:stroke-dashoffset 1s ease;`"/>
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span v-if="heatmapLoading" class="h-4 w-4 animate-spin rounded-full border-2 border-[#dce9f9] border-t-[#2f78dd]"></span>
                <span v-else class="text-base font-bold" style="color:#183b63;">{{ performanceStats.rate }}%</span>
              </div>
            </div>
            <div class="min-w-0">
              <p class="text-sm font-bold" style="color:#183b63;">Performance Rate</p>
              <p class="text-[11px] mt-0.5" style="color:#7a93af;">{{ performanceStats.active }}/{{ performanceStats.working }} working days covered</p>
              <div class="mt-2 flex items-center gap-1.5">
                <span class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold"
                  :style="performanceStats.rate >= 70 ? 'background:#edf7ed;color:#16a34a;' : performanceStats.rate >= 40 ? 'background:#fef9ec;color:#d97706;' : 'background:#fef2f2;color:#dc2626;'">
                  <i :class="performanceStats.rate >= 70 ? 'fas fa-arrow-up' : performanceStats.rate >= 40 ? 'fas fa-minus' : 'fas fa-arrow-down'" style="font-size:8px;"></i>
                  {{ performanceStats.rate >= 70 ? 'Good' : performanceStats.rate >= 40 ? 'Average' : 'Low' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 3 compact stat pills -->
        <div class="col-span-12 lg:col-span-7 grid grid-cols-3 gap-3">

          <!-- Updates Made -->
          <div class="flex items-center gap-3 rounded-2xl border border-[#d0e2f8] bg-white px-4 py-3" style="box-shadow:0 4px 24px rgba(18,58,99,0.07);">
            <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl" style="background:#deebfd;">
              <svg class="h-4.5 w-4.5" style="color:#174278;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <div class="min-w-0">
              <p class="text-2xl font-bold leading-none" style="color:#183b63;">{{ isLoading ? '–' : updates.length }}</p>
              <p class="text-[11px] font-medium mt-0.5" style="color:#67819d;">Updates</p>
            </div>
          </div>

          <!-- Missed Days -->
          <div class="flex items-center gap-3 rounded-2xl border border-[#fce4e4] bg-white px-4 py-3" style="box-shadow:0 4px 24px rgba(18,58,99,0.07);">
            <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl" style="background:#fef2f2;">
              <svg class="h-4.5 w-4.5" style="color:#dc2626;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div class="min-w-0">
              <p class="text-2xl font-bold leading-none" style="color:#183b63;">{{ heatmapLoading ? '–' : performanceStats.missed }}</p>
              <p class="text-[11px] font-medium mt-0.5" style="color:#67819d;">Missed this week</p>
            </div>
          </div>

          <!-- Latest -->
          <div class="flex items-center gap-3 rounded-2xl border border-[#d0e2f8] bg-white px-4 py-3" style="box-shadow:0 4px 24px rgba(18,58,99,0.07);">
            <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl" style="background:#edf4fb;">
              <svg class="h-4.5 w-4.5" style="color:#2f78dd;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <div class="min-w-0">
              <p class="text-sm font-bold leading-tight truncate" style="color:#183b63;">{{ latestUpdateLabel }}</p>
              <p class="text-[11px] font-medium mt-0.5" style="color:#67819d;">Latest</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ ROW 2: Heatmap + Recent Updates side by side ════════ -->
      <div class="grid grid-cols-12 gap-4">

        <!-- Heatmap — left -->
        <div class="col-span-12 xl:col-span-7 rounded-2xl border border-[#dce7f3] bg-white p-4" style="box-shadow:0 4px 24px rgba(18,58,99,0.07);">
          <div class="mb-3 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="flex h-8 w-8 items-center justify-center rounded-[10px]" style="background:#deebfd;">
                <svg class="h-3.5 w-3.5" style="color:#174278;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
              </div>
              <div>
                <h3 class="text-xs font-bold" style="color:#183b63;">Update Activity</h3>
                <p class="text-[10px]" style="color:#8aa7c5;">{{ heatmapStart }} → {{ heatmapEnd }} · click to view</p>
              </div>
            </div>
          </div>
          <div v-if="heatmapLoading" class="flex h-16 items-center justify-center">
            <div class="h-5 w-5 animate-spin rounded-full border-[3px] border-[#dce9f9] border-t-[#2f78dd]"></div>
          </div>
          <UpdatesHeatmap v-else :data="heatmapData" :start-date="heatmapStart" :end-date="heatmapEnd"
            :selected-day="heatmapSelectedDay" @day-click="onHeatmapDayClick"/>
          <!-- Day detail -->
          <div v-if="heatmapSelectedDay" class="mt-3 rounded-xl border border-[#c8daf0] bg-[#f3f8ff] p-3">
            <div class="mb-1.5 flex items-center justify-between">
              <p class="text-[11px] font-bold text-[#1f5aa6]">{{ formatHeatmapDate(heatmapSelectedDay) }}</p>
              <button @click="heatmapSelectedDay = null; dayDetail = []" class="text-[10px] text-[#7a93af] hover:text-[#183b63]">✕</button>
            </div>
            <div v-if="dayDetailLoading" class="text-xs text-[#8aa0b7]">Loading…</div>
            <div v-else-if="!dayDetail.length" class="text-xs text-[#8aa0b7]">No updates on this day.</div>
            <div v-else class="space-y-1.5 max-h-40 overflow-y-auto">
              <div v-for="u in dayDetail" :key="u.chat_id" class="rounded-lg bg-white px-3 py-2 border border-[#d6e4f2]">
                <p class="font-semibold text-[#183b63] text-xs">{{ u.title }}</p>
                <p v-if="u.description" class="mt-0.5 text-[11px] text-[#4e6781] line-clamp-2">{{ u.description }}</p>
                <p class="mt-0.5 text-[10px] text-[#8aa0b7]">{{ formatTime(u.created_at) }}</p>
                <div v-if="u.comments && u.comments.length" class="mt-1.5 space-y-1 border-t border-[#e8f0f8] pt-1.5">
                  <div v-for="c in u.comments" :key="c.id" class="rounded-md bg-[#edf4ff] px-2 py-1">
                    <p class="text-[10px] text-[#183b63]"><span class="font-semibold text-[#2d6aaf]">{{ c.ceo_name }}:</span> {{ c.comment }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Updates — right -->
        <div class="col-span-12 xl:col-span-5 rounded-2xl border border-[#dce7f3] bg-white p-4" style="box-shadow:0 4px 24px rgba(18,58,99,0.07);">
          <div class="mb-3 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="flex h-8 w-8 items-center justify-center rounded-[10px]" style="background:linear-gradient(135deg,#194f92,#2f78dd);">
                <i class="fas fa-list-ul text-white text-xs"></i>
              </div>
              <h3 class="text-xs font-bold" style="color:#183b63;">Recent Updates</h3>
            </div>
            <button v-if="updates.length > 5" @click="showAllUpdates = !showAllUpdates"
              class="text-[11px] font-semibold text-[#2f78dd] hover:text-[#194f92] transition-colors">
              {{ showAllUpdates ? 'Show less' : 'View all ' + updates.length }}
            </button>
          </div>

          <!-- Loading -->
          <div v-if="isLoading" class="flex items-center justify-center py-10">
            <div class="h-6 w-6 animate-spin rounded-full border-[3px] border-[#dce9f9] border-t-[#2f78dd]"></div>
          </div>

          <!-- Empty -->
          <div v-else-if="updates.length === 0" class="flex flex-col items-center justify-center py-10">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl mb-3" style="background:#edf4fb;">
              <i class="fas fa-inbox text-xl" style="color:#a4b8cf;"></i>
            </div>
            <p class="text-sm font-semibold mb-1" style="color:#183b63;">No Updates Yet</p>
            <p class="text-xs mb-4" style="color:#7a93af;">Create your first project update</p>
            <button @click="openAddModal" class="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white"
              style="background:linear-gradient(135deg,#194f92,#2f78dd);">
              <i class="fas fa-plus" style="font-size:9px;"></i> Create Update
            </button>
          </div>

          <!-- Update list (compact rows) -->
          <div v-else class="space-y-1.5 overflow-y-auto" :style="showAllUpdates ? 'max-height:480px;' : 'max-height:380px;'">
            <div v-for="(update, index) in showAllUpdates ? updates : recentUpdates"
              :key="index"
              class="group flex items-start gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-all hover:bg-[#f5f9ff]"
              style="border:1px solid transparent;"
              @mouseenter="$event.currentTarget.style.borderColor='#dce7f3'"
              @mouseleave="$event.currentTarget.style.borderColor='transparent'"
              @click="viewUpdateDetails(update.chat_id)">
              <!-- Thumbnail / icon -->
              <div class="relative flex-shrink-0 h-11 w-11 rounded-xl overflow-hidden bg-[#f3f8ff]">
                <img v-if="update.update_photo" :src="update.update_photo" class="h-full w-full object-cover" @error="handleImageError"/>
                <div v-else class="flex h-full w-full items-center justify-center">
                  <i class="fas fa-file-alt text-sm" style="color:#c5d8ef;"></i>
                </div>
                <span v-if="update.update_file" class="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#2f78dd]">
                  <i class="fas fa-paperclip text-white" style="font-size:6px;"></i>
                </span>
              </div>
              <!-- Text -->
              <div class="min-w-0 flex-1">
                <p class="text-xs font-bold leading-snug truncate group-hover:text-[#2f78dd] transition-colors" style="color:#183b63;">{{ update.title }}</p>
                <p class="text-[11px] mt-0.5 truncate" style="color:#67819d;">{{ update.description || 'No description' }}</p>
                <p class="text-[10px] mt-1" style="color:#8aa7c5;">{{ formatDate(update.created_at) }}</p>
              </div>
              <!-- Arrow -->
              <i class="fas fa-chevron-right text-[9px] mt-2 opacity-0 group-hover:opacity-100 transition-opacity" style="color:#2f78dd;"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

  <!-- Add Update Modal -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="addModal.open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background:rgba(14,34,64,0.45);backdrop-filter:blur(4px);"
        @click.self="closeAddModal"
      >
        <div
          class="w-full max-w-lg rounded-[24px] bg-white shadow-[0_32px_80px_rgba(18,58,99,0.24)] overflow-hidden"
          style="border:1px solid #d6e4f2;"
        >
          <!-- Modal header -->
          <div class="flex items-center justify-between px-6 py-4" style="border-bottom:1px solid #e8f0f8;background:linear-gradient(135deg,#eef5ff 0%,#ffffff 100%);">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-[12px] flex items-center justify-center" style="background:linear-gradient(135deg,#194f92,#2f78dd);">
                <i class="fas fa-pen text-white" style="font-size:13px;"></i>
              </div>
              <div>
                <h2 class="font-bold text-[#183b63]" style="font-size:15px;line-height:1.2;">Add Updates</h2>
                <p class="text-[11px] text-[#7a93af] mt-0.5">{{ addModal.entries.length }} update{{ addModal.entries.length !== 1 ? 's' : '' }} queued</p>
              </div>
            </div>
            <button @click="closeAddModal" class="w-8 h-8 rounded-lg flex items-center justify-center text-[#7a93af] hover:bg-[#eef5ff] hover:text-[#183b63] transition-all">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Scrollable entries -->
          <div class="overflow-y-auto" style="max-height:60vh;">
            <div class="px-6 pt-5 pb-2 space-y-5">
              <div
                v-for="(entry, index) in addModal.entries"
                :key="index"
                class="rounded-[16px] p-4"
                style="border:1px solid #dce7f3;background:#f8fbff;"
              >
                <!-- Entry header -->
                <div class="flex items-center justify-between mb-3">
                  <span class="text-[11px] font-bold uppercase tracking-wide text-[#2d6aaf]">
                    Update {{ index + 1 }}
                  </span>
                  <button
                    v-if="addModal.entries.length > 1"
                    type="button"
                    @click="removeEntry(index)"
                    class="w-6 h-6 rounded-full flex items-center justify-center text-[#c54533] hover:bg-[#fff0ed] transition-all"
                    title="Remove"
                  >
                    <i class="fas fa-times" style="font-size:10px;"></i>
                  </button>
                </div>

                <!-- Title -->
                <div class="mb-3">
                  <label class="block text-[10px] font-semibold uppercase tracking-wide text-[#7d94ac] mb-1.5">Title <span class="text-red-500">*</span></label>
                  <input
                    type="text"
                    v-model="entry.title"
                    placeholder="Brief, clear update title…"
                    maxlength="120"
                    class="w-full rounded-[10px] px-3 py-2.5 text-sm text-[#183b63] outline-none transition-all"
                    :style="`border:1.5px solid ${addModal.showErrors && !entry.title.trim() ? '#e57373' : '#d6e4f2'};background:#fff;`"
                  />
                  <p v-if="addModal.showErrors && !entry.title.trim()" class="mt-1 text-[11px] text-red-500">Required</p>
                </div>

                <!-- Description -->
                <div>
                  <label class="block text-[10px] font-semibold uppercase tracking-wide text-[#7d94ac] mb-1.5">Description <span class="text-red-500">*</span></label>
                  <textarea
                    v-model="entry.description"
                    rows="3"
                    placeholder="Describe the update in detail…"
                    class="w-full rounded-[10px] px-3 py-2.5 text-sm text-[#183b63] outline-none transition-all resize-none"
                    :style="`border:1.5px solid ${addModal.showErrors && !entry.description.trim() ? '#e57373' : '#d6e4f2'};background:#fff;line-height:1.6;`"
                  ></textarea>
                  <div class="flex justify-between mt-1">
                    <p v-if="addModal.showErrors && !entry.description.trim()" class="text-[11px] text-red-500">Required</p>
                    <span class="ml-auto text-[10px] text-[#aab8cb]">{{ entry.description.length }} chars</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Add another entry -->
            <div class="px-6 pb-4">
              <button
                type="button"
                @click="addEntry"
                class="inline-flex items-center gap-2 text-[#2f78dd] text-sm font-semibold hover:text-[#174fa0] transition-colors"
              >
                <span class="w-6 h-6 rounded-full flex items-center justify-center" style="background:#edf4ff;border:1px solid #c3d9f5;">
                  <i class="fas fa-plus" style="font-size:9px;"></i>
                </span>
                Add another update
              </button>
            </div>
          </div>

          <!-- Footer actions -->
          <div class="flex items-center justify-between gap-3 px-6 py-4" style="border-top:1px solid #e8f0f8;background:#f8fbff;">
            <button
              @click="closeAddModal"
              class="px-5 py-2.5 rounded-[10px] text-sm font-semibold text-[#4e78ab] hover:bg-[#eef5ff] transition-all"
              style="border:1px solid #d6e4f2;"
            >
              Cancel
            </button>
            <button
              @click="submitAllUpdates"
              :disabled="addModal.submitting"
              class="inline-flex items-center gap-2 px-6 py-2.5 rounded-[10px] text-sm font-semibold text-white transition-all disabled:opacity-60"
              style="background:linear-gradient(135deg,#194f92,#2f78dd);box-shadow:0 6px 18px rgba(35,96,182,0.22);"
            >
              <i v-if="addModal.submitting" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-paper-plane"></i>
              {{ addModal.submitting ? 'Submitting…' : `Submit ${addModal.entries.length > 1 ? addModal.entries.length + ' Updates' : 'Update'}` }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

    <!-- ── Floating Notification Bell ────────────────────────────── -->
    <div v-if="notifOpen" class="fixed inset-0 z-30" @click="notifOpen = false"></div>
    <div class="fixed bottom-6 right-6 z-40">
      <!-- Popup -->
      <Transition name="notif-pop">
        <div v-if="notifOpen" class="absolute bottom-16 right-0 w-[340px] rounded-2xl bg-white shadow-[0_20px_60px_rgba(14,34,64,0.28)] overflow-hidden" style="border:1px solid #d0e2f8;">
          <!-- Header -->
          <div class="flex items-center justify-between px-4 py-3" style="background:linear-gradient(135deg,#194f92,#2f78dd);">
            <div class="flex items-center gap-2">
              <svg class="h-4 w-4 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              <span class="text-sm font-bold text-white">CEO Comments</span>
            </div>
            <button v-if="unreadNotifications.length" @click="markAllRead" class="rounded-lg px-2 py-0.5 text-[11px] font-semibold text-white/90 hover:bg-white/15 transition-colors">Mark all read</button>
          </div>
          <!-- Body -->
          <div class="overflow-y-auto" style="max-height:320px;">
            <div v-if="!notifications.length" class="flex flex-col items-center justify-center py-8">
              <div class="flex h-11 w-11 items-center justify-center rounded-full mb-2" style="background:#edf4fb;">
                <svg class="h-5 w-5" style="color:#a4b8cf;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
              </div>
              <p class="text-xs font-medium" style="color:#8aa0b7;">No comments yet</p>
            </div>
            <div v-else>
              <div v-for="n in notifications.slice(0, 4)" :key="n.id"
                class="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-[#f5f9ff]"
                :style="!n.is_read ? 'background:#f0f7ff;' : ''"
                style="border-bottom:1px solid #eef3fa;"
                @click="openNotifUpdate(n)">
                <!-- Unread dot -->
                <div class="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full" :style="!n.is_read ? 'background:#2f78dd;' : 'background:transparent;'"></div>
                <!-- Avatar -->
                <div class="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style="background:linear-gradient(135deg,#194f92,#2f78dd);">
                  {{ n.ceo_name ? n.ceo_name.charAt(0).toUpperCase() : 'C' }}
                </div>
                <!-- Content -->
                <div class="min-w-0 flex-1">
                  <p class="text-xs leading-snug line-clamp-2" :style="!n.is_read ? 'color:#183b63;font-weight:600;' : 'color:#4e6781;'">{{ n.comment }}</p>
                  <p class="text-[10px] mt-0.5" style="color:#8aa0b7;">on "{{ n.update_title }}"</p>
                </div>
                <!-- Time -->
                <span class="flex-shrink-0 text-[10px] mt-0.5" style="color:#8aa7c5;">{{ formatNotifTime(n.created_at) }}</span>
              </div>
            </div>
          </div>
          <!-- Footer -->
          <div v-if="notifications.length > 4" class="px-4 py-2 text-center" style="border-top:1px solid #eef3fa;background:#f8fbff;">
            <span class="text-[10px] font-medium" style="color:#8aa0b7;">Showing latest 4 of {{ notifications.length }}</span>
          </div>
        </div>
      </Transition>
      <!-- Bell button -->
      <button @click="toggleNotif" class="relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 active:scale-95" style="background:linear-gradient(135deg,#194f92,#2f78dd);box-shadow:0 8px 24px rgba(35,96,182,0.35);">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
        <span v-if="unreadNotifications.length" class="notif-badge absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">{{ unreadNotifications.length > 9 ? '9+' : unreadNotifications.length }}</span>
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/axios';
import { useToast } from 'vue-toastification';
import UpdatesHeatmap from '@/components/UpdatesHeatmap.vue';

const router = useRouter();
const toast = useToast();
const updates = ref([]);
const isLoading = ref(true);

// Heatmap state
const heatmapData = ref({});
const heatmapLoading = ref(true);
const heatmapStart = ref('');
const heatmapEnd = ref('');

// Timezone-safe local date string (avoids UTC shift from toISOString)
function toLocalDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
const firstUpdateDate = ref(null);
const heatmapSelectedDay = ref(null);
const dayDetail = ref([]);
const dayDetailLoading = ref(false);

// Notifications state
const notifications = ref([]);
const notifOpen = ref(false);
const unreadNotifications = computed(() => notifications.value.filter(n => !n.is_read));

function toggleNotif() {
  notifOpen.value = !notifOpen.value;
}

function openNotifUpdate(n) {
  if (!n.is_read) {
    n.is_read = true;
    axios.post('api/my/notifications/read', { ids: [n.id] }).catch(() => {});
  }
  notifOpen.value = false;
  router.push({ name: editRouteName.value, params: { chat_id: n.chat_id } });
}

function formatNotifTime(dt) {
  if (!dt) return '';
  const d = new Date(dt);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h';
  if (diff < 604800) return Math.floor(diff / 86400) + 'd';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

// Get current user role from localStorage
const userRole = ref(parseInt(localStorage.getItem('role_id')) || 4);

// Add Update Modal state
const addModal = ref({
  open: false,
  showErrors: false,
  submitting: false,
  entries: [{ title: '', description: '' }],
});

function openAddModal() {
  addModal.value = { open: true, showErrors: false, submitting: false, entries: [{ title: '', description: '' }] };
}

function closeAddModal() {
  addModal.value.open = false;
}

function addEntry() {
  addModal.value.entries.push({ title: '', description: '' });
}

function removeEntry(index) {
  addModal.value.entries.splice(index, 1);
}

async function submitAllUpdates() {
  addModal.value.showErrors = true;
  const invalid = addModal.value.entries.some(e => !e.title.trim() || !e.description.trim());
  if (invalid) {
    toast.error('Please fill in all title and description fields');
    return;
  }
  addModal.value.submitting = true;
  try {
    // Submit each entry sequentially
    for (const entry of addModal.value.entries) {
      const fd = new FormData();
      fd.append('titles[0]', entry.title.trim());
      fd.append('description', entry.description.trim());
      await axios.post('/api/updates', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    const count = addModal.value.entries.length;
    toast.success(count === 1 ? 'Update submitted!' : `${count} updates submitted!`);
    closeAddModal();
    await Promise.all([fetchUpdates(), fetchHeatmap()]);
  } catch (err) {
    const msg = err.response?.data?.message || (err.request ? 'No response from server.' : 'An error occurred');
    toast.error(msg);
  } finally {
    addModal.value.submitting = false;
  }
}

// Dynamic edit route based on user role
const editRouteName = computed(() => {
  switch(userRole.value) {
    case 2: return 'HodEditUpdate';        // HOD
    case 3: return 'EditUserUpdate';      // User
    case 4: return 'TenderUserEditUpdates'; // Tender
    case 5: return 'AccntantEditUpdate';  // Accountant
    case 6: return 'HrEditUpdate';        // HR
    default: return 'TenderUserEditUpdates';
  }
});

// Toggle for showing all vs. 4 recent updates
const showAllUpdates = ref(false);

// Last 5 updates
const recentUpdates = computed(() => updates.value.slice(0, 5));

// Latest update label
const latestUpdateLabel = computed(() => {
  if (isLoading.value || updates.value.length === 0) return '–';
  return formatRelativeDate(updates.value[0].created_at);
});

// Performance stats: rate is all-time (from first update), missed is current week only
const performanceStats = computed(() => {
  const today = new Date();

  // ── All-time rate from first update date ──
  let working = 0, active = 0;
  if (firstUpdateDate.value) {
    const start = new Date(firstUpdateDate.value + 'T00:00:00');
    const cur = new Date(start);
    while (cur <= today) {
      const dow = cur.getDay();
      if (dow !== 0 && dow !== 6) {
        working++;
        if (heatmapData.value[toLocalDate(cur)]) active++;
      }
      cur.setDate(cur.getDate() + 1);
    }
  }

  // ── Missed this week (Mon of current week → today) ──
  const dayOfWeek = today.getDay(); // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  let weekWorking = 0, weekActive = 0;
  const wCur = new Date(monday);
  while (wCur <= today) {
    const dow = wCur.getDay();
    if (dow !== 0 && dow !== 6) {
      weekWorking++;
      if (heatmapData.value[toLocalDate(wCur)]) weekActive++;
    }
    wCur.setDate(wCur.getDate() + 1);
  }

  return {
    rate:    working ? Math.round((active / working) * 100) : 0,
    missed:  Math.max(0, weekWorking - weekActive),
    working,
    active,
  };
});

// Fetch data when component is mounted
onMounted(async () => {
  // Set heatmap date range: 6 months back to today, using local dates
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 6);
  heatmapEnd.value = toLocalDate(end);
  heatmapStart.value = toLocalDate(start);

  await Promise.all([fetchUpdates(), fetchHeatmap(), fetchNotifications()]);
});

// Fetch project updates for current user only
async function fetchUpdates() {
  isLoading.value = true;
  try {
    const response = await axios.get('api/my/updates');
    // Sort by created_at descending (newest first)
    updates.value = response.data.data
      .map(update => ({
        chat_id: update.chat_id,
        title: update.title,
        user_name: update.user.name,
        created_at: update.created_at,
        update_photo: update.update_photo,
        description: update.description,
        update_file: update.update_file,
      }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

async function fetchHeatmap() {
  heatmapLoading.value = true;
  try {
    const res = await axios.get(`api/updates/heatmap?start=${heatmapStart.value}&end=${heatmapEnd.value}`);
    heatmapData.value = res.data?.data || {};
    firstUpdateDate.value = res.data?.first_update_date || null;
  } catch (e) {
    // silent
  } finally {
    heatmapLoading.value = false;
  }
}

async function onHeatmapDayClick(day) {
  heatmapSelectedDay.value = day.date;
  dayDetail.value = [];
  dayDetailLoading.value = true;
  try {
    const res = await axios.get(`api/updates/by-day?date=${day.date}`);
    dayDetail.value = res.data?.data || [];
  } catch (e) {
    // silent
  } finally {
    dayDetailLoading.value = false;
  }
}

async function fetchNotifications() {
  try {
    const res = await axios.get('api/my/notifications');
    notifications.value = res.data?.data || [];
  } catch (e) {
    // silent
  }
}

async function markAllRead() {
  try {
    await axios.post('api/my/notifications/read', {});
    notifications.value = notifications.value.map(n => ({ ...n, is_read: true }));
  } catch (e) {
    // silent
  }
}

function formatHeatmapDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}

function formatTime(dt) {
  if (!dt) return '';
  return new Date(dt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Navigate to update details page with chat_id
function viewUpdateDetails(chat_id) {
  router.push({ name: editRouteName.value, params: { chat_id } });
}

// Download file function
async function downloadFile(fileUrl, fileName) {
  try {
    // Create a download link
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'download';
    link.target = '_blank';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Download started');
  } catch (error) {
    console.error('Download error:', error);
    toast.error('Failed to download file');
  }
}

// Extract filename from URL
function getFileName(fileUrl) {
  if (!fileUrl) return 'download';
  
  // Extract filename from URL path
  const urlParts = fileUrl.split('/');
  const fileName = urlParts[urlParts.length - 1];
  
  // Remove any query parameters
  return fileName.split('?')[0];
}

// Handle image loading errors
function handleImageError(event) {
  event.target.style.display = 'none';
}

// Handle errors and display as toast messages
function handleError(error) {
  let message = 'An unexpected error occurred';
  if (error.response) {
    message = error.response.data.message || error.response.statusText;
  } else if (error.request) {
    message = 'No response from the server. Please check your connection.';
  } else {
    message = error.message;
  }
  toast.error(message);
}

// Format date to a readable format
function formatDate(date) {
  const d = new Date(date);
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return d.toLocaleDateString('en-US', options);
}

// Format relative date for latest update
function formatRelativeDate(date) {
  if (!date) return 'N/A';
  
  const now = new Date();
  const updateDate = new Date(date);
  const diffTime = Math.abs(now - updateDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return formatDate(date);
  }
}
</script>

<style scoped>
/* Line clamp utility for text truncation */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Hover effects */
.group:hover {
  transform: translateY(-4px);
}

/* Sticky header */
.sticky {
  position: sticky;
  top: 0;
}

/* Modal transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .modal-card,
.modal-fade-leave-to .modal-card {
  transform: translateY(12px) scale(0.97);
}

/* Notification popup transitions */
.notif-pop-enter-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.notif-pop-leave-active {
  transition: all 0.2s ease-in;
}
.notif-pop-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.9);
}
.notif-pop-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
}
@keyframes badge-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}
.notif-badge {
  animation: badge-pulse 2s ease-in-out infinite;
}
</style>