<template>
    <div class="container">
        <div class="row gy-4">
            <div class="col-xl-3 col-lg-4 col-md-6" v-for="card in arr">
                <div class="card">
                    <div :class="['card-header', 'fs-6', 'fw-bold', `text-bg-${card.status}`, 'position-relative']">
                        {{ card.name }}
                        <span class="badge text-bg-secondary">{{ card.date }}</span>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {{ card.day }}天
                        </span>
                    </div>
                    <div class="card-body">
                        <div class="mb-3" v-for="item in card.dataSources">
                            <label class="col-form-label">{{ item.text }}</label>
                            <div>
                                <input type="email"
                                    readonly
                                    :class="['form-control', { 'is-invalid': item.err }, { 'is-valid': item.done }]"
                                    :value="item.value">
                                <div v-if="item.err" class="invalid-feedback text-end">
                                    {{ item.err }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Data } from '.'
const arr: Data[] = []
</script>