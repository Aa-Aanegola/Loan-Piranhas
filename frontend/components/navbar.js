import  Link  from 'next/link'

const CustomNavbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{zIndex:"10"}}>
            <a className="navbar-brand" href="#">Loan Piranhas</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <Link href="/dashboard">
                            <a className="nav-link">Dashboard</a>
                        </Link>
                    </li>
                    <li className="nav-item active">
                        <Link href="/offerings">
                            <a className="nav-link">Offerings</a>
                        </Link>
                    </li>
                    <li className="nav-item active">
                        <Link href="/createNFT">
                            <a className="nav-link">Create NFT</a>
                        </Link>
                    </li>
                    <li className="nav-item active">
                        <Link href="/myNFTs">
                            <a className="nav-link">My NFTs</a>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default CustomNavbar;