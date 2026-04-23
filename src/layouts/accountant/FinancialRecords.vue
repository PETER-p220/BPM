<template>
  <div class="min-h-screen px-4 py-4 lg:px-5" style="background: radial-gradient(circle at top right, rgba(48,120,221,0.08), transparent 22%), linear-gradient(180deg, #eff5fb 0%, #eaf1f8 100%);">
    <div class="mx-auto max-w-[1580px] overflow-hidden rounded-[34px] border border-[#d9e6f3] bg-white/84 shadow-[0_28px_70px_rgba(18,58,99,0.14)] backdrop-blur-sm">

      <!-- ── HERO ── -->
      <div class="relative overflow-hidden border-b border-[#dbe7f3] bg-[linear-gradient(135deg,#eef5ff_0%,#ffffff_46%,#f7fbff_100%)] px-6 py-5 lg:px-7">
        <div class="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-[#dce9fb] blur-3xl"></div>
        <div class="pointer-events-none absolute right-6 top-3 h-24 w-24 opacity-35" style="background-image: radial-gradient(#2b74d7 1.2px, transparent 1.2px); background-size: 10px 10px;"></div>

        <div class="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex items-start gap-4">
            <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[20px] text-white shadow-[0_16px_34px_rgba(35,96,182,0.26)]" style="background: linear-gradient(135deg,#194f92,#2f78dd);">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.24em]" style="color:#2d6aaf;">Finance Workspace</p>
              <h1 class="mt-1 text-2xl font-bold tracking-tight lg:text-[28px]" style="color:#183b63;">Financial Records</h1>
              <p class="mt-1.5 text-sm leading-6" style="color:#67819d;">Manage transactions, income, expenses and record verification status.</p>
            </div>
          </div>
          <button @click="showAddRecordModal = true"
                  class="inline-flex shrink-0 items-center gap-2 rounded-[16px] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(35,96,182,0.22)] transition-all hover:brightness-105"
                  style="background: linear-gradient(135deg,#194f92,#2f78dd);">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Record
          </button>
        </div>


        <!-- Stats cards -->
        <div class="relative mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-[22px] p-5 text-white" style="background: linear-gradient(135deg,#164c93,#2f78dd);">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xl font-bold">{{ stats.total }}</p>
                <p class="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/72">Total Records</p>
              </div>
              <div class="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white/15">
                <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div class="rounded-[22px] p-5 text-white" style="background: linear-gradient(135deg,#164c93,#2f78dd);">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xl font-bold">{{ formatCurrency(stats.income) }}</p>
                <p class="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/72">Total Income</p>
              </div>
              <div class="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white/15">
                <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8l-8 8-8-8" />
                </svg>
              </div>
            </div>
          </div>
          <div class="rounded-[22px] p-5 text-white" style="background: linear-gradient(135deg,#164c93,#2f78dd);">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xl font-bold">{{ formatCurrency(stats.expenses) }}</p>
                <p class="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/72">Total Expenses</p>
              </div>
              <div class="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white/15">
                <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20V4m8 8l-8-8-8 8" />
                </svg>
              </div>
            </div>
          </div>
          <div class="rounded-[22px] p-5 text-white" style="background: linear-gradient(135deg,#164c93,#2f78dd);">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xl font-bold">{{ formatCurrency(stats.balance) }}</p>
                <p class="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/72">Net Balance</p>
              </div>
              <div class="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white/15">
                <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── BODY ── -->
      <div class="space-y-4 bg-[linear-gradient(180deg,#fbfdff_0%,#f7fbff_100%)] p-4">

        <!-- Filters -->
        <div class="rounded-[24px] border border-[#dce7f3] bg-white p-5 shadow-[0_4px_16px_rgba(18,58,99,0.06)]">
          <div class="flex flex-wrap items-center gap-3">
            <div class="relative flex-1 min-w-[200px]">
              <svg class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" style="color:#9ab8d8;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input v-model="searchQuery" type="text" placeholder="Search records..."
                     class="w-full rounded-[10px] py-2.5 pl-10 pr-4 text-sm outline-none transition-all"
                     style="border: 1.5px solid #d6e4f2; background: #f8fbff; color: #183b63;" />
            </div>
            <select v-model="typeFilter" @change="loadRecords"
                    class="rounded-[10px] px-4 py-2.5 text-sm outline-none"
                    style="border: 1.5px solid #d6e4f2; background: #f8fbff; color: #183b63;">
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select v-model="categoryFilter" @change="loadRecords"
                    class="rounded-[10px] px-4 py-2.5 text-sm outline-none"
                    style="border: 1.5px solid #d6e4f2; background: #f8fbff; color: #183b63;">
              <option value="">All Categories</option>
              <option value="sales">Sales</option>
              <option value="services">Services</option>
              <option value="operations">Operations</option>
              <option value="salary">Salary</option>
              <option value="utilities">Utilities</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <input v-model="dateFilter" type="date" @change="loadRecords"
                   class="rounded-[10px] px-4 py-2.5 text-sm outline-none"
                   style="border: 1.5px solid #d6e4f2; background: #f8fbff; color: #183b63;" />
            <button @click="exportRecords"
                    class="inline-flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-sm font-semibold transition-colors"
                    style="border: 1px solid #d7e4f1; background: #fff; color: #183b63;">
              <svg class="h-4 w-4" style="color:#2f78dd;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </div>

        <!-- Records Table -->
        <div class="overflow-hidden rounded-[24px] border border-[#d9e6f3] bg-white shadow-[0_28px_70px_rgba(18,58,99,0.12)]">
          <div class="flex items-center justify-between border-b border-[#e6eef7] px-6 py-4">
            <div>
              <p class="text-[10px] font-semibold uppercase tracking-[0.18em]" style="color:#7d94ac;">Financial Activity</p>
              <h2 class="mt-1 text-base font-bold" style="color:#183b63;">Records</h2>
            </div>
            <span class="rounded-full px-3 py-1 text-xs font-semibold" style="background:#edf4ff; color:#1f5aa6;">
              {{ filteredRecords.length }} record{{ filteredRecords.length !== 1 ? 's' : '' }}
            </span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead style="background: #f3f8ff;">
                <tr style="border-bottom: 1px solid #dce9f7;">
                  <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style="color:#2d6aaf;">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style="color:#2d6aaf;">Description</th>
                  <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style="color:#2d6aaf;">Category</th>
                  <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style="color:#2d6aaf;">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style="color:#2d6aaf;">Amount</th>
                  <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style="color:#2d6aaf;">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style="color:#2d6aaf;">Receipt</th>
                  <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style="color:#2d6aaf;">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y" style="border-color: #e8f0f8;">
                <tr v-if="loading">
                  <td colspan="8" class="px-6 py-10 text-center">
                    <div class="inline-block h-6 w-6 animate-spin rounded-full border-b-2" style="border-color:#2f78dd;"></div>
                    <p class="mt-2 text-sm" style="color:#8aa0b7;">Loading records...</p>
                  </td>
                </tr>
                <tr v-else-if="filteredRecords.length === 0">
                  <td colspan="8" class="px-6 py-14 text-center">
                    <div class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full" style="background:#e9f2ff;">
                      <svg class="h-6 w-6" style="color:#2b74d7;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p class="text-sm font-semibold" style="color:#183b63;">No records found</p>
                    <p class="mt-1 text-xs" style="color:#8aa0b7;">Try adjusting your search or filters.</p>
                  </td>
                </tr>
                <tr v-for="record in filteredRecords" :key="record.id" class="transition-colors hover:bg-[#f8fbff]">
                  <td class="whitespace-nowrap px-6 py-4 text-sm" style="color:#4e6781;">{{ formatDate(record.date) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-semibold" style="color:#183b63;">{{ record.description }}</div>
                    <div class="mt-0.5 text-xs" style="color:#8aa0b7;">Ref: {{ record.reference }}</div>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm capitalize" style="color:#4e6781;">{{ record.category }}</td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <span :class="getTypeColor(record.type)" class="rounded-full px-2.5 py-1 text-xs font-semibold">{{ record.type }}</span>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm font-semibold" :class="record.type === 'income' ? 'text-emerald-700' : 'text-red-600'">
                    {{ record.type === 'income' ? '+' : '-' }} {{ formatCurrency(record.amount) }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <span :class="getStatusColor(record.status)" class="rounded-full px-2.5 py-1 text-xs font-semibold">{{ record.status }}</span>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm">
                    <button v-if="record.receipt_file" @click="viewReceipt(record.receipt_file)"
                            class="inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-xs font-semibold transition-colors"
                            style="background:#edf4ff; border:1px solid #c3d9f7; color:#1f5aa6;">
                      <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    <span v-else class="text-xs italic" style="color:#b0c4d8;">None</span>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm">
                    <button @click="editRecord(record)" class="mr-3 font-semibold transition-colors" style="color:#2f78dd;">Edit</button>
                    <button @click="deleteRecord(record.id)" class="font-semibold text-red-500 transition-colors hover:text-red-700">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Record Modal -->
    <Teleport to="body">
      <div v-if="showAddRecordModal" class="fixed inset-0 z-50 flex items-center justify-center p-4"
           style="background: rgba(14,34,64,0.45); backdrop-filter: blur(4px);"
           @click.self="closeModal">
        <div class="w-full max-w-2xl rounded-[24px] bg-white"
             style="border: 1px solid #d6e4f2; box-shadow: 0 32px 80px rgba(18,58,99,0.24); max-height: 92vh; display:flex; flex-direction:column;">
          <!-- Header -->
          <div class="flex shrink-0 items-center justify-between px-6 py-4"
               style="border-bottom: 1px solid #e8f0f8; background: linear-gradient(135deg,#eef5ff 0%,#ffffff 100%);">
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-[12px] text-white"
                   style="background: linear-gradient(135deg,#194f92,#2f78dd);">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h2 class="text-[15px] font-bold leading-tight" style="color:#183b63;">
                  {{ editingRecord ? 'Edit Record' : 'Add Financial Record' }}
                </h2>
                <p class="mt-0.5 text-[11px]" style="color:#7a93af;">
                  {{ editingRecord ? 'Update existing record details' : 'Create a new financial record entry' }}
                </p>
              </div>
            </div>
            <button @click="closeModal" class="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:bg-[#eef5ff]" style="color:#7a93af;">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Form (scrollable) -->
          <form @submit.prevent="saveRecord" class="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            <!-- Type toggle buttons (full width) -->
            <div>
              <label class="mb-2 block text-[10px] font-semibold uppercase tracking-wide" style="color:#7d94ac;">Type <span class="text-red-500">*</span></label>
              <div class="grid grid-cols-2 gap-3">
                <button type="button" @click="recordForm.type = 'income'"
                        class="flex items-center justify-center gap-2 rounded-[12px] px-4 py-3 text-sm font-semibold transition-all"
                        :style="recordForm.type === 'income' ? 'background:linear-gradient(135deg,#0f7b55,#19a974);color:#fff;border:2px solid #0f7b55;box-shadow:0 4px 14px rgba(15,123,85,0.25);' : 'border:2px solid #d6e4f2;background:#f8fbff;color:#4e6781;'">
                  <i class="fas fa-arrow-circle-up" :style="recordForm.type === 'income' ? 'color:#fff' : 'color:#19a974'"></i>
                  Income
                </button>
                <button type="button" @click="recordForm.type = 'expense'"
                        class="flex items-center justify-center gap-2 rounded-[12px] px-4 py-3 text-sm font-semibold transition-all"
                        :style="recordForm.type === 'expense' ? 'background:linear-gradient(135deg,#b91c1c,#ef4444);color:#fff;border:2px solid #b91c1c;box-shadow:0 4px 14px rgba(185,28,28,0.2);' : 'border:2px solid #d6e4f2;background:#f8fbff;color:#4e6781;'">
                  <i class="fas fa-arrow-circle-down" :style="recordForm.type === 'expense' ? 'color:#fff' : 'color:#ef4444'"></i>
                  Expense
                </button>
              </div>
            </div>

            <!-- Row: Date + Amount -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide" style="color:#7d94ac;">Date</label>
                <input v-model="recordForm.date" type="date" required
                       class="w-full rounded-[10px] px-3 py-2.5 text-sm outline-none transition-all"
                       style="border: 1.5px solid #d6e4f2; background: #f8fbff; color: #183b63;" />
              </div>
              <div>
                <label class="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide" style="color:#7d94ac;">Amount (TZS) <span class="text-red-500">*</span></label>
                <input v-model="recordForm.amount" type="number" step="0.01" min="0" required placeholder="0.00"
                       class="w-full rounded-[10px] px-3 py-2.5 text-sm outline-none transition-all"
                       style="border: 1.5px solid #d6e4f2; background: #f8fbff; color: #183b63;" />
              </div>
            </div>

            <!-- Row: Category + Status -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide" style="color:#7d94ac;">Category <span class="text-red-500">*</span></label>
                <select v-model="recordForm.category" required
                        class="w-full rounded-[10px] px-3 py-2.5 text-sm outline-none"
                        style="border: 1.5px solid #d6e4f2; background: #f8fbff; color: #183b63;">
                  <option value="">Select Category</option>
                  <option value="sales">Sales</option>
                  <option value="services">Services</option>
                  <option value="operations">Operations</option>
                  <option value="salary">Salary</option>
                  <option value="utilities">Utilities</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div>
                <label class="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide" style="color:#7d94ac;">Status <span class="text-red-500">*</span></label>
                <select v-model="recordForm.status" required
                        class="w-full rounded-[10px] px-3 py-2.5 text-sm outline-none"
                        style="border: 1.5px solid #d6e4f2; background: #f8fbff; color: #183b63;">
                  <option value="">Select Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                </select>
              </div>
            </div>

            <!-- Row: Description + Reference (both optional) -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide" style="color:#7d94ac;">
                  Description <span class="font-normal normal-case" style="color:#b8ccdf;font-size:9px;">(optional)</span>
                </label>
                <textarea v-model="recordForm.description" rows="2" placeholder="Enter description"
                          class="w-full rounded-[10px] px-3 py-2.5 text-sm outline-none transition-all resize-none"
                          style="border: 1.5px solid #d6e4f2; background: #f8fbff; color: #183b63; line-height:1.6;"></textarea>
              </div>
              <div>
                <label class="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide" style="color:#7d94ac;">
                  Reference <span class="font-normal normal-case" style="color:#b8ccdf;font-size:9px;">(optional)</span>
                </label>
                <input v-model="recordForm.reference" type="text" :placeholder="`e.g. INV-${new Date().getFullYear()}-001`"
                       class="w-full rounded-[10px] px-3 py-2.5 text-sm outline-none transition-all"
                       style="border: 1.5px solid #d6e4f2; background: #f8fbff; color: #183b63;" />
              </div>
            </div>

            <!-- Receipt upload (full width) -->
            <div>
              <label class="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide" style="color:#7d94ac;">
                Receipt <span class="font-normal normal-case" style="color:#b8ccdf;font-size:9px;">(optional)</span>
              </label>
              <!-- Current receipt preview when editing -->
              <div v-if="editingRecord && editingRecord.receipt_file" class="mb-2 flex items-center gap-2">
                <button type="button" @click="viewReceipt(editingRecord.receipt_file)"
                        class="inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-xs font-semibold"
                        style="background:#edf4ff; border:1px solid #c3d9f7; color:#1f5aa6;">
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View current receipt
                </button>
              </div>
              <!-- File drop zone -->
              <label class="block cursor-pointer rounded-[12px] p-4 text-center transition-colors"
                     :style="receiptFile ? 'border:2px solid #2f78dd; background:#f0f7ff;' : 'border:2px dashed #c8ddf0; background:#f8fbff;'">
                <input ref="receiptFileInput" type="file" accept="image/*,.pdf" class="sr-only" @change="handleFileChange" />
                <div v-if="receiptFile" class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <svg class="h-4 w-4 flex-shrink-0" style="color:#2f78dd;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="max-w-[220px] truncate text-xs font-semibold" style="color:#183b63;">{{ receiptFile.name }}</span>
                  </div>
                  <button type="button" @click.prevent="clearFile"
                          class="ml-2 text-xs font-bold text-red-400 hover:text-red-600">✕</button>
                </div>
                <div v-else class="flex flex-col items-center gap-1">
                  <svg class="h-6 w-6" style="color:#9ab8d8;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-xs" style="color:#7a93af;">Click to upload receipt image or PDF</span>
                </div>
              </label>
            </div>

            <!-- Footer actions -->
            <div class="flex items-center justify-end gap-3 pt-2" style="border-top: 1px solid #e8f0f8;">
              <button type="button" @click="closeModal"
                      class="rounded-[10px] px-4 py-2 text-sm font-semibold transition-colors"
                      style="background: #f3f8ff; color: #183b63; border: 1px solid #d7e4f1;">
                Cancel
              </button>
              <button type="submit" :disabled="submitting"
                      class="rounded-[10px] px-5 py-2 text-sm font-semibold text-white transition-all hover:brightness-105 disabled:opacity-60"
                      style="background: linear-gradient(135deg,#194f92,#2f78dd);">
                <span v-if="submitting">Saving...</span>
                <span v-else>{{ editingRecord ? 'Update' : 'Save Record' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Receipt Viewer Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="viewingReceiptUrl" class="fixed inset-0 z-[60] flex items-center justify-center p-4"
             style="background: rgba(5,20,45,0.85); backdrop-filter: blur(8px);"
             @click.self="viewingReceiptUrl = null">
          <div class="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[24px] bg-white"
               style="box-shadow: 0 40px 100px rgba(0,0,0,0.45);">
            <!-- Viewer header -->
            <div class="flex shrink-0 items-center justify-between px-5 py-3.5"
                 style="border-bottom: 1px solid #e8f0f8; background: linear-gradient(135deg,#eef5ff 0%,#ffffff 100%);">
              <div class="flex items-center gap-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-[10px] text-white"
                     style="background: linear-gradient(135deg,#194f92,#2f78dd);">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <span class="text-sm font-bold" style="color:#183b63;">Receipt Preview</span>
              </div>
              <div class="flex items-center gap-2">
                <a :href="viewingReceiptUrl" target="_blank" download
                   class="inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-xs font-semibold transition-colors"
                   style="background:#f3f8ff; border:1px solid #d7e4f1; color:#2d6aaf;">
                  <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </a>
                <button @click="viewingReceiptUrl = null"
                        class="flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:bg-[#eef5ff]" style="color:#7a93af;">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <!-- Viewer body -->
            <div class="flex-1 overflow-auto" style="background:#f0f4f9;">
              <img v-if="isImageUrl(viewingReceiptUrl)"
                   :src="viewingReceiptUrl"
                   class="mx-auto block max-h-[80vh] object-contain p-4"
                   alt="Receipt" />
              <iframe v-else
                      :src="viewingReceiptUrl"
                      class="h-[80vh] w-full border-0"
                      title="Receipt"></iframe>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import axios from '@/axios'

const toast = useToast()

// State
const loading = ref(false)
const submitting = ref(false)
const records = ref([])
const showAddRecordModal = ref(false)
const editingRecord = ref(null)
const searchQuery = ref('')
const typeFilter = ref('')
const categoryFilter = ref('')
const dateFilter = ref('')
const receiptFile = ref(null)
const receiptFileInput = ref(null)
const viewingReceiptUrl = ref(null)

function todayDate() {
  return new Date().toISOString().split('T')[0]
}

const recordForm = ref({
  date: todayDate(),
  description: '',
  reference: '',
  type: '',
  category: '',
  amount: '',
  status: 'pending'
})

// Computed
const filteredRecords = computed(() => {
  let filtered = records.value

  if (typeFilter.value) {
    filtered = filtered.filter(record => record.type === typeFilter.value)
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(record => record.category === categoryFilter.value)
  }

  if (dateFilter.value) {
    filtered = filtered.filter(record => record.date === dateFilter.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(record => 
      record.description?.toLowerCase().includes(query) ||
      record.reference?.toLowerCase().includes(query)
    )
  }

  return filtered
})

const stats = computed(() => {
  const income = records.value
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + parseFloat(r.amount || 0), 0)
  
  const expenses = records.value
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + parseFloat(r.amount || 0), 0)

  return {
    total: records.value.length,
    income,
    expenses,
    balance: income - expenses
  }
})

// Methods
const loadRecords = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (typeFilter.value) params.append('type', typeFilter.value)
    if (categoryFilter.value) params.append('category', categoryFilter.value)
    if (dateFilter.value) params.append('date', dateFilter.value)

    const response = await axios.get(`api/financial/records?${params}`)
    records.value = response.data.data || []
  } catch (error) {
    console.error('Error loading records:', error)
    toast.error('Failed to load records')
    records.value = []
  } finally {
    loading.value = false
  }
}

const saveRecord = async () => {
  submitting.value = true
  
  try {
    const endpoint = editingRecord.value 
      ? `api/financial/records/${editingRecord.value.id}`
      : 'api/financial/records'
    
    let response
    if (receiptFile.value) {
      const formData = new FormData()
      Object.entries(recordForm.value).forEach(([k, v]) => {
        if (v !== '' && v !== null) formData.append(k, v)
      })
      formData.append('receipt', receiptFile.value)
      if (editingRecord.value) formData.append('_method', 'PUT')
      response = await axios.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    } else {
      const method = editingRecord.value ? 'put' : 'post'
      response = await axios[method](endpoint, recordForm.value)
    }
    
    if (response.data.status === 'success') {
      toast.success(`Record ${editingRecord.value ? 'updated' : 'created'} successfully`)
      closeModal()
      loadRecords()
    } else {
      toast.error(response.data.message || `Failed to ${editingRecord.value ? 'update' : 'create'} record`)
    }
  } catch (error) {
    console.error('Error saving record:', error)
    toast.error(`Failed to ${editingRecord.value ? 'update' : 'create'} record`)
  } finally {
    submitting.value = false
  }
}

const editRecord = (record) => {
  editingRecord.value = record
  recordForm.value = { ...record }
  showAddRecordModal.value = true
}

const deleteRecord = async (id) => {
  if (!confirm('Are you sure you want to delete this record?')) return
  
  try {
    const response = await axios.delete(`api/financial/records/${id}`)
    if (response.data.status === 'success') {
      toast.success('Record deleted successfully')
      loadRecords()
    } else {
      toast.error(response.data.message || 'Failed to delete record')
    }
  } catch (error) {
    console.error('Error deleting record:', error)
    toast.error('Failed to delete record')
  }
}

const exportRecords = () => {
  // Implementation for exporting records
  toast.info('Export functionality coming soon')
}

const closeModal = () => {
  showAddRecordModal.value = false
  editingRecord.value = null
  receiptFile.value = null
  if (receiptFileInput.value) receiptFileInput.value.value = ''
  recordForm.value = {
    date: todayDate(),
    description: '',
    reference: '',
    type: '',
    category: '',
    amount: '',
    status: 'pending'
  }
}

const formatCurrency = (value) => {
  if (!value) return 'TZS 0'
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const getTypeColor = (type) => {
  switch (type) {
    case 'income':
      return 'text-green-600 bg-green-100/30'
    case 'expense':
      return 'text-red-600 bg-red-100/30'
    default:
      return 'text-slate-600 bg-slate-100/30'
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'text-amber-600 bg-amber-100/30'
    case 'verified':
      return 'text-blue-600 bg-blue-100/30'
    case 'approved':
      return 'text-green-600 bg-green-100/30'
    default:
      return 'text-slate-600 bg-slate-100/30'
  }
}

// Lifecycle
onMounted(() => {
  loadRecords()
})

const handleFileChange = (e) => {
  receiptFile.value = e.target.files[0] || null
}

const clearFile = () => {
  receiptFile.value = null
  if (receiptFileInput.value) receiptFileInput.value.value = ''
}

const viewReceipt = (url) => {
  viewingReceiptUrl.value = url
}

const isImageUrl = (url) => {
  if (!url) return false
  return /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i.test(url)
}
</script>

<style scoped>
@import url('https://fonts.2?family=DM+Sans:wght@400;500;600;700&display=swap');
.fade-enter-active, .fade-leave-active { transition: opacity 0.18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
