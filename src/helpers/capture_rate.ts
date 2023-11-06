type TPokemonStats = {
    base_stat: number
    effort: number
    stat: {
        name: string
        url: string
    }
}

const getCaptureRate = (stats: TPokemonStats[]) => {
    let totalStat = 0

    stats.forEach((v: TPokemonStats) => {
        totalStat += v.base_stat
    })

    if (totalStat < 350) return 70
    if (totalStat >= 350 && totalStat < 400) return 55
    if (totalStat >= 400 && totalStat < 450) return 45
    if (totalStat >= 450 && totalStat < 500) return 35
    if (totalStat >= 500 && totalStat < 550) return 25
    if (totalStat >= 550 && totalStat < 600) return 15
    return 10
}

export default getCaptureRate
