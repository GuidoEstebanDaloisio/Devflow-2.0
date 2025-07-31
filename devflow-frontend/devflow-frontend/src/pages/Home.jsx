import { Link } from 'react-router-dom';
import styles from '../styles/home.module.css';


function Home() {
    return (
        <>
            <head>
                <title>DevFlow - Bienvenido</title>
            </head>
                <div className={styles['home-container']}>
                    <div className={styles['home-card']}>
                        <h1>
                            Bienvenido a <span>DevFlow</span>
                        </h1>
                        <p>Gestioná tus proyectos y usuarios de manera eficiente y profesional.</p>
                        <Link to="/login" className={styles['btn-iniciar']}>
                            Iniciar Sesión
                        </Link>
                    </div>
                </div>
        </>
    );
}

export default Home;