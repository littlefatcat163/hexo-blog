<template>
    <nav>
        <ul
            class="nav nav-underline mb-3 d-flex flex-nowrap overflow-x-auto text-nowrap border-bottom"
            role="tablist"
        >
            <li
                class="nav-item"
                role="presentation"
                v-for="(item, index) in arr"
            >
                <button
                    data-bs-toggle="tab"
                    role="tab"
                    type="button"
                    :aria-selected="index === 0 ? 'true' : 'false'"
                    :class="['nav-link', { active: index === 0 }]"
                    :id="`tab-${index}`"
                    :data-bs-target="`#nav-${index}`"
                    :aria-controls="`nav-${index}`"
                >
                    {{ item.date }}
                </button>
            </li>
        </ul>
        <div class="tab-content">
            <div
                v-for="(report, index) in arr"
                :class="['tab-pane', 'fade', index === 0 && 'show active']"
                :id="`nav-${index}`"
                role="tabpanel"
                :aria-labelledby="`tab-${index}`"
                :tabindex="index"
            >
                <div class="row">
                    <div class="col-4 mb-3">
                        <label class="col-form-label">医院</label>
                        <input
                            readonly
                            :class="[
                                'form-control'
                            ]"
                            :value="report.name"
                        />
                    </div>
                    <div class="col-4 mb-3">
                        <label class="col-form-label">禁欲天数</label>
                        <input
                            readonly
                            :class="[
                                'form-control'
                            ]"
                            :value="report.day"
                        />
                    </div>
                    <div class="col-4 mb-3" v-for="item in report.dataSources">
                        <label class="col-form-label">{{ item.text }}</label>
                        <input
                            readonly
                            :class="[
                                'form-control',
                                { 'is-invalid': item.err },
                                { 'is-valid': item.done },
                            ]"
                            :value="item.value"
                        />
                        <div v-if="item.err" class="invalid-feedback text-end">
                            {{ item.err }}
                        </div>
                    </div>
                </div>
                <hr />
                <div
                    :class="[
                        'alert',
                        `alert-light`,
                        'alert-dismissible',
                        'fade',
                        'show',
                    ]"
                    role="alert"
                >
                    <strong>结果：</strong
                    ><span
                        v-for="(symptom, symptomIndex) in report.symptoms"
                        :class="[
                            `badge`,
                            `text-bg-${symptom.status}`,
                            { 'ms-2': symptomIndex > 0 },
                        ]"
                        >{{ symptom.text }}</span
                    >
                    <ul>
                        <li v-for="str in report.results">{{ str }}</li>
                    </ul>
                </div>
                <hr />
                <ul>
                    <li v-for="str in report.livings">{{ str }}</li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script lang="ts" setup>
import type { Data } from './'
const arr: Data[] = []
</script>
