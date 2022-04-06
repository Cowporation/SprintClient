import React from 'react'
import { useLocation } from 'react-router-dom'
import moment from 'moment'
import './FooterNav.css'

export const FooterNav = ({ onSwitch, onXChange, select, onSelect}) => {
    function setToday() {
        return moment();
    }
    const location = useLocation()
 
    return (
        <footer className="custom-element-bg">
            {
                location.pathname === '/Calendar' && (
                    <ul className="nav-links">
                        <li className="go-today" onClick={()=> {onXChange(setToday()) ; onSwitch(setToday()); onSelect(moment().clone().format("YYYY-MM-DD"))}}>
                            Go to Today
                        </li>
                        <li>
                            Day
                        </li>
                        <li>
                            Week
                        </li>
                        <li>
                            Month
                        </li>
                    </ul>
                )}



        </footer>

    )
}

export default FooterNav