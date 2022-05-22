import React from "react";
import { AiFillFileAdd, AiOutlineHome } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import Nexus from '../assets/nexus.svg';


const NavItem = ({ to, value, closed, Icon }) => {
    const commonClasses = "flex items-center space-x-2 w-full p-2 block whitespace-nowrap ";
    const activeClass = commonClasses + "bg-blue-500 text-white";
    const inActiveClass = commonClasses + "text-gray-500";

    return (
        <NavLink className={({ isActive }) => (isActive ? activeClass : inActiveClass)} to={to}>
            {Icon}
            <span className={
                closed 
                ? "w-0 transition-width overflow-hidden"
                 : "w-full transition-width overflow-hidden"
                 } 
                 >{value}
                 </span>
        </NavLink>
    );
};

export default function NavBar({ closed }) {
    return (
        <nav>
            <div className="flex justify-center p-3" >
                <img className="w-14" src={Nexus} alt="Logo da Nexus" />
            </div>
            <ul>
                <li><NavItem closed={closed} to='/' value='Página Inicial' Icon={<AiOutlineHome size={24} />} />
                </li>
                <li>
                    <NavItem
                        closed={closed}
                        to="/create-post"
                        value="Criar Post"
                        Icon={<AiFillFileAdd size={24} />}
                    />
                </li>
            </ul>
        </nav>
    )
}