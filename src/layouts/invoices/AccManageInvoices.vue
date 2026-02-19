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
            placeholder="Search by invoice number, title, client, item..."
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

      <!-- Table -->
      <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/50 dark:border-gray-800 dark:bg-gray-900 dark:shadow-gray-900/50">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead class="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th class="w-12 px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">#</th>
                <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Invoice Number</th>
                <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Title</th>
                <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Client</th>
                <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">TIN</th>
                <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">VRN</th>
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
                  {{ invoice.title || '-' }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ invoice.client_name }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {{ invoice.tin || '-' }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {{ invoice.vrn || '-' }}
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
                    <button @click="downloadInvoice(invoice.id)" class="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-700">
                      Download
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

      <!-- Create / Edit Dialog -->
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
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input v-model="form.title" type="text" class="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" placeholder="Enter invoice title" />
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
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">TIN (Tax Identification Number)</label>
                <input v-model="form.tin" type="text" class="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" placeholder="Enter TIN number" />
              </div>
              <div class="lg:col-span-2">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Address</label>
                <textarea v-model="form.address" rows="2" class="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" placeholder="Enter client address"></textarea>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">VRN (VAT Registration Number)</label>
                <input v-model="form.vrn" type="text" class="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" placeholder="Enter VRN number" />
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
  title: '',
  client_name: '',
  client_email: '',
  client_phone: '',
  tin: '',
  address: '',
  vrn: '',
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
      inv.title?.toLowerCase().includes(q) ||
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
    title: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    tin: '',
    address: '',
    vrn: '',
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
     
      if (response.data.results) {
        let message = 'Invoice sent via:\n'
        Object.entries(response.data.results).forEach(([method, result]) => {
          message += `${method}: ${result}\n`
        })
        toast.info(message.trim())
       
        if (response.data.results.whatsapp_url) {
          const newWindow = window.open(response.data.results.whatsapp_url, '_blank')
          if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            window.location.href = response.data.results.whatsapp_url
          }
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

// ────────────────────────────────────────────────
// EXPORT & PDF FUNCTIONS
// ────────────────────────────────────────────────

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
    const response = await axios.get('/api/accountant/invoices/export/pdf')
   
    if (response.data.success) {
      const data = response.data.data
     
      const modal = document.createElement('div')
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      `
     
      const container = document.createElement('div')
      container.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 8px;
        max-width: 95%;
        max-height: 95%;
        overflow: auto;
      `
     
      const listHtml = createInvoiceListHTML(data)
      container.innerHTML = `
        <div style="margin-bottom: 20px; text-align: right;">
          <button onclick="this.closest('div[style*=fixed]').remove()" style="
            background: #ef4444;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 10px;
          ">Close</button>
          <button onclick="generateListPDFFromHTML(this)" style="
            background: #3b82f6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
          ">Download PDF</button>
        </div>
        ${listHtml}
      `
     
      modal.appendChild(container)
      document.body.appendChild(modal)
     
      window.generateListPDFFromHTML = (button) => {
        const container = button.closest('div[style*=background]')
        const listElement = container.querySelector('.invoice-list-report')
       
        printInvoiceList(listElement, data.filename || 'invoices-report.pdf')
      }
     
      toast.success('Invoice list loaded successfully')
    }
  } catch (err) {
    toast.error('Failed to load invoice list')
    console.error(err)
  }
}

