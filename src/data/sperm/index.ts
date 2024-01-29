import fs from 'fs'
import yaml from 'yaml'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

type Item = {
    text: string
    value: string
    done?: boolean
    err?: string
}

type Status = 'success' | 'warning' | 'danger' | 'info' | 'secondary'
type Symptom = {
    status: Status
    text: string
}

export type Data = {
    name: string
    date: string
    day: number
    status: Status
    symptoms: Symptom[]
    dataSources: Item[]
    results: string[]
    livings: string[]
}

function toNum(value: string) {
    if (/^\d/.test(value)) {
        return Number.parseFloat(value)
    }
    return Number.parseFloat(value.replace(/^([^\d]*)/, ''))
}

/* 量：1.5ml
精子总数：39百万（一次射精）
颜色：透明灰白、淡黄、黄白
液化时间：< 60min
前向运动 A + B：12.48百万 （32%） */

/**
 * @description 精液量, 合格 > 1.5
 * @param {Item} item 数据项
 * @returns
 */
function vol(item: Item): Item {
    const num = toNum(item.value)
    if (num < 1.5) {
        return {
            ...item,
            done: false,
            err: '少于 1.5ml',
        }
    }
    return {
        ...item,
        done: true,
    }
}

/**
 * @description PH, 合格 >= 7.2
 * @param {Item} item 数据项
 * @returns
 */
function ph(item: Item): Item {
    const num = toNum(item.value)
    if (num < 7.2) {
        return {
            ...item,
            done: false,
            err: '小于 7.2',
        }
    }
    return {
        ...item,
        done: true,
    }
}

/**
 * @description 精液浓度, 合格 >= 15
 * @param {Item} item 数据项
 * @returns
 */
function con(item: Item): Item {
    const num = toNum(item.value)
    if (num < 15) {
        return {
            ...item,
            done: false,
            err: '少于 15百万/ml',
        }
    }
    return {
        ...item,
        done: true,
    }
}

/**
 * @description 液化时间, 合格 < 60
 * @param {Item} item 数据项
 * @returns
 */
function time(item: Item): Item {
    const num = toNum(item.value)
    if (num >= 60) {
        return {
            ...item,
            done: false,
            err: '超过 60分钟',
        }
    }
    return {
        ...item,
        done: true,
    }
}

/**
 * @description 精子总数, 合格 >= 39
 * @param {Item} item 数据项
 * @returns
 */
function total(item: Item): Item {
    const num = toNum(item.value)
    if (num < 39) {
        return {
            ...item,
            done: false,
            err: '少于 39 百万',
        }
    }
    return {
        ...item,
        done: true,
    }
}

/**
 * @description 前向运动, 合格 >= 32
 * @param {Item} item 数据项
 * @returns
 */
function runing(item: Item): Item {
    const num = toNum(item.value)
    if (num < 32) {
        return {
            ...item,
            done: false,
            err: '少于 32 %',
        }
    }
    return {
        ...item,
        done: true,
    }
}

/**
 * @description 总活力, 合格 >= 40
 * @param {Item} item 数据项
 * @returns
 */
function dynamic(item: Item): Item {
    const num = toNum(item.value)
    if (num < 40) {
        return {
            ...item,
            done: false,
            err: '少于 40 %',
        }
    }
    return {
        ...item,
        done: true,
    }
}

/**
 * @description 存活率, 合格 >= 58
 * @param {Item} item 数据项
 * @returns
 */
function survive(item: Item): Item {
    const num = toNum(item.value)
    if (num < 58) {
        return {
            ...item,
            done: false,
            err: '少于 58 %',
        }
    }
    return {
        ...item,
        done: true,
    }
}

function mappingItem(item: Item): Item {
    const map = new Map([
        ['PH值', ph],
        ['精液量', vol],
        ['精液浓度', con],
        ['液化时间', time],
        ['精子总数', total],
        ['前向运动', runing],
        ['总活力', dynamic],
        ['存活率', survive],
    ])
    const fn = map.get(item.text)
    if (fn) {
        return fn(item)
    }
    return item
}

/**
 * @description 诊断
 * @param items
 */
function diagnosing(items: Item[]): Symptom[] {
    return [
        oligospermia(items),
        asthenospermia(items)
    ]
}

/**
 * @description 少精子症，根据一次排精的精子总量
 *  - 10 ~ 15 轻度
 *  - 5 ~ 10 中度
 *  - < 5 重度
 * @param items
 */
function oligospermia(items: Item[]): Symptom {
    let symptom: Symptom = {
        status: 'success',
        text: '正常',
    }
    const item = items.find((one) => one.text === '精子总数')!
    const num = toNum(item.value)
    if (num < 5) {
        symptom = {
            status: 'danger',
            text: '重度少精子症（精子总数小于5百万）',
        }
    } else if (num < 10) {
        symptom = {
            status: 'danger',
            text: '中度少精子症（精子总数小于10百万）',
        }
    } else if (num < 15) {
        symptom = {
            status: 'warning',
            text: '轻度少精子症（精子总数小于15百万）',
        }
    } else if (num < 39) {
        symptom = {
            status: 'info',
            text: '轻微少精子症（精子总数小于39百万）',
        }
    }
    return symptom
}

/**
 * @description 弱精子症，根据一次排精的精子运动和总活力判断
 *  - 前向运动小于 32 %
 *  - 总活力小于 40 %
 * @param items
 */
function asthenospermia(items: Item[]) {
    let symptom: Symptom = {
        status: 'success',
        text: '正常',
    }
    const item1 = items.find((one) => one.text === '前向运动')!
    const num1 = toNum(item1.value)

    const item2 = items.find((one) => one.text === '总活力')!
    const num2 = toNum(item2.value)

    if (num1 < 32 || num2 < 40) {
        symptom = {
            status: 'danger',
            text: '弱精子症',
        }
    }
    return symptom
}

function analyse() {
    const dataPath = join(__dirname, 'data')
    const dirs = fs.readdirSync(dataPath, { withFileTypes: true })
    let data = dirs.map((dir) => {
        const res: Data = yaml.parse(
            fs.readFileSync(join(dataPath, dir.name), 'utf-8')
        )
        res.date = dir.name.replace('.yml', '')
        return res
    })
    data.reverse()
    data = data.map((card) => {
        const dataSources = card.dataSources.map((item) => {
            return mappingItem(item)
        })
        const symptoms = diagnosing(dataSources)
        const status: Status = symptoms[0].status
        return {
            ...card,
            status,
            symptoms,
            dataSources,
        }
    })

    fs.writeFileSync(join(__dirname, 'data.yml'), yaml.stringify({ arr: data }))
}

analyse()
