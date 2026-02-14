<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-950 dark:via-blue-950/10 dark:to-gray-950 px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">

      <!-- Header -->
      <div class="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            Invoice Management
          </h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Create and manage accountant invoices
          </p>
        </div>

        <button
          @click="openCreateDialog"
          class="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:shadow-blue-500/20"
        >
          <svg class="h-5 w-5 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Invoice
        </button>
      </div>

      <!-- Statistics Cards -->
      <div class="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Total Invoices -->
        <div class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md shadow-gray-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-gray-300/50 hover:-translate-y-1 dark:bg-gray-900 dark:shadow-gray-900/50">
          <div class="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-500/5 transition-transform group-hover:scale-110" />
          <div class="relative flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Invoices</p>
              <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.total_invoices || 0 }}</p>
            </div>
            <div class="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 shadow-lg shadow-blue-500/30">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Paid Invoices -->
        <div class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md shadow-gray-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-gray-300/50 hover:-translate-y-1 dark:bg-gray-900 dark:shadow-gray-900/50">
          <div class="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-green-500/5 transition-transform group-hover:scale-110" />
          <div class="relative flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Paid Invoices</p>
              <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.paid_invoices || 0 }}</p>
            </div>
            <div class="rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-3 shadow-lg shadow-green-500/30">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Pending Invoices -->
        <div class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md shadow-gray-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-gray-300/50 hover:-translate-y-1 dark:bg-gray-900 dark:shadow-gray-900/50">
          <div class="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-yellow-500/5 transition-transform group-hover:scale-110" />
          <div class="relative flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Invoices</p>
              <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{{ (stats.draft_invoices || 0) + (stats.sent_invoices || 0) }}</p>
            </div>
            <div class="rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 shadow-lg shadow-yellow-500/30">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Amount -->
        <div class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md shadow-gray-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-gray-300/50 hover:-translate-y-1 dark:bg-gray-900 dark:shadow-gray-900/50">
          <div class="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-purple-500/5 transition-transform group-hover:scale-110" />
          <div class="relative flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Amount</p>
              <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{{ formatCurrency(stats.total_amount || 0) }}</p>
            </div>
            <div class="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-3 shadow-lg shadow-purple-500/30">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Search + Filters + Export -->
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="relative flex-1 max-w-lg">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="filter"
            type="text"
            placeholder="Search by invoice number, client, item..."
            class="block w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 sm:text-sm"
          />
        </div>

        <div class="flex flex-wrap gap-3">
          <select
            v-model="statusFilter"
            class="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            @click="exportToExcel"
            class="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <svg class="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Excel
          </button>

          <button
            @click="exportToPDF"
            class="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <svg class="h-4 w-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      <!-- Table - EXACT FORMAT PRESERVED -->
      <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/50 dark:border-gray-800 dark:bg-gray-900 dark:shadow-gray-900/50">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead class="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th class="w-12 px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">#</th>
                <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Invoice Number</th>
                <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Client</th>
                <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Item Description</th>
                <th class="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">No. of Cars</th>
                <th class="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Period (Months)</th>
                <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">UOM</th>
                <th class="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Unit Price</th>
                <th class="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Gross Value</th>
                <th class="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Total Amount</th>
                <th class="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Status</th>
                <th class="w-32 px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="(invoice, index) in paginatedInvoices"
                :key="invoice.id"
                class="group transition-colors duration-150 hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
              >
                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {{ index + 1 + (currentPage - 1) * itemsPerPage }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {{ invoice.invoice_number }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ invoice.client_name }}
                </td>
                <td class="max-w-xs px-6 py-4 text-sm text-gray-700 dark:text-gray-300 truncate">
                  {{ invoice.item_description }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ invoice.number_of_cars }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ invoice.period_months }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {{ invoice.uom }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {{ formatCurrency(invoice.unit_price) }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {{ formatCurrency(invoice.gross_value) }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-bold text-blue-600 dark:text-blue-400">
                  {{ formatCurrency(invoice.total_amount) }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-center">
                  <span :class="statusBadgeClass(invoice.status)" class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold">
                    <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass(invoice.status)" />
                    {{ invoice.status ? invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) : 'N/A' }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-center text-sm">
                  <div class="flex justify-center gap-2">
                    <button @click="openEditDialog(invoice)" class="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-700">
                      Edit
                    </button>
                    <button v-if="invoice.status === 'draft'" @click="sendInvoice(invoice.id)" class="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-green-700">
                      Send
                    </button>
                    <button v-if="invoice.status === 'sent'" @click="openMarkPaidDialog(invoice)" class="rounded-lg bg-purple-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-purple-700">
                      Mark Paid
                    </button>
                    <button v-if="['draft', 'cancelled'].includes(invoice.status)" @click="deleteInvoice(invoice.id)" class="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-red-700">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="paginatedInvoices.length === 0" class="py-20 text-center">
          <div class="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <svg class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p class="mt-6 text-lg font-semibold text-gray-900 dark:text-gray-100">
            {{ filter ? 'No matching invoices found' : 'No invoices yet' }}
          </p>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {{ filter ? 'Try adjusting your search criteria' : 'Get started by creating your first invoice' }}
          </p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredInvoices.length > itemsPerPage" class="mt-6 flex justify-center">
        <nav class="flex items-center gap-2">
          <button
            @click="currentPage > 1 && currentPage--"
            :disabled="currentPage === 1"
            class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Previous
          </button>
          
          <div class="flex gap-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="typeof page === 'number' && changePage(page)"
              :class="[
                'rounded-lg px-4 py-2 text-sm font-medium',
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : typeof page === 'number'
                  ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                  : 'text-gray-400 cursor-default'
              ]"
              :disabled="typeof page !== 'number'"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="currentPage < Math.ceil(filteredInvoices.length / itemsPerPage) && currentPage++"
            :disabled="currentPage >= Math.ceil(filteredInvoices.length / itemsPerPage)"
            class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Next
          </button>
        </nav>
      </div>

      <!-- Create / Edit Invoice Dialog -->
      <div v-if="showDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
        <div class="w-full max-w-4xl rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ isEditing ? 'Edit Invoice' : 'Create Invoice' }}
            </h3>
            <button @click="closeDialog" class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitInvoice" class="space-y-6">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Invoice Number <span class="text-red-500">*</span></label>
                <input v-model="form.invoice_number" type="text" required class="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Client Name <span class="text-red-500">*</span></label>
                <input v-model="form.client_name" type="text" required class="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Client Email</label>
                <input v-model="form.client_email" type="email" class="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Client Phone <span class="text-blue-500">*</span> (for WhatsApp)</label>
                <input v-model="form.client_phone" type="tel" required class="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" placeholder="+255123456789" />
              </div>

              <div class="lg:col-span-2">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Item Description <span class="text-red-500">*</span></label>
                <textarea v-model="form.item_description" rows="3" required class="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" placeholder="Describe the items/services"></textarea>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Number of Cars <span class="text-red-500">*</span></label>
                <input v-model.number="form.number_of_cars" type="number" min="0" step="1" required @input="calculateTotals" class="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Period (Months) <span class="text-red-500">*</span></label>
                <input v-model.number="form.period_months" type="number" min="0" step="0.01" required @input="calculateTotals" class="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">UOM <span class="text-red-500">*</span></label>
                <select v-model="form.uom" required class="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                  <option value="">Select Unit of Measure</option>
                  <option value="per_bus">Per Bus</option>
                  <option value="per_fleet">Per Fleet</option>
                  <option value="per_month">Per Month</option>
                  <option value="per_year">Per Year</option>
                  <option value="per_trip">Per Trip</option>
                  <option value="per_day">Per Day</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Unit Price (TZS) <span class="text-red-500">*</span></label>
                <input v-model.number="form.unit_price" type="number" min="0" step="0.01" required @input="calculateTotals" class="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" placeholder="0.00" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">VAT Rate (%)</label>
                <input v-model.number="form.tax_rate" type="number" step="0.01" min="0" max="100" @input="calculateTotals" class="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" placeholder="18" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Invoice Date <span class="text-red-500">*</span></label>
                <input v-model="form.invoice_date" type="date" required class="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Due Date <span class="text-red-500">*</span></label>
                <input v-model="form.due_date" type="date" required class="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
              </div>

              <div class="lg:col-span-3">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Notes</label>
                <textarea v-model="form.notes" rows="3" class="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" placeholder="Additional notes..."></textarea>
              </div>
            </div>

            <!-- Calculated Totals -->
            <div class="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900/50">
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Gross Value:</p>
                  <p class="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">{{ formatCurrency(form.gross_value) }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Tax Amount:</p>
                  <p class="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">{{ formatCurrency(form.tax_amount) }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Amount:</p>
                  <p class="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">{{ formatCurrency(form.total_amount) }}</p>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-4 pt-6">
              <button type="button" @click="closeDialog" class="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                Cancel
              </button>
              <button type="submit" :disabled="isSubmitting" class="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed">
                {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Invoice' : 'Create Invoice') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Send Invoice Dialog -->
      <div v-if="showSendDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
        <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-900">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Send Invoice</h3>
            <button @click="showSendDialog = false" class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitSendInvoice" class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Send Method <span class="text-red-500">*</span></label>
              <select v-model="sendForm.send_method" required class="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
                <option value="email">Email Only</option>
                <option value="whatsapp">WhatsApp Only</option>
                <option value="both">Both Email & WhatsApp</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Personal Message (Optional)</label>
              <textarea v-model="sendForm.message" rows="4" class="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100" placeholder="Add a personal message to include with the invoice..."></textarea>
            </div>

            <div class="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-xl p-4">
              <p class="text-sm text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> 
                <span v-if="sendForm.send_method === 'email'">The invoice will be sent via email to the client's email address.</span>
                <span v-else-if="sendForm.send_method === 'whatsapp'">The invoice will be sent via WhatsApp to the client's phone number.</span>
                <span v-else>The invoice will be sent via both email and WhatsApp.</span>
              </p>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button type="button" @click="showSendDialog = false" class="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-700">
                Cancel
              </button>
              <button type="submit" :disabled="isSubmitting" class="rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/30 transition-all hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed">
                {{ isSubmitting ? 'Sending...' : 'Send Invoice' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Mark as Paid Dialog -->
      <div v-if="showMarkPaidDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
        <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-900">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Mark Invoice as Paid</h3>
            <button @click="showMarkPaidDialog = false" class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitMarkPaid" class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Payment Date <span class="text-red-500">*</span></label>
              <input v-model="paidForm.payment_date" type="date" required class="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Payment Method <span class="text-red-500">*</span></label>
              <select v-model="paidForm.payment_method" required class="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                <option value="">Select payment method</option>
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="cheque">Cheque</option>
                <option value="credit_card">Credit Card</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Payment Reference</label>
              <input v-model="paidForm.payment_reference" type="text" class="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" placeholder="Transaction reference number" />
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button type="button" @click="showMarkPaidDialog = false" class="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                Cancel
              </button>
              <button type="submit" :disabled="isSubmitting" class="rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/30 transition-all hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed">
                {{ isSubmitting ? 'Processing...' : 'Mark as Paid' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
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
const sendForm = ref({
  send_method: 'email',
  message: ''
})
const isEditing = ref(false)
const isSubmitting = ref(false)
const selectedInvoice = ref(null)

const form = ref({
  invoice_number: '',
  client_name: '',
  client_email: '',
  client_phone: '',
  item_description: '',
  number_of_cars: 0,
  period_months: 0,
  uom: '',
  unit_price: 0,
  tax_rate: 18,
  gross_value: 0,
  tax_amount: 0,
  total_amount: 0,
  invoice_date: '',
  due_date: '',
  notes: ''
})

const paidForm = ref({
  payment_date: '',
  payment_method: '',
  payment_reference: ''
})

const filteredInvoices = computed(() => {
  let result = invoices.value || []

  if (filter.value.trim()) {
    const q = filter.value.toLowerCase().trim()
    result = result.filter(inv =>
      inv.invoice_number?.toLowerCase().includes(q) ||
      inv.client_name?.toLowerCase().includes(q) ||
      inv.item_description?.toLowerCase().includes(q)
    )
  }

  if (statusFilter.value) {
    result = result.filter(inv => inv.status === statusFilter.value)
  }

  return result
})

const paginatedInvoices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredInvoices.value.slice(start, start + itemsPerPage)
})

const generateInvoiceNumber = () => {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
  return `INV-${year}-${random}`
}

const calculateTotals = () => {
  const cars = Number(form.value.number_of_cars) || 0
  const months = Number(form.value.period_months) || 0
  const price = Number(form.value.unit_price) || 0
  const rate = Number(form.value.tax_rate) || 0

  form.value.gross_value = cars * months * price
  form.value.tax_amount = form.value.gross_value * (rate / 100)
  form.value.total_amount = form.value.gross_value + form.value.tax_amount
}

const openCreateDialog = () => {
  isEditing.value = false
  selectedInvoice.value = null
  form.value = {
    invoice_number: generateInvoiceNumber(),
    client_name: '',
    client_email: '',
    client_phone: '',
    item_description: '',
    number_of_cars: 0,
    period_months: 0,
    uom: '',
    unit_price: 0,
    tax_rate: 18,
    gross_value: 0,
    tax_amount: 0,
    total_amount: 0,
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: ''
  }
  showDialog.value = true
}

const openEditDialog = (invoice) => {
  isEditing.value = true
  selectedInvoice.value = invoice
  form.value = { ...invoice }
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
  isEditing.value = false
  selectedInvoice.value = null
}

const submitInvoice = async () => {
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
    console.error(err)
  } finally {
    isSubmitting.value = false
  }
}

const fetchInvoices = async () => {
  try {
    const res = await axios.get('/api/accountant/invoices')
    invoices.value = res.data.data || []
  } catch (err) {
    toast.error('Failed to load invoices')
  }
}

const fetchStatistics = async () => {
  try {
    const res = await axios.get('/api/accountant/statistics')
    stats.value = res.data.data || {}
  } catch (err) {
    toast.error('Failed to load statistics')
  }
}

const statusBadgeClass = (status) => {
  const map = {
    draft: 'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300',
    sent: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-300',
    paid: 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/30 dark:text-green-300',
    cancelled: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/30 dark:text-red-300'
  }
  return map[status] || 'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300'
}

const statusDotClass = (status) => {
  const map = {
    draft: 'bg-gray-400 dark:bg-gray-500',
    sent: 'bg-blue-500 dark:bg-blue-400',
    paid: 'bg-green-500 dark:bg-green-400',
    cancelled: 'bg-red-500 dark:bg-red-400'
  }
  return map[status] || 'bg-gray-400 dark:bg-gray-500'
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 2
  }).format(amount || 0)
}

const sendInvoice = (id) => {
  selectedInvoice.value = id
  sendForm.value = {
    send_method: 'email',
    message: ''
  }
  showSendDialog.value = true
}

const submitSendInvoice = async () => {
  isSubmitting.value = true
  try {
    const response = await axios.post(`/api/accountant/invoices/${selectedInvoice.value}/send`, sendForm.value)
    
    if (response.data.success) {
      toast.success('Invoice sent successfully')
      showSendDialog.value = false
      await fetchInvoices()
      await fetchStatistics()
      
      // Show detailed results if available
      if (response.data.results) {
        let message = 'Invoice sent via:\n'
        Object.entries(response.data.results).forEach(([method, result]) => {
          message += `${method}: ${result}\n`
        })
        toast.info(message.trim())
        
        // Open WhatsApp URL if provided
        if (response.data.results.whatsapp_url) {
          window.open(response.data.results.whatsapp_url, '_blank')
        }
      }
    } else {
      toast.error(response.data.message)
    }
  } catch (err) {
    toast.error('Failed to send invoice')
    console.error(err)
  } finally {
    isSubmitting.value = false
  }
}

const deleteInvoice = async (id) => {
  if (!confirm('Are you sure you want to delete this invoice?')) return
  try {
    await axios.delete(`/api/accountant/invoices/${id}`)
    toast.success('Invoice deleted successfully')
    await fetchInvoices()
    await fetchStatistics()
  } catch (err) {
    toast.error('Failed to delete invoice')
  }
}

const openMarkPaidDialog = (invoice) => {
  selectedInvoice.value = invoice
  paidForm.value = {
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: '',
    payment_reference: ''
  }
  showMarkPaidDialog.value = true
}

const submitMarkPaid = async () => {
  isSubmitting.value = true
  try {
    await axios.post(`/api/accountant/invoices/${selectedInvoice.value.id}/mark-paid`, paidForm.value)
    toast.success('Invoice marked as paid successfully')
    showMarkPaidDialog.value = false
    await fetchInvoices()
    await fetchStatistics()
  } catch (err) {
    toast.error('Failed to mark invoice as paid')
  } finally {
    isSubmitting.value = false
  }
}

const changePage = (page) => {
  if (typeof page === 'number') {
    currentPage.value = page
  }
}

const visiblePages = computed(() => {
  const totalPages = Math.ceil((filteredInvoices.value?.length || 0) / itemsPerPage)
  const current = currentPage.value
  const delta = 2
  const range = []
  const rangeWithDots = []

  for (let i = Math.max(2, current - delta); i <= Math.min(totalPages - 1, current + delta); i++) {
    range.push(i)
  }

  if (current - delta > 2) {
    rangeWithDots.push(1, '...')
  } else {
    rangeWithDots.push(1)
  }

  rangeWithDots.push(...range)

  if (current + delta < totalPages - 1) {
    rangeWithDots.push('...', totalPages)
  } else {
    rangeWithDots.push(totalPages)
  }

  return [...new Set(rangeWithDots)]
})

const exportToExcel = async () => {
  try {
    const response = await axios.get('/api/accountant/invoices/export/excel', { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.download = 'invoices_' + new Date().toISOString().split('T')[0] + '.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Excel export downloaded successfully')
  } catch (err) {
    toast.error('Failed to export Excel')
    console.error(err)
  }
}

const exportToPDF = async () => {
  try {
    const response = await axios.get('/api/accountant/invoices/export/pdf', { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'invoices_' + new Date().toISOString().split('T')[0] + '.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('PDF export downloaded successfully')
  } catch (err) {
    toast.error('Failed to export PDF')
    console.error(err)
  }
}

onMounted(() => {
  fetchInvoices()
  fetchStatistics()
})
</script>