const createInvoiceListHTML = (data) => {
  const { invoices, company, generated, total_records, grand_total } = data

  return `
    <div class="invoice-list-report" style="font-family: Arial, sans-serif; font-size: 10px; color: #1e293b; padding: 16px 24px;">
      <div style="height: 5px; background: linear-gradient(90deg, #1a3a5c, #c8932a); margin-bottom: 18px;"></div>
     
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
        <div>
          <div style="font-size: 16px; font-weight: 800; color: #1a3a5c;">${company.name}</div>
          <div style="font-size: 8.5px; color: #94a3b8; margin-top: 4px; max-width: 360px; line-height: 1.55;">
            ${company.address}<br>
            ${company.contacts}
          </div>
        </div>
        <div style="text-align: right; font-size: 9px; color: #475569; line-height: 1.7;">
          <div style="font-size: 12px; color: #1a3a5c; font-weight: 700; margin-bottom: 2px;">TAX INVOICE REPORT</div>
          Generated: ${generated}<br>
          Total Records: ${total_records}<br>
          Grand Total: <strong style="color:#1a3a5c;">${formatCurrency(grand_total)} Tsh</strong>
        </div>
      </div>
      <div style="border: none; border-top: 1.5px solid #e2e8f0; margin: 12px 0 9px;"></div>
      <span style="font-size: 8.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #c8932a; border-bottom: 2px solid #c8932a; padding-bottom: 4px; margin-bottom: 9px; display: inline-block;">Invoice Listing</span>
      <table style="width: 100%; border-collapse: collapse; font-size: 9.5px;">
        <thead>
          <tr style="background: #1a3a5c; color: #fff;">
            <th style="padding: 8px 9px; font-size: 8px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; text-align: left;">Invoice No.</th>
            <th style="padding: 8px 9px; font-size: 8px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; text-align: left;">Client</th>
            <th style="padding: 8px 9px; font-size: 8px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; text-align: left;">Description</th>
            <th style="padding: 8px 9px; font-size: 8px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; text-align: right;">Cars</th>
            <th style="padding: 8px 9px; font-size: 8px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; text-align: right;">Period</th>
            <th style="padding: 8px 9px; font-size: 8px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; text-align: right;">Unit Price (Tsh)</th>
            <th style="padding: 8px 9px; font-size: 8px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; text-align: right;">Tax (Tsh)</th>
            <th style="padding: 8px 9px; font-size: 8px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; text-align: right;">Total (Tsh)</th>
            <th style="padding: 8px 9px; font-size: 8px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; text-align: left;">Date</th>
            <th style="padding: 8px 9px; font-size: 8px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; text-align: center;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${invoices.map((inv, idx) => {
            const status = inv.status || 'draft'
            const [bg, fg] = status === 'paid' ? ['#dcfce7', '#15803d'] :
                           status === 'sent' ? ['#dbeafe', '#1d4ed8'] :
                           status === 'unpaid' ? ['#fee2e2', '#b91c1c'] :
                           ['#f1f5f9', '#64748b']
            const badge = `<span style="background:${bg};color:${fg};padding:2px 9px;border-radius:999px;font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">${status}</span>`
            const desc = inv.item_description ? inv.item_description.substring(0, 46) + (inv.item_description.length > 46 ? '…' : '') : ''
           
            return `
              <tr style="border-bottom: 1px solid #e2e8f0; ${idx % 2 === 0 ? 'background: #f8fafc;' : ''}">
                <td style="padding: 6.5px 9px; color: #475569;">${inv.invoice_number}</td>
                <td style="padding: 6.5px 9px; color: #475569; font-weight: 600;">${inv.client_name}</td>
                <td style="padding: 6.5px 9px; color: #475569;">${desc}</td>
                <td style="padding: 6.5px 9px; color: #475569; text-align: right;">${inv.number_of_cars}</td>
                <td style="padding: 6.5px 9px; color: #475569; text-align: right;">${inv.period_months}</td>
                <td style="padding: 6.5px 9px; color: #475569; text-align: right;">${formatCurrency(inv.unit_price)}</td>
                <td style="padding: 6.5px 9px; color: #475569; text-align: right;">${formatCurrency(inv.tax_amount)}</td>
                <td style="padding: 6.5px 9px; color: #475569; text-align: right; font-weight: 700; color: #1a3a5c;">${formatCurrency(inv.total_amount)}</td>
                <td style="padding: 6.5px 9px; color: #475569;">${inv.invoice_date}</td>
                <td style="padding: 6.5px 9px; color: #475569; text-align: center;">${badge}</td>
              </tr>
            `
          }).join('')}
        </tbody>
        <tfoot>
          <tr style="background: #f1f5f9; border-top: 2px solid #1a3a5c;">
            <td colspan="7" style="padding: 7px 9px; font-weight: 700; color: #1a3a5c; font-size: 10px; text-align: right; letter-spacing: 0.5px;">GRAND TOTAL</td>
            <td style="padding: 7px 9px; font-weight: 700; color: #1a3a5c; font-size: 12px; text-align: right;">${formatCurrency(grand_total)} Tsh</td>
            <td colspan="2"></td>
          </tr>
        </tfoot>
      </table>
      <div style="margin-top: 16px; display: flex; justify-content: space-between; font-size: 8.5px; color: #94a3b8;">
        <span>${company.name} — Confidential Invoice Report</span>
        <span>Generated on ${generated}</span>
      </div>
      <div style="height: 4px; background: linear-gradient(90deg, #c8932a, #1a3a5c); margin-top: 14px;"></div>
    </div>
  `
}

