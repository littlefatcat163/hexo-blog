<template>
    <div class="accordion">
        <div class="accordion-item" v-for="(report, index) in arr">
            <header class="accordion-header" :id="`heading-${index}`">
                <button :class="['accordion-button', 'position-relative', 'fw-bold', 'fs-5', { collapsed: index !== 0 }]"
                    type="button" data-bs-toggle="collapse" :data-bs-target="`#collapse-${index}`" aria-expanded="true"
                    :aria-controls="`collapse-${index}`">
                    {{ report.name }}&nbsp;&nbsp;<span :class="['badge', `text-bg-${report.status}`]">{{ report.date
                    }}</span>
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {{ report.day }}天
                    </span>
                </button>
            </header>
            <div :id="`collapse-${index}`" :class="['accordion-collapse', 'collapse', { 'show': index === 0 }]"
                :aria-labelledby="`heading-${index}`" data-bs-parent=".accordion">
                <div class="accordion-body container">
                    <div class="row">
                        <div class="col-4 mb-3" v-for="item in report.dataSources">
                            <label class="col-form-label">{{ item.text }}</label>
                            <input readonly :class="['form-control', { 'is-invalid': item.err }, { 'is-valid': item.done }]"
                                :value="item.value">
                            <div v-if="item.err" class="invalid-feedback text-end">
                                {{ item.err }}
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div :class="['alert', `alert-light`, 'alert-dismissible', 'fade', 'show']" role="alert">
                        <strong>结果：</strong><span v-for="(symptom, symptomIndex) in report.symptoms"
                            :class="[`badge`, `text-bg-${symptom.status}`, { 'ms-2': symptomIndex > 0 }]">{{ symptom.text }}</span>
                        <ul>
                            <li v-for="str in report.results">{{ str }}</li>
                        </ul>
                    </div>
                    <hr>
                    <ul>
                        <li v-for="str in report.livings">{{ str }}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Data } from './'
const arr: Data[] = []
</script>