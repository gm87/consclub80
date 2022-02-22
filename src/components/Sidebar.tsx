import { ReactNode } from "react"
import { Link } from "react-router-dom"

interface SidebarLinkProps {
    href: string
    name: string
    Icon: any
}

const HomeIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house-fill" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"/>
            <path fillRule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"/>
        </svg>
    )
}

const DocumentIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-text" viewBox="0 0 16 16">
            <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
            <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
        </svg>
    )
}

const SidebarLink = ({ href, name, Icon }: SidebarLinkProps) => {
    const currentPath = window.location.pathname
    return (
        <li className="nav-item d-flex">
            <Link to={href} className={`nav-link ${href === currentPath ? 'active' : ''}`}><span className="my-auto me-2 text-white"><Icon /></span> {name}</Link>
        </li>
    )
}

const Sidebar = () => {

    const links: SidebarLinkProps[] = [
        {
            href: '/',
            name: 'Home',
            Icon: HomeIcon
        },
        {
            href: '/bylaws',
            name: 'Member Bylaws',
            Icon: DocumentIcon
        },
        {
            href: '/rules',
            name: 'Member Rules',
            Icon: DocumentIcon
        }
    ]

    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ minHeight: "100vh", height: "100%", position: "fixed", top: 0, left: 0, width: "280px" }}>
            <h1 className="display-1 fs-4 text-center my-3">80s Conservation Club</h1>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto h-100">
                {links.map(x => { return <SidebarLink key={x.href} href={x.href} name={x.name} Icon={x.Icon} /> })}
            </ul>
            <hr />
            <div>
                Username Here
            </div>
        </div>
    )
}

export default Sidebar