const downloadInvoice = async (id) => {
  try {
    const response = await axios.get(`/api/accountant/invoices/${id}/download`)
   
    if (response.data.success) {
      const invoiceData = response.data.data
     
      const modal = document.createElement('div')
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      `
     
      const container = document.createElement('div')
      container.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 8px;
        max-width: 90%;
        max-height: 90%;
        overflow: auto;
      `
     
      const invoiceHtml = createInvoiceHTML(invoiceData)
      container.innerHTML = `
        <div style="margin-bottom: 20px; text-align: right;">
          <button onclick="this.closest('div[style*=fixed]').remove()" style="
            background: #ef4444;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 10px;
          ">Close</button>
          <button onclick="generatePDFFromHTML(this)" style="
            background: #3b82f6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
          ">Download PDF</button>
        </div>
        ${invoiceHtml}
      `
     
      modal.appendChild(container)
      document.body.appendChild(modal)
     
      window.generatePDFFromHTML = (button) => {
        const container = button.closest('div[style*=background]')
        const invoiceElement = container.querySelector('.page')
       
        printInvoice(invoiceElement, invoiceData.filename || `invoice-${invoiceData.invoice.invoice_number}.pdf`)
      }
     
      toast.success('Invoice loaded successfully')
    }
  } catch (err) {
    toast.error('Failed to load invoice')
    console.error(err)
  }
}

