import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    BarElement
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Filler,
    Title,
    Tooltip,
    Legend
)

import { Bar, Line, Scatter, Bubble } from 'react-chartjs-2' 

function BarChart(props:any) {

    return (
        <Line data={props.chartData} />
    )
}

export default BarChart