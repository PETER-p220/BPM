<template>
  <div class="heatmap-root">
    <!-- Month labels row -->
    <div class="heatmap-months" :style="{ paddingLeft: weekLabelWidth + 'px' }">
      <span
        v-for="(m, i) in monthLabels"
        :key="i"
        class="heatmap-month-label"
        :style="{ left: m.left + 'px' }"
      >{{ m.label }}</span>
    </div>

    <div class="heatmap-body">
      <!-- Day-of-week labels -->
      <div class="heatmap-week-labels" :style="{ width: weekLabelWidth + 'px' }">
        <span v-for="d in ['', 'Mon', '', 'Wed', '', 'Fri', '']" :key="d" class="heatmap-dow">{{ d }}</span>
      </div>

      <!-- Scrollable grid -->
      <div class="heatmap-grid-wrap" ref="gridWrap">
        <div class="heatmap-grid" :style="{ width: gridWidth + 'px' }">
          <div
            v-for="(week, wi) in weeks"
            :key="wi"
            class="heatmap-col"
          >
            <div
              v-for="(day, di) in week"
              :key="di"
              class="heatmap-cell"
              :class="[
                day ? getIntensityClass(day.count) : 'heatmap-cell--empty',
                day && !day.isWorkday ? 'heatmap-cell--weekend' : '',
                day && selectedDay === day.date ? 'heatmap-cell--selected' : '',
              ]"
              :title="day ? `${day.date}: ${day.count} update${day.count !== 1 ? 's' : ''}` : ''"
              @click="day && day.count > 0 ? $emit('day-click', day) : null"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="heatmap-legend">
      <span class="heatmap-legend-label">Less</span>
      <div class="heatmap-cell heatmap-cell--0"></div>
      <div class="heatmap-cell heatmap-cell--1"></div>
      <div class="heatmap-cell heatmap-cell--2"></div>
      <div class="heatmap-cell heatmap-cell--3"></div>
      <div class="heatmap-cell heatmap-cell--4"></div>
      <span class="heatmap-legend-label">More</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';

const props = defineProps({
  /** Object keyed by 'YYYY-MM-DD' → count */
  data: { type: Object, default: () => ({}) },
  /** 'YYYY-MM-DD' */
  startDate: { type: String, required: true },
  /** 'YYYY-MM-DD' */
  endDate: { type: String, required: true },
  /** Highlight this date */
  selectedDay: { type: String, default: null },
});

const emit = defineEmits(['day-click']);

const CELL = 14;   // px per cell
const GAP = 3;     // px gap
const COL = CELL + GAP;
const ROW = CELL + GAP;
const weekLabelWidth = 28;

const gridWrap = ref(null);

/**
 * Format a Date object as 'YYYY-MM-DD' in local time (not UTC).
 */
function toLocalDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Build a flat array of all dates from startDate to endDate,
 * padded so the first week starts on Sunday.
 */
const allDays = computed(() => {
  const days = [];
  // Parse as local midnight by appending T00:00:00 (no Z)
  const start = new Date(props.startDate + 'T00:00:00');
  const end = new Date(props.endDate + 'T00:00:00');

  // Pad to start of the week (Sunday = 0)
  const startPad = start.getDay(); // 0=Sun
  for (let i = 0; i < startPad; i++) {
    days.push(null);
  }

  let cur = new Date(start);
  while (cur <= end) {
    const dateStr = toLocalDateStr(cur);   // ← local time, not UTC
    const dow = cur.getDay(); // 0=Sun,6=Sat
    days.push({
      date: dateStr,
      count: props.data[dateStr] || 0,
      isWorkday: dow >= 1 && dow <= 5,
    });
    cur.setDate(cur.getDate() + 1);
  }

  // Pad to fill last week
  while (days.length % 7 !== 0) {
    days.push(null);
  }
  return days;
});

const weeks = computed(() => {
  const result = [];
  for (let i = 0; i < allDays.value.length; i += 7) {
    result.push(allDays.value.slice(i, i + 7));
  }
  return result;
});

const gridWidth = computed(() => weeks.value.length * COL);

const monthLabels = computed(() => {
  const labels = [];
  let lastMonth = -1;
  weeks.value.forEach((week, wi) => {
    const firstDay = week.find(d => d !== null);
    if (!firstDay) return;
    // Parse as local time so month label matches the local date
    const d = new Date(firstDay.date + 'T00:00:00');
    const month = d.getMonth();
    if (month !== lastMonth) {
      labels.push({
        label: d.toLocaleString('default', { month: 'short' }),
        left: wi * COL,
      });
      lastMonth = month;
    }
  });
  return labels;
});

function getIntensityClass(count) {
  if (count === 0) return 'heatmap-cell--0';
  if (count === 1) return 'heatmap-cell--1';
  if (count === 2) return 'heatmap-cell--2';
  if (count === 3) return 'heatmap-cell--3';
  return 'heatmap-cell--4';
}

// Scroll to end (most recent) on mount
onMounted(() => {
  nextTick(() => {
    if (gridWrap.value) {
      gridWrap.value.scrollLeft = gridWrap.value.scrollWidth;
    }
  });
});
</script>

<style scoped>
.heatmap-root {
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
  font-size: 11px;
  color: #5a7a9a;
  user-select: none;
}

.heatmap-months {
  position: relative;
  height: 16px;
  overflow: hidden;
}
.heatmap-month-label {
  position: absolute;
  white-space: nowrap;
  font-size: 11px;
  color: #7a98b8;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.heatmap-body {
  display: flex;
  align-items: flex-start;
  gap: 0;
}

.heatmap-week-labels {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding-top: 1px;
  flex-shrink: 0;
}
.heatmap-dow {
  height: 14px;
  line-height: 14px;
  font-size: 10px;
  color: #8faec8;
  font-weight: 600;
  text-align: right;
  padding-right: 4px;
}

.heatmap-grid-wrap {
  overflow-x: auto;
  overflow-y: hidden;
  flex: 1;
  scrollbar-width: thin;
  scrollbar-color: rgba(43, 116, 215, 0.2) transparent;
}
.heatmap-grid-wrap::-webkit-scrollbar { height: 4px; }
.heatmap-grid-wrap::-webkit-scrollbar-thumb {
  background: rgba(43, 116, 215, 0.18);
  border-radius: 9999px;
}

.heatmap-grid {
  display: flex;
  flex-direction: row;
  gap: 3px;
}

.heatmap-col {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.heatmap-cell {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  cursor: default;
  transition: transform 0.1s, box-shadow 0.1s;
  flex-shrink: 0;
}
.heatmap-cell--empty { background: transparent; cursor: default; }
.heatmap-cell--0 { background: #dce9f9; }
.heatmap-cell--1 { background: #93c0f5; cursor: pointer; }
.heatmap-cell--2 { background: #5499e6; cursor: pointer; }
.heatmap-cell--3 { background: #2a70cf; cursor: pointer; }
.heatmap-cell--4 { background: #174fa0; cursor: pointer; }
.heatmap-cell--weekend { opacity: 0.5; }
.heatmap-cell--selected {
  outline: 2px solid #174fa0;
  outline-offset: 1px;
  transform: scale(1.15);
}
.heatmap-cell:not(.heatmap-cell--empty):hover {
  transform: scale(1.2);
  box-shadow: 0 2px 8px rgba(30, 80, 160, 0.3);
}

.heatmap-legend {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-top: 4px;
  justify-content: flex-end;
}
.heatmap-legend-label { font-size: 10px; color: #8faec8; margin: 0 2px; }
</style>