const createInvoiceHTML = (data) => {
  const { invoice, company, status_badge, client_info, tax_info, notes } = data

  return `
    <div class="page" style="width: 210mm; min-height: 297mm; margin: 0 auto; background: #fff; display: flex; flex-direction: column; position: relative;">
      <div style="height: 6px; background: #1e3a8a;"></div>
      <div style="height: 2px; background: #b45309;"></div>
      <div style="padding: 30px 44px; display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #e2e8f0;">
        <div style="display: flex; align-items: flex-start; gap: 20px;">
          <div style="width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; background: #f8fafc; border-radius: 8px; padding: 8px; flex-shrink: 0;">
            <img src="/images/tera.jpeg" alt="TERA Logo" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
          </div>
          <div>
            <div style="font-size: 18px; font-weight: 800; color: #1e3a8a; text-transform: uppercase;">${company.name}</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 5px;">
              ${company.address}<br>
              ${company.contacts}
            </div>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 36px; font-weight: 900; color: #1e3a8a;">INVOICE</div>
          <div style="font-weight: 700;">#${invoice.invoice_number}</div>
          <span style="display: inline-block; margin-top: 8px; padding: 4px 12px; border-radius: 999px; font-size: 9px; font-weight: 700; text-transform: uppercase; background: ${status_badge.bg}; color: ${status_badge.fg};">
            ${status_badge.text}
          </span>
        </div>
      </div>
      <div style="display: table; width: 100%; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
        <div style="display: table-cell; padding: 15px 22px; border-right: 1px solid #e2e8f0;">
          <span style="font-size: 8px; font-weight: 700; text-transform: uppercase; color: #94a3b8;">Date</span><br>
          <span style="font-size: 12px; font-weight: 700; color: #1e293b;">${invoice.invoice_date}</span>
        </div>
        <div style="display: table-cell; padding: 15px 22px; border-right: 1px solid #e2e8f0;">
          <span style="font-size: 8px; font-weight: 700; text-transform: uppercase; color: #94a3b8;">Due Date</span><br>
          <span style="font-size: 12px; font-weight: 700; color: #1e293b;">${invoice.due_date}</span>
        </div>
        <div style="display: table-cell; padding: 15px 22px;">
          <span style="font-size: 8px; font-weight: 700; text-transform: uppercase; color: #94a3b8;">Tax Rate</span><br>
          <span style="font-size: 12px; font-weight: 700; color: #1e293b;">${invoice.tax_rate}%</span>
        </div>
      </div>
      <div style="padding: 30px 44px; flex: 1;">
        <div style="display: table; width: 100%; margin-bottom: 30px;">
          <div style="display: table-cell; width: 33%; padding-right: 20px; vertical-align: top;">
            <div style="font-size: 9px; font-weight: 800; text-transform: uppercase; color: #b45309; border-bottom: 2px solid #b45309; padding-bottom: 3px; margin-bottom: 10px;">Bill To</div>
            <div style="font-weight: 700; color: #1e3a8a; margin-bottom: 5px;">${invoice.client_name}</div>
            <table style="width: 100%; border-collapse: collapse;">
              ${client_info.map(info => `
                <tr><td style="padding: 2px 0; font-size: 11px; color: #1e293b; font-weight: 700; width: 70px;">${info.label}</td><td style="padding: 2px 0; font-size: 11px; color: #475569;">${info.value}</td></tr>
              `).join('')}
            </table>
          </div>
          <div style="display: table-cell; width: 33%; padding-right: 20px; vertical-align: top;">
            <div style="font-size: 9px; font-weight: 800; text-transform: uppercase; color: #b45309; border-bottom: 2px solid #b45309; padding-bottom: 3px; margin-bottom: 10px;">Tax Details</div>
            <table style="width: 100%; border-collapse: collapse;">
              ${tax_info.map(info => `
                <tr><td style="padding: 2px 0; font-size: 11px; color: #1e293b; font-weight: 700; width: 70px;">${info.label}</td><td style="padding: 2px 0; font-size: 11px; color: #475569;">${info.value}</td></tr>
              `).join('')}
            </table>
          </div>
          <div style="display: table-cell; width: 33%; vertical-align: top;">
            <div style="font-size: 9px; font-weight: 800; text-transform: uppercase; color: #b45309; border-bottom: 2px solid #b45309; padding-bottom: 3px; margin-bottom: 10px;">Payment Due</div>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 2px 0; font-size: 11px; color: #1e293b; font-weight: 700; width: 70px;">Total</td><td style="padding: 2px 0; font-size: 11px; color: #1e293b; font-weight: 800;">${formatCurrency(invoice.total_amount)} Tsh</td></tr>
            </table>
          </div>
        </div>
        <div style="font-size: 9px; font-weight: 800; text-transform: uppercase; color: #b45309; border-bottom: 2px solid #b45309; padding-bottom: 3px; margin-bottom: 10px;">Items & Services</div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr>
              <th style="background: #1e3a8a; color: #fff; padding: 10px; font-size: 9px; text-transform: uppercase; text-align: left;">Description</th>
              <th style="background: #1e3a8a; color: #fff; padding: 10px; font-size: 9px; text-transform: uppercase; text-align: right;">Qty</th>
              <th style="background: #1e3a8a; color: #fff; padding: 10px; font-size: 9px; text-transform: uppercase; text-align: right;">Price</th>
              <th style="background: #1e3a8a; color: #fff; padding: 10px; font-size: 9px; text-transform: uppercase; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; font-size: 11px;">
                <strong>${invoice.item_description}</strong><br>
                <small style="color: #64748b;">Period: ${invoice.period_months} Mo.</small>
              </td>
              <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; font-size: 11px; text-align: right;">${invoice.number_of_cars || 1}</td>
              <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; font-size: 11px; text-align: right;">${formatCurrency(invoice.unit_price)}</td>
              <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0; font-size: 11px; text-align: right; font-weight: 700;">${formatCurrency(invoice.total_amount)}</td>
            </tr>
          </tbody>
        </table>
        <div style="width: 100%; display: table;">
          <div style="display: table-cell; width: 60%; vertical-align: top;">
            <div style="font-size: 9px; font-weight: 800; text-transform: uppercase; color: #b45309; border-bottom: 2px solid #b45309; padding-bottom: 3px; margin-bottom: 10px;">Notes</div>
            <div style="font-size: 11px; color: #64748b;">${notes || 'No notes provided'}</div>
          </div>
          <div style="display: table-cell; width: 40%; vertical-align: top;">
            <br><br><br>
            <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
              <div style="display: table; width: 100%; padding: 8px 15px; border-bottom: 1px solid #e2e8f0;">
                <span style="display: table-cell; font-size: 11px;">Subtotal</span>
                <span style="display: table-cell; text-align: right; font-weight: 700;">${formatCurrency(invoice.gross_value)}</span>
              </div>
              <div style="display: table; width: 100%; padding: 8px 15px; border-bottom: 1px solid #e2e8f0;">
                <span style="display: table-cell; font-size: 11px;">VAT (${invoice.tax_rate}%)</span>
                <span style="display: table-cell; text-align: right; font-weight: 700;">${formatCurrency(invoice.tax_amount)}</span>
              </div>
              <div style="display: table; width: 100%; padding: 13px 15px; background: #1e3a8a; color: #fff;">
                <span style="display: table-cell; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;">Amount Due</span>
                <span style="display: table-cell; text-align: right; font-weight: 800; font-size: 16px;">${formatCurrency(invoice.total_amount)} Tsh</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="padding: 20px 44px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8;">
        <div style="display: flex; justify-content: space-between;">
          <span>Thank you for your business.</span>
          <span style="text-align: right;">Generated on ${new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  `
}

