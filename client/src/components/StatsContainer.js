import StatsItem from "./StatsItem"
import { useAppContext } from "../context/appContext"
import { FaSuitcaseRolling, FaCalendarCheck, FaBug } from "react-icons/fa"
import Wrapper from '../assets/wrappers/StatsContainer'

const StatsContainer = () => {
    const { stats } = useAppContext()

    const defaultStats = [
        {
            title: 'pending applicaitons',
            count: stats.pending,
            icon: <FaSuitcaseRolling />,
            color: '#e9b949',
            bcg: '#fcefc7'
        },
        {
            title: 'interviews scheduled',
            count: stats.interview,
            icon: <FaCalendarCheck />,
            color: '#647acb',
            bcg: '#e0e8f9'
        },
        {
            title: 'jobs declined',
            count: stats.declined,
            icon: <FaBug />,
            color: '#d66a6a',
            bcg: '#ffeeee'
        },
    ]
    return (
        <Wrapper>
            {defaultStats.map((item, index) => {
                return <StatsItem key={index}{...item} />
            })}
            {/* <h1>Stats Container</h1> */}
            {/* <StatsItem /> */}
        </Wrapper>
    )
}

export default StatsContainer