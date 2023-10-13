import '../styles/NavBar.css'
import { Link, useNavigate } from 'react-router-dom'
import { accountService } from "../services/accountService";
import { FaBars } from 'react-icons/fa';
import { ImCross } from 'react-icons/im';
import { useState } from 'react';

function NavBar() {
	const title = 'FindMyPlant'
	let navigate = useNavigate()

	const [mobile, setMobile] = useState(false)

	const logout = () => {
		accountService.logout()
		navigate('/')
	}
	return (
		<header>
			<nav className='fmp-NavBar'>
				<h1 className='fmp-title'>
					<a href="/" className="link-style">{title}</a>
				</h1>
				
					<ul className={mobile ? "nav-menu-mobile" : "fmp-Nav-Menu" } onClick={() => setMobile(false)}>
						<li className='button-ad'>
							<Link to="/createad" className="link-style">
								Déposer une annonce
							</Link>
						</li>
						{(!accountService.isLogged() && (
							<>
								<li className='button-white'>
									<Link to="/login" className="link-style">
										Se connecter
									</Link>
								</li>
								<li className='button-white'>
									<Link to="/signup" className="link-style">
										S'enregistrer
									</Link>
								</li>
							</>
						)) || (
								<>
									<li className='button-white'>
										<Link to="/account" className="link-style">
											Mon compte
										</Link>
									</li>
									<li className='button-white'>
										<Link to="/account-annonces" className="link-style">
											Mes annonces
										</Link>
									</li>
									<li className='button-logout' onClick={logout}>
										Déconnexion
									</li>
								</>
							)}
					</ul>
					<button className='mobile-menu-icon' onClick={() => setMobile(!mobile)}>
						{mobile ? <ImCross /> : <FaBars />}
						
					</button>
			</nav>
		</header>
	);
}

export default NavBar