const printInvoice = async (element, filename = 'invoice.pdf') => {
  try {
    // Attempt html2pdf first (best quality when it works)
    try {
      const html2pdf = (await import('html2pdf.js')).default;

      const opt = {
        margin:       [8, 6, 10, 6],           // smaller top/bottom margins
        filename:     filename,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  {
          scale: 2.5,                        // higher scale = sharper text
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: '#ffffff',
          windowWidth: 794,                  // A4 at ~96 dpi
          removeContainer: true
        },
        jsPDF:        {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
          compressPDF: true
        },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
      };

      const pdfBlob = await html2pdf()
        .set(opt)
        .from(element)
        .outputPdf('blob');

      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("PDF downloaded via html2pdf");
      return;
    } catch (pdfErr) {
      console.warn("html2pdf failed → falling back to browser print", pdfErr);
      toast.info("Using browser print (better results with small margins)");
    }

    // ───────────────────────────────────────
    // Very robust browser print fallback
    // ───────────────────────────────────────
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      toast.error("Popup blocked → please allow popups for this site");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Invoice - ${filename.replace('.pdf', '')}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 8mm 6mm 10mm 6mm;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 10.2pt;
            line-height: 1.38;
            color: #111827;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .page {
            width: 210mm;
            min-height: 297mm;
            box-sizing: border-box;
            page-break-after: always;
          }
          table { width: 100%; border-collapse: collapse; }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }
          tr, td, th, div, p {
            page-break-inside: avoid !important;
          }
          .description-cell {
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            hyphens: auto !important;
          }
          .avoid-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          img { max-width: 100%; height: auto; }
          * { box-sizing: border-box; }
        </style>
      </head>
      <body>
        ${element.outerHTML}
        <script>
          setTimeout(() => {
            window.print();
            // Optional: close window after printing (comment out if unwanted)
            // setTimeout(() => window.close(), 2000);
          }, 1200);
        <\/script>
      </body>
      </html>
    `);

    printWindow.document.close();

  } catch (err) {
    console.error("PDF generation completely failed", err);
    toast.error("PDF creation failed. Try printing manually from the preview.");
  }
};
const printInvoiceList = async (element, filename = 'invoices-report.pdf') => {
  try {
    try {
      const html2pdf = (await import('html2pdf.js')).default
      const opt = {
        margin: [10, 8, 12, 8],
        filename,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
        pagebreak: { mode: ['avoid-all', 'css'] }
      }
      const pdfBlob = await html2pdf().set(opt).from(element).outputPdf('blob')

      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      return
    } catch (e) {
      console.warn('html2pdf fallback for list')
    }

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Invoice Report - ${filename}</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 10mm 8mm 12mm 8mm;
          }
          body { margin:0; padding:0; font-family:Arial,Helvetica,sans-serif; font-size:9.8pt; }
          .page { width:297mm; min-height:210mm; box-sizing:border-box; page-break-after:always; }
          table { width:100%; border-collapse:collapse; font-size:9pt; }
          thead { display:table-header-group; }
          .description-cell { word-wrap:break-word; hyphens:auto; }
          .avoid-break { page-break-inside:avoid; }
        </style>
      </head>
      <body>
        ${element.outerHTML}
      </body>
      </html>
    `)

    printWindow.document.close()
    setTimeout(() => {
      printWindow.focus()
      printWindow.print()
    }, 1000)

  } catch (err) {
    toast.error('Failed to generate report PDF')
  }
}

onMounted(() => {
  fetchInvoices()
  fetchStatistics()
})
</script>