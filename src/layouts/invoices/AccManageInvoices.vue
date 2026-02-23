<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-950 dark:via-blue-950/10 dark:to-gray-950 px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <!-- Header -->
      <div class="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-600/30">
            <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              Invoice Management
            </h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Create, send and track accountant invoices
            </p>
          </div>
        </div>

        <button
          @click="openCreateDialog"
          class="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:shadow-blue-500/20"
        >
          <svg class="h-5 w-5 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Invoice
        </button>
      </div>

      <!-- Statistics Cards -->
      <div class="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="stat in statCards"
          :key="stat.label"
          class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:bg-gray-900"
        >
          <div class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/5 transition-transform group-hover:scale-125" />
          <div class="relative flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ stat.label }}</p>
              <p class="mt-3 text-3xl font-extrabold text-gray-900 dark:text-gray-100">{{ stat.value }}</p>
            </div>
            <div :class="stat.iconBg" class="flex h-14 w-14 items-center justify-center rounded-xl shadow-lg">
              <svg class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" v-html="stat.icon" />
            </div>
          </div>
        </div>
      </div>

      <!-- Search + Filters + Export -->
      <div class="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div class="relative flex-1 max-w-xl">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="filter"
            type="text"
            placeholder="Search by number, client, item..."
            class="form-input"
          />
          <button
            v-if="filter"
            @click="filter = ''"
            class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex flex-wrap items-center gap-4">
          <select
            v-model="statusFilter"
            @change="currentPage = 1"
            class="rounded-xl border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <div class="flex gap-3">
            <button
              @click="exportToExcel"
              class="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <svg class="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Excel
            </button>
            <button
              @click="exportToPDF"
              class="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <svg class="h-4 w-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              PDF
            </button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/40 dark:border-gray-800 dark:bg-gray-900 dark:shadow-gray-900/30">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead class="bg-gray-50/80 dark:bg-gray-800/40">
              <tr>
                <th class="w-12 px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">#</th>
                <th class="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Inv. No.</th>
                <th class="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Title</th>
                <th class="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Client</th>
                <th class="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">TIN</th>
                <th class="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">VRN</th>
                <th class="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Description</th>
                <th class="px-6 py-5 text-right text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Cars</th>
                <th class="px-6 py-5 text-right text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Months</th>
                <th class="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">UOM</th>
                <th class="px-6 py-5 text-right text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Unit Price</th>
                <th class="px-6 py-5 text-right text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Gross</th>
                <th class="px-6 py-5 text-right text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 bg-blue-50/40 dark:bg-blue-950/20">Total</th>
                <th class="px-6 py-5 text-center text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Status</th>
                <th class="w-32 px-6 py-5 text-center text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="(invoice, index) in paginatedInvoices"
                :key="invoice.id"
                class="group transition-colors duration-150 hover:bg-blue-50/30 dark:hover:bg-blue-950/20"
              >
                <td class="whitespace-nowrap px-6 py-5 text-sm text-gray-500 dark:text-gray-400">
                  {{ index + 1 + (currentPage - 1) * itemsPerPage }}
                </td>
                <td class="whitespace-nowrap px-6 py-5 text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {{ invoice.invoice_number }}
                </td>
                <td class="whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ invoice.title || '—' }}
                </td>
                <td class="whitespace-nowrap px-6 py-5 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ invoice.client_name }}
                </td>
                <td class="whitespace-nowrap px-6 py-5 text-sm text-gray-700 dark:text-gray-300">
                  {{ invoice.tin || '—' }}
                </td>
                <td class="whitespace-nowrap px-6 py-5 text-sm text-gray-700 dark:text-gray-300">
                  {{ invoice.vrn || '—' }}
                </td>
                <td class="max-w-xs px-6 py-5 text-sm text-gray-700 dark:text-gray-300 truncate" :title="invoice.item_description">
                  {{ invoice.item_description || '—' }}
                </td>
                <td class="whitespace-nowrap px-6 py-5 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ invoice.number_of_cars || '—' }}
                </td>
                <td class="whitespace-nowrap px-6 py-5 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ invoice.period_months || '—' }}
                </td>
                <td class="whitespace-nowrap px-6 py-5 text-sm text-gray-600 dark:text-gray-400">
                  <span class="inline-flex rounded bg-gray-100 px-2.5 py-1 text-xs font-medium dark:bg-gray-800">
                    {{ invoice.uom || '—' }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-5 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {{ formatCurrency(invoice.unit_price) }}
                </td>
                <td class="whitespace-nowrap px-6 py-5 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {{ formatCurrency(invoice.gross_value) }}
                </td>
                <td class="whitespace-nowrap px-6 py-5 text-right text-lg font-bold text-blue-700 dark:text-blue-400">
                  {{ formatCurrency(invoice.total_amount) }}
                </td>
                <td class="whitespace-nowrap px-6 py-5 text-center">
                  <span :class="statusBadgeClass(invoice.status)" class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
                    <span class="h-2 w-2 rounded-full" :class="statusDotClass(invoice.status)" />
                    {{ invoice.status ? invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) : 'N/A' }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-5 text-center">
                  <div class="flex justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button @click="openEditDialog(invoice)" class="rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700">
                      Edit
                    </button>
                    <button @click="downloadInvoice(invoice.id)" class="rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700">
                      PDF
                    </button>
                    <button
                      v-if="invoice.status === 'draft'"
                      @click="sendInvoice(invoice.id)"
                      class="rounded-lg bg-green-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-green-700"
                    >
                      Send
                    </button>
                    <button
                      v-if="invoice.status === 'sent'"
                      @click="openMarkPaidDialog(invoice)"
                      class="rounded-lg bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-purple-700"
                    >
                      Mark Paid
                    </button>
                    <button
                      v-if="['draft', 'cancelled'].includes(invoice.status)"
                      @click="deleteInvoice(invoice.id)"
                      class="rounded-lg bg-red-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="paginatedInvoices.length === 0" class="py-24 text-center">
          <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <svg class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="mt-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
            {{ filter ? 'No matching invoices found' : 'No invoices yet' }}
          </h3>
          <p class="mt-3 text-gray-600 dark:text-gray-400">
            {{ filter ? 'Try changing your search or filter' : 'Create your first invoice to get started' }}
          </p>
          <button v-if="filter" @click="filter = ''" class="mt-6 inline-flex items-center rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            Clear search
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredInvoices.length > itemsPerPage" class="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Showing <span class="font-medium text-gray-900 dark:text-gray-100">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>–
          <span class="font-medium text-gray-900 dark:text-gray-100">{{ Math.min(currentPage * itemsPerPage, filteredInvoices.length) }}</span> of
          <span class="font-medium text-gray-900 dark:text-gray-100">{{ filteredInvoices.length }}</span>
        </p>

        <nav class="flex items-center gap-1">
          <button
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Previous
          </button>

          <button
            v-for="page in visiblePages"
            :key="page"
            @click="typeof page === 'number' && changePage(page)"
            :class="[
              'min-w-[2.5rem] rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              page === currentPage
                ? 'bg-blue-600 text-white'
                : typeof page === 'number'
                ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                : 'text-gray-400 cursor-default'
            ]"
            :disabled="typeof page !== 'number'"
          >
            {{ page }}
          </button>

          <button
            :disabled="currentPage >= Math.ceil(filteredInvoices.length / itemsPerPage)"
            @click="currentPage++"
            class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Next
          </button>
        </nav>
      </div>
    </div>

    <!-- Create / Edit Dialog -->
    <Transition name="dialog">
      <div v-if="showDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl dark:bg-gray-900 max-h-[92vh] overflow-y-auto">
          <div class="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/95 px-6 py-5 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95">
            <div class="flex items-center gap-4">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/40">
                <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {{ isEditing ? 'Edit Invoice' : 'Create Invoice' }}
              </h2>
            </div>
            <button @click="closeDialog" class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6 lg:p-8">
            <form @submit.prevent="submitInvoice" class="space-y-10">
              <div class="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                <!-- Client Information -->
                <div class="space-y-6">
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Client Information</h3>
                  <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Invoice Number <span class="text-red-500">*</span></label>
                      <input v-model="form.invoice_number" type="text" required class="form-input" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title</label>
                      <input v-model="form.title" type="text" class="form-input" placeholder="Invoice title" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Client Name <span class="text-red-500">*</span></label>
                      <input v-model="form.client_name" type="text" required class="form-input" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Client Email</label>
                      <input v-model="form.client_email" type="email" class="form-input" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Client Phone <span class="text-red-500">*</span></label>
                      <input v-model="form.client_phone" type="tel" required class="form-input" placeholder="+255 ..." />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">TIN</label>
                      <input v-model="form.tin" type="text" class="form-input" placeholder="Tax Identification Number" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">VRN</label>
                      <input v-model="form.vrn" type="text" class="form-input" placeholder="VAT Registration Number" />
                    </div>
                    <div class="sm:col-span-2">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address</label>
                      <textarea v-model="form.address" rows="2" class="form-input resize-none"></textarea>
                    </div>
                  </div>
                </div>

                <!-- Service Details -->
                <div class="space-y-6">
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Service Details</h3>
                  <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div class="sm:col-span-2">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Item Description <span class="text-red-500">*</span></label>
                      <textarea v-model="form.item_description" rows="3" required class="form-input resize-none"></textarea>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">No. of Cars <span class="text-red-500">*</span></label>
                      <input v-model.number="form.number_of_cars" type="number" min="0" required @input="calculateTotals" class="form-input" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Period (Months) <span class="text-red-500">*</span></label>
                      <input v-model.number="form.period_months" type="number" min="0" step="0.01" required @input="calculateTotals" class="form-input" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">UOM <span class="text-red-500">*</span></label>
                      <select v-model="form.uom" required class="form-input">
                        <option value="">Select UOM</option>
                        <option value="per_bus">Per Bus</option>
                        <option value="per_fleet">Per Fleet</option>
                        <option value="per_month">Per Month</option>
                        <option value="per_year">Per Year</option>
                        <option value="per_trip">Per Trip</option>
                        <option value="per_day">Per Day</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Unit Price (TZS) <span class="text-red-500">*</span></label>
                      <input v-model.number="form.unit_price" type="number" min="0" step="0.01" required @input="calculateTotals" class="form-input" placeholder="0.00" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">VAT Rate (%)</label>
                      <input v-model.number="form.tax_rate" type="number" step="0.01" min="0" max="100" @input="calculateTotals" class="form-input" placeholder="18" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Invoice Date <span class="text-red-500">*</span></label>
                      <input v-model="form.invoice_date" type="date" required class="form-input" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Due Date <span class="text-red-500">*</span></label>
                      <input v-model="form.due_date" type="date" required class="form-input" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Totals Card -->
              <div class="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900/40 shadow-sm">
                <div class="grid grid-cols-1 gap-8 sm:grid-cols-3">
                  <div class="text-center">
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Gross Value</p>
                    <p class="mt-3 text-3xl font-bold text-gray-900 dark:text-gray-100">{{ formatCurrency(form.gross_value) }}</p>
                  </div>
                  <div class="text-center border-x border-blue-100 dark:border-blue-900/40">
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">VAT Amount</p>
                    <p class="mt-3 text-3xl font-bold text-amber-600 dark:text-amber-400">{{ formatCurrency(form.tax_amount) }}</p>
                  </div>
                  <div class="text-center">
                    <p class="text-sm font-medium text-blue-600 dark:text-blue-400 font-semibold">Total Amount</p>
                    <p class="mt-3 text-4xl font-extrabold text-blue-700 dark:text-blue-300">{{ formatCurrency(form.total_amount) }}</p>
                  </div>
                </div>
              </div>

              <div class="flex justify-end gap-4 pt-6">
                <button type="button" @click="closeDialog" class="rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {{ isSubmitting ? 'Saving…' : (isEditing ? 'Update Invoice' : 'Create Invoice') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Send Invoice Dialog -->
    <Transition name="dialog">
      <div v-if="showSendDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-900">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Send Invoice</h3>
            <button @click="showSendDialog = false" class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Send Method <span class="text-red-500">*</span></label>
              <div class="grid grid-cols-3 gap-2">
                <button v-for="m in sendMethods" :key="m.value" @click="sendForm.send_method = m.value"
                  :class="['py-2.5 rounded-xl border-2 text-xs font-bold transition-all', sendForm.send_method === m.value ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400']"
                >{{ m.label }}</button>
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Personal Message</label>
              <textarea v-model="sendForm.message" rows="3" placeholder="Add a personal message..." class="form-input resize-none text-sm"></textarea>
            </div>
            <div class="px-3.5 py-2.5 bg-blue-50 dark:bg-blue-900/15 border border-blue-200 dark:border-blue-800/40 rounded-xl text-xs text-blue-700 dark:text-blue-300">
              Invoice will be sent via <strong>{{ sendForm.send_method === 'both' ? 'Email & WhatsApp' : sendForm.send_method === 'email' ? 'Email' : 'WhatsApp' }}</strong>.
            </div>
            <div class="flex gap-3 pt-1">
              <button @click="showSendDialog = false" class="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition">Cancel</button>
              <button @click="submitSendInvoice" :disabled="isSubmitting" class="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition shadow-sm shadow-green-500/25 disabled:opacity-50">
                {{ isSubmitting ? 'Sending...' : 'Send Invoice' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Mark Paid Dialog -->
    <Transition name="dialog">
      <div v-if="showMarkPaidDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-900">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/40">
                <svg class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Mark as Paid</h3>
            </div>
            <button @click="showMarkPaidDialog = false" class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Payment Date <span class="text-red-500">*</span></label>
              <input v-model="paidForm.payment_date" type="date" required class="form-input" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Payment Method <span class="text-red-500">*</span></label>
              <select v-model="paidForm.payment_method" required class="form-input">
                <option value="">Select method</option>
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="cheque">Cheque</option>
                <option value="credit_card">Credit Card</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Payment Reference</label>
              <input v-model="paidForm.payment_reference" type="text" placeholder="Transaction reference number" class="form-input" />
            </div>
            <div class="flex gap-3 pt-1">
              <button @click="showMarkPaidDialog = false" class="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition">Cancel</button>
              <button @click="submitMarkPaid" :disabled="isSubmitting" class="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition shadow-sm shadow-green-500/25 disabled:opacity-50">
                {{ isSubmitting ? 'Processing...' : 'Confirm Payment' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '@/axios'
import { useToast } from 'vue-toastification'
const toast = useToast()

const invoices = ref([])
const filter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const stats = ref({})
const showDialog = ref(false)
const showSendDialog = ref(false)
const showMarkPaidDialog = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const selectedInvoice = ref(null)

const statusTabs = [
  { label: 'All', value: '' },
  { label: 'Draft', value: 'draft' },
  { label: 'Sent', value: 'sent' },
  { label: 'Paid', value: 'paid' },
  { label: 'Cancelled', value: 'cancelled' },
]

const sendMethods = [
  { label: 'Email', value: 'email' },
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Both', value: 'both' },
]

const statCards = computed(() => [
  { label: 'Total Invoices', value: stats.value.total_invoices || 0, iconBg: 'bg-blue-600', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />' },
  { label: 'Paid', value: stats.value.paid_invoices || 0, iconBg: 'bg-green-600', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />' },
  { label: 'Pending', value: (stats.value.draft_invoices || 0) + (stats.value.sent_invoices || 0), iconBg: 'bg-yellow-500', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />' },
  { label: 'Total Amount', value: formatCurrency(stats.value.total_amount || 0), iconBg: 'bg-purple-600', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />' },
])

const sendForm = ref({ send_method: 'email', message: '' })
const paidForm = ref({ payment_date: '', payment_method: '', payment_reference: '' })

const form = ref({
  invoice_number: '', title: '', client_name: '', client_email: '', client_phone: '',
  tin: '', address: '', vrn: '', item_description: '', number_of_cars: 0,
  period_months: 0, uom: '', unit_price: 0, tax_rate: 18,
  gross_value: 0, tax_amount: 0, total_amount: 0, invoice_date: '', due_date: '', notes: ''
})

const filteredInvoices = computed(() => {
  let result = invoices.value || []
  if (filter.value.trim()) {
    const q = filter.value.toLowerCase().trim()
    result = result.filter(inv =>
      inv.invoice_number?.toLowerCase().includes(q) ||
      inv.title?.toLowerCase().includes(q) ||
      inv.client_name?.toLowerCase().includes(q) ||
      inv.item_description?.toLowerCase().includes(q)
    )
  }
  if (statusFilter.value) result = result.filter(inv => inv.status === statusFilter.value)
  return result
})

const paginatedInvoices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredInvoices.value.slice(start, start + itemsPerPage)
})

const visiblePages = computed(() => {
  const totalPages = Math.ceil((filteredInvoices.value?.length || 0) / itemsPerPage)
  const current = currentPage.value
  const delta = 2
  const range = []
  const result = []
  for (let i = Math.max(2, current - delta); i <= Math.min(totalPages - 1, current + delta); i++) range.push(i)
  if (current - delta > 2) result.push(1, '...')
  else result.push(1)
  result.push(...range)
  if (current + delta < totalPages - 1) result.push('...', totalPages)
  else if (totalPages > 1) result.push(totalPages)
  return [...new Set(result)]
})

function statusBadgeClass(status) {
  const map = {
    draft: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    sent: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20',
    paid: 'bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300 border border-green-200 dark:border-green-500/20',
    cancelled: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300 border border-red-200 dark:border-red-500/20'
  }
  return map[status] || map.draft
}

function statusDotClass(status) {
  const map = { draft: 'bg-slate-400', sent: 'bg-blue-500', paid: 'bg-green-500', cancelled: 'bg-red-500' }
  return map[status] || 'bg-slate-400'
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount || 0)
}

function generateInvoiceNumber() {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
  return `INV-${year}-${random}`
}

function calculateTotals() {
  const cars = Number(form.value.number_of_cars) || 0
  const months = Number(form.value.period_months) || 0
  const price = Number(form.value.unit_price) || 0
  const rate = Number(form.value.tax_rate) || 0
  form.value.gross_value = cars * months * price
  form.value.tax_amount = form.value.gross_value * (rate / 100)
  form.value.total_amount = form.value.gross_value + form.value.tax_amount
}

function openCreateDialog() {
  isEditing.value = false
  selectedInvoice.value = null
  form.value = {
    invoice_number: generateInvoiceNumber(), title: '', client_name: '', client_email: '',
    client_phone: '', tin: '', address: '', vrn: '', item_description: '', number_of_cars: 0,
    period_months: 0, uom: '', unit_price: 0, tax_rate: 18, gross_value: 0, tax_amount: 0,
    total_amount: 0,
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: ''
  }
  showDialog.value = true
}

function openEditDialog(invoice) {
  isEditing.value = true
  selectedInvoice.value = invoice
  form.value = { ...invoice }
  showDialog.value = true
}

function closeDialog() {
  showDialog.value = false
  isEditing.value = false
  selectedInvoice.value = null
}

async function submitInvoice() {
  isSubmitting.value = true
  try {
    if (isEditing.value) {
      await axios.put(`/api/accountant/invoices/${selectedInvoice.value.id}`, form.value)
      toast.success('Invoice updated')
    } else {
      await axios.post('/api/accountant/invoices', form.value)
      toast.success('Invoice created')
    }
    closeDialog()
    await fetchInvoices()
    await fetchStatistics()
  } catch (err) {
    toast.error('Failed to save invoice')
  } finally {
    isSubmitting.value = false
  }
}

async function fetchInvoices() {
  try {
    const res = await axios.get('/api/accountant/invoices')
    invoices.value = res.data.data || []
  } catch (err) {
    toast.error('Failed to load invoices')
  }
}

async function fetchStatistics() {
  try {
    const res = await axios.get('/api/accountant/statistics')
    stats.value = res.data.data || {}
  } catch (err) {}
}

function sendInvoice(id) {
  selectedInvoice.value = id
  sendForm.value = { send_method: 'email', message: '' }
  showSendDialog.value = true
}

async function submitSendInvoice() {
  isSubmitting.value = true
  try {
    const response = await axios.post(`/api/accountant/invoices/${selectedInvoice.value}/send`, sendForm.value)
    if (response.data.success) {
      toast.success('Invoice sent successfully')
      showSendDialog.value = false
      await fetchInvoices()
      await fetchStatistics()
      if (response.data.results?.whatsapp_url) {
        window.open(response.data.results.whatsapp_url, '_blank')
      }
    } else {
      toast.error(response.data.message)
    }
  } catch (err) {
    toast.error('Failed to send invoice')
  } finally {
    isSubmitting.value = false
  }
}

async function deleteInvoice(id) {
  if (!confirm('Are you sure you want to delete this invoice?')) return
  try {
    await axios.delete(`/api/accountant/invoices/${id}`)
    toast.success('Invoice deleted')
    await fetchInvoices()
    await fetchStatistics()
  } catch (err) {
    toast.error('Failed to delete invoice')
  }
}

function openMarkPaidDialog(invoice) {
  selectedInvoice.value = invoice
  paidForm.value = { payment_date: new Date().toISOString().split('T')[0], payment_method: '', payment_reference: '' }
  showMarkPaidDialog.value = true
}

async function submitMarkPaid() {
  isSubmitting.value = true
  try {
    await axios.post(`/api/accountant/invoices/${selectedInvoice.value.id}/mark-paid`, paidForm.value)
    toast.success('Invoice marked as paid')
    showMarkPaidDialog.value = false
    await fetchInvoices()
    await fetchStatistics()
  } catch (err) {
    toast.error('Failed to mark as paid')
  } finally {
    isSubmitting.value = false
  }
}

function changePage(page) {
  if (typeof page === 'number') currentPage.value = page
}

// ─── EXPORT & PDF ───────────────────────────────────────────────────────────────

async function exportToExcel() {
  try {
    const response = await axios.get('/api/accountant/invoices/export/excel', { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.download = 'invoices_' + new Date().toISOString().split('T')[0] + '.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Excel exported')
  } catch (err) {
    toast.error('Failed to export Excel')
  }
}

async function exportToPDF() {
  try {
    const response = await axios.get('/api/accountant/invoices/export/pdf')
    if (response.data.success) {
      const data = response.data.data
      showPDFModal(createInvoiceListHTML(data), data.filename || 'invoices-report.pdf', true)
      toast.success('Invoice list loaded')
    }
  } catch (err) {
    toast.error('Failed to load invoice list')
  }
}

async function downloadInvoice(id) {
  try {
    const response = await axios.get(`/api/accountant/invoices/${id}/download`)
    if (response.data.success) {
      const invoiceData = response.data.data
      showPDFModal(createInvoiceHTML(invoiceData), invoiceData.filename || `invoice-${invoiceData.invoice?.invoice_number}.pdf`, false)
      toast.success('Invoice loaded')
    }
  } catch (err) {
    toast.error('Failed to load invoice')
  }
}

function showPDFModal(html, filename, landscape) {
  const overlay = document.createElement('div')
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;'
  const container = document.createElement('div')
  container.style.cssText = 'background:white;border-radius:12px;max-width:96%;max-height:96%;overflow:auto;display:flex;flex-direction:column;'
  const toolbar = document.createElement('div')
  toolbar.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #e2e8f0;gap:8px;position:sticky;top:0;background:white;z-index:1;'
  toolbar.innerHTML = `
    <span style="font-weight:700;font-size:14px;color:#1e293b;">${filename}</span>
    <div style="display:flex;gap:8px;">
      <button id="pdf-download" style="background:#3b82f6;color:white;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;">Download PDF</button>
      <button id="pdf-close" style="background:#f1f5f9;color:#475569;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;">Close</button>
    </div>
  `
  const contentWrapper = document.createElement('div')
  contentWrapper.style.cssText = 'padding:20px;overflow:auto;'
  contentWrapper.innerHTML = html
  container.appendChild(toolbar)
  container.appendChild(contentWrapper)
  overlay.appendChild(container)
  document.body.appendChild(overlay)
  document.getElementById('pdf-close').onclick = () => overlay.remove()
  document.getElementById('pdf-download').onclick = async () => {
    const el = contentWrapper.firstElementChild
    await printElement(el, filename, landscape)
  }
}

async function printElement(element, filename, landscape = false) {
  try {
    try {
      const html2pdf = (await import('html2pdf.js')).default
      const opt = {
        margin: landscape ? [8, 6, 10, 6] : [10, 8, 12, 8],
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2.5, useCORS: true, logging: false, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: landscape ? 'landscape' : 'portrait', compressPDF: true },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      }
      const blob = await html2pdf().set(opt).from(element).outputPdf('blob')
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = filename
      document.body.appendChild(a); a.click()
      document.body.removeChild(a); URL.revokeObjectURL(url)
      toast.success('PDF downloaded')
      return
    } catch (e) {
      console.warn('html2pdf fallback', e)
    }
    // Fallback: browser print
    const pw = window.open('', '_blank', 'width=900,height=700')
    if (!pw) { toast.error('Popup blocked'); return }
    pw.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${filename}</title>
      <style>
        @page { size: A4 ${landscape ? 'landscape' : 'portrait'}; margin: ${landscape ? '8mm 6mm' : '10mm 8mm'}; }
        body { margin:0;font-family:Arial,Helvetica,sans-serif;font-size:10pt;-webkit-print-color-adjust:exact;print-color-adjust:exact; }
        * { box-sizing: border-box; }
        table { border-collapse: collapse; }
        tr,td,th { page-break-inside: avoid; }
        img { max-width:100%;height:auto; }
      </style></head><body>${element.outerHTML}
      <script>setTimeout(()=>window.print(),1200)<\/script></body></html>`)
    pw.document.close()
  } catch (err) {
    toast.error('PDF generation failed')
  }
}

// ─── PDF CONTENT TEMPLATES ──────────────────────────────────────────────────

function createInvoiceHTML(data) {
  const { invoice, company, status_badge, client_info, tax_info, notes } = data
  const fc = (v) => new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(v || 0)
  return `
  <div class="page" style="width:190mm;margin:0 auto;background:#fff;font-family:Arial,Helvetica,sans-serif;font-size:10pt;color:#1e293b;">
    <!-- Top accent bar -->
    <div style="height:5px;background:linear-gradient(90deg,#1e3a8a,#3b82f6);"></div>
    <!-- Header -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:20px 28px 14px;border-bottom:1px solid #e2e8f0;">
      <div style="display:flex;align-items:flex-start;gap:14px;">
        <div style="width:60px;height:60px;background:#f8fafc;border-radius:8px;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;">
          <img src="/images/tera.jpeg" alt="Logo" style="max-width:100%;max-height:100%;object-fit:contain;" onerror="this.style.display='none'" />
        </div>
        <div>
          <div style="font-size:15px;font-weight:800;color:#1e3a8a;text-transform:uppercase;letter-spacing:0.5px;">${company?.name || ''}</div>
          <div style="font-size:8.5px;color:#64748b;margin-top:4px;line-height:1.5;">${(company?.address || '').replace(/\n/g,'<br>')}${company?.contacts ? '<br>' + company.contacts : ''}</div>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:28px;font-weight:900;color:#1e3a8a;letter-spacing:-1px;">INVOICE</div>
        <div style="font-size:11px;font-weight:700;color:#475569;">#${invoice?.invoice_number || ''}</div>
        <span style="display:inline-block;margin-top:6px;padding:3px 10px;border-radius:999px;font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;background:${status_badge?.bg || '#f1f5f9'};color:${status_badge?.fg || '#475569'};">
          ${status_badge?.text || invoice?.status || ''}
        </span>
      </div>
    </div>
    <!-- Date strip -->
    <div style="display:flex;background:#f8fafc;border-bottom:1px solid #e2e8f0;">
      <div style="padding:10px 18px;border-right:1px solid #e2e8f0;flex:1;">
        <div style="font-size:7.5px;font-weight:700;text-transform:uppercase;color:#94a3b8;letter-spacing:0.8px;">Invoice Date</div>
        <div style="font-size:11px;font-weight:700;color:#1e293b;margin-top:2px;">${invoice?.invoice_date || ''}</div>
      </div>
      <div style="padding:10px 18px;border-right:1px solid #e2e8f0;flex:1;">
        <div style="font-size:7.5px;font-weight:700;text-transform:uppercase;color:#94a3b8;letter-spacing:0.8px;">Due Date</div>
        <div style="font-size:11px;font-weight:700;color:#1e293b;margin-top:2px;">${invoice?.due_date || ''}</div>
      </div>
      <div style="padding:10px 18px;flex:1;">
        <div style="font-size:7.5px;font-weight:700;text-transform:uppercase;color:#94a3b8;letter-spacing:0.8px;">VAT Rate</div>
        <div style="font-size:11px;font-weight:700;color:#1e293b;margin-top:2px;">${invoice?.tax_rate || 0}%</div>
      </div>
    </div>
    <!-- Info grid -->
    <div style="display:flex;gap:0;padding:18px 28px;border-bottom:1px solid #e2e8f0;">
      <div style="flex:1;padding-right:18px;border-right:1px solid #e2e8f0;">
        <div style="font-size:7.5px;font-weight:800;text-transform:uppercase;color:#b45309;border-bottom:1.5px solid #b45309;padding-bottom:3px;margin-bottom:8px;letter-spacing:0.8px;">Bill To</div>
        <div style="font-weight:700;color:#1e3a8a;font-size:11px;margin-bottom:5px;">${invoice?.client_name || ''}</div>
        ${(client_info || []).map(i => `<div style="display:flex;gap:6px;margin-bottom:3px;"><span style="font-size:9px;font-weight:700;color:#475569;min-width:55px;">${i.label}</span><span style="font-size:9px;color:#64748b;">${i.value}</span></div>`).join('')}
      </div>
      <div style="flex:1;padding:0 18px;border-right:1px solid #e2e8f0;">
        <div style="font-size:7.5px;font-weight:800;text-transform:uppercase;color:#b45309;border-bottom:1.5px solid #b45309;padding-bottom:3px;margin-bottom:8px;letter-spacing:0.8px;">Tax Details</div>
        ${(tax_info || []).map(i => `<div style="display:flex;gap:6px;margin-bottom:3px;"><span style="font-size:9px;font-weight:700;color:#475569;min-width:45px;">${i.label}</span><span style="font-size:9px;color:#64748b;">${i.value}</span></div>`).join('')}
      </div>
      <div style="flex:1;padding-left:18px;">
        <div style="font-size:7.5px;font-weight:800;text-transform:uppercase;color:#b45309;border-bottom:1.5px solid #b45309;padding-bottom:3px;margin-bottom:8px;letter-spacing:0.8px;">Amount Due</div>
        <div style="font-size:18px;font-weight:900;color:#1e3a8a;">${fc(invoice?.total_amount)}</div>
      </div>
    </div>
    <!-- Items Table -->
    <div style="padding:18px 28px;">
      <div style="font-size:7.5px;font-weight:800;text-transform:uppercase;color:#b45309;border-bottom:1.5px solid #b45309;padding-bottom:3px;margin-bottom:10px;letter-spacing:0.8px;">Items & Services</div>
      <table style="width:100%;border-collapse:collapse;font-size:9.5px;">
        <thead>
          <tr style="background:#1e3a8a;color:#fff;">
            <th style="padding:8px 10px;text-align:left;font-size:8px;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;">Description</th>
            <th style="padding:8px 10px;text-align:center;font-size:8px;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;">Cars</th>
            <th style="padding:8px 10px;text-align:center;font-size:8px;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;">Period</th>
            <th style="padding:8px 10px;text-align:right;font-size:8px;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;">Unit Price</th>
            <th style="padding:8px 10px;text-align:right;font-size:8px;text-transform:uppercase;letter-spacing:0.5px;font-weight:700;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background:#f8fafc;">
            <td style="padding:10px;border-bottom:1px solid #e2e8f0;">
              <div style="font-weight:700;color:#1e293b;">${invoice?.item_description || ''}</div>
              <div style="font-size:8.5px;color:#64748b;margin-top:2px;">${invoice?.uom ? 'UOM: ' + invoice.uom : ''}</div>
            </td>
            <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:center;font-weight:600;">${invoice?.number_of_cars || 1}</td>
            <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:center;font-weight:600;">${invoice?.period_months || ''} mo</td>
            <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:600;">${fc(invoice?.unit_price)}</td>
            <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:800;color:#1e3a8a;">${fc(invoice?.gross_value)}</td>
          </tr>
        </tbody>
      </table>
      <!-- Totals block -->
      <div style="display:flex;justify-content:flex-end;margin-top:12px;">
        <div style="width:240px;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
          <div style="display:flex;justify-content:space-between;padding:7px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;">
            <span style="font-size:9.5px;color:#64748b;">Subtotal</span>
            <span style="font-size:9.5px;font-weight:700;color:#1e293b;">${fc(invoice?.gross_value)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:7px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;">
            <span style="font-size:9.5px;color:#64748b;">VAT (${invoice?.tax_rate || 0}%)</span>
            <span style="font-size:9.5px;font-weight:700;color:#1e293b;">${fc(invoice?.tax_amount)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:10px 12px;background:#1e3a8a;">
            <span style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#fff;">Amount Due</span>
            <span style="font-size:14px;font-weight:900;color:#fff;">${fc(invoice?.total_amount)}</span>
          </div>
        </div>
      </div>
      <!-- Notes -->
      ${notes || invoice?.notes ? `
      <div style="margin-top:16px;">
        <div style="font-size:7.5px;font-weight:800;text-transform:uppercase;color:#b45309;border-bottom:1.5px solid #b45309;padding-bottom:3px;margin-bottom:6px;letter-spacing:0.8px;">Notes</div>
        <div style="font-size:9.5px;color:#64748b;line-height:1.5;">${notes || invoice?.notes}</div>
      </div>` : ''}
    </div>
    <!-- Footer -->
    <div style="margin-top:auto;padding:12px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;font-size:8.5px;color:#94a3b8;">
      <span>Thank you for your business.</span>
      <span>Generated: ${new Date().toLocaleDateString()}</span>
    </div>
    <div style="height:4px;background:linear-gradient(90deg,#b45309,#1e3a8a);"></div>
  </div>`
}

function createInvoiceListHTML(data) {
  const { invoices: invs, company, generated, total_records, grand_total } = data
  const fc = (v) => new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(v || 0)
  return `
  <div class="invoice-list-report" style="font-family:Arial,Helvetica,sans-serif;font-size:9.5px;color:#1e293b;padding:14px 20px;width:270mm;margin:0 auto;">
    <div style="height:4px;background:linear-gradient(90deg,#1e3a8a,#b45309);margin-bottom:14px;"></div>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
      <div>
        <div style="font-size:14px;font-weight:800;color:#1e3a8a;">${company?.name || ''}</div>
        <div style="font-size:8px;color:#94a3b8;margin-top:3px;">${company?.address || ''}</div>
      </div>
      <div style="text-align:right;font-size:8.5px;color:#475569;line-height:1.6;">
        <div style="font-size:11px;font-weight:700;color:#1e3a8a;">TAX INVOICE REPORT</div>
        <div>Generated: ${generated}</div>
        <div>Records: ${total_records} | Grand Total: <strong>${fc(grand_total)}</strong></div>
      </div>
    </div>
    <div style="border-top:1.5px solid #e2e8f0;margin-bottom:8px;"></div>
    <table style="width:100%;border-collapse:collapse;font-size:8.5px;">
      <thead>
        <tr style="background:#1e3a8a;color:#fff;">
          <th style="padding:7px 8px;text-align:left;font-size:7.5px;text-transform:uppercase;letter-spacing:0.5px;">Invoice No.</th>
          <th style="padding:7px 8px;text-align:left;font-size:7.5px;text-transform:uppercase;letter-spacing:0.5px;">Client</th>
          <th style="padding:7px 8px;text-align:left;font-size:7.5px;text-transform:uppercase;letter-spacing:0.5px;">Description</th>
          <th style="padding:7px 8px;text-align:right;font-size:7.5px;text-transform:uppercase;letter-spacing:0.5px;">Cars</th>
          <th style="padding:7px 8px;text-align:right;font-size:7.5px;text-transform:uppercase;letter-spacing:0.5px;">Period</th>
          <th style="padding:7px 8px;text-align:right;font-size:7.5px;text-transform:uppercase;letter-spacing:0.5px;">Unit Price</th>
          <th style="padding:7px 8px;text-align:right;font-size:7.5px;text-transform:uppercase;letter-spacing:0.5px;">Tax</th>
          <th style="padding:7px 8px;text-align:right;font-size:7.5px;text-transform:uppercase;letter-spacing:0.5px;">Total</th>
          <th style="padding:7px 8px;text-align:left;font-size:7.5px;text-transform:uppercase;letter-spacing:0.5px;">Date</th>
          <th style="padding:7px 8px;text-align:center;font-size:7.5px;text-transform:uppercase;letter-spacing:0.5px;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${(invs || []).map((inv, idx) => {
          const statusColors = { paid: ['#dcfce7','#15803d'], sent: ['#dbeafe','#1d4ed8'], cancelled: ['#fee2e2','#b91c1c'], draft: ['#f1f5f9','#64748b'] }
          const [bg, fg] = statusColors[inv.status] || statusColors.draft
          const desc = (inv.item_description || '').substring(0, 40) + (inv.item_description?.length > 40 ? '…' : '')
          return `
          <tr style="border-bottom:1px solid #e2e8f0;${idx % 2 === 0 ? 'background:#f8fafc;' : ''}">
            <td style="padding:6px 8px;font-weight:700;color:#1e3a8a;">${inv.invoice_number}</td>
            <td style="padding:6px 8px;font-weight:600;">${inv.client_name}</td>
            <td style="padding:6px 8px;color:#475569;">${desc}</td>
            <td style="padding:6px 8px;text-align:right;">${inv.number_of_cars}</td>
            <td style="padding:6px 8px;text-align:right;">${inv.period_months}</td>
            <td style="padding:6px 8px;text-align:right;">${fc(inv.unit_price)}</td>
            <td style="padding:6px 8px;text-align:right;">${fc(inv.tax_amount)}</td>
            <td style="padding:6px 8px;text-align:right;font-weight:800;color:#1e3a8a;">${fc(inv.total_amount)}</td>
            <td style="padding:6px 8px;color:#64748b;">${inv.invoice_date}</td>
            <td style="padding:6px 8px;text-align:center;"><span style="background:${bg};color:${fg};padding:2px 7px;border-radius:999px;font-size:7.5px;font-weight:700;text-transform:uppercase;">${inv.status}</span></td>
          </tr>`
        }).join('')}
      </tbody>
      <tfoot>
        <tr style="background:#f1f5f9;border-top:2px solid #1e3a8a;">
          <td colspan="7" style="padding:7px 8px;font-weight:700;color:#1e3a8a;font-size:9px;text-align:right;text-transform:uppercase;letter-spacing:0.5px;">Grand Total</td>
          <td style="padding:7px 8px;font-weight:900;color:#1e3a8a;font-size:11px;text-align:right;">${fc(grand_total)}</td>
          <td colspan="2"></td>
        </tr>
      </tfoot>
    </table>
    <div style="margin-top:12px;display:flex;justify-content:space-between;font-size:8px;color:#94a3b8;">
      <span>${company?.name || ''} — Confidential Invoice Report</span>
      <span>Generated: ${generated}</span>
    </div>
    <div style="height:3px;background:linear-gradient(90deg,#b45309,#1e3a8a);margin-top:10px;"></div>
  </div>`
}

onMounted(() => {
  fetchInvoices()
  fetchStatistics()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

.form-input {
  @apply block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition shadow-sm;
}

.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.2s ease;
}
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.overflow-x-auto::-webkit-scrollbar { height: 6px; }
.overflow-x-auto::-webkit-scrollbar-thumb { background-color: #CBD5E1; border-radius: 4px; }
.dark .overflow-x-auto::-webkit-scrollbar-thumb { background-color: #475569; }
.overflow-x-auto::-webkit-scrollbar-track { background: transparent; }
</style>