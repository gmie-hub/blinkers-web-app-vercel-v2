import { Outlet  } from 'react-router-dom';
import styles from './index.module.scss';
import { Image } from "antd";
import { useRouter } from 'next/navigation';

const AuthLayout = () => {
  const router =useRouter()
  return (
    <main className={styles.container}>
      <section className={styles.leftSide}>
        <div onClick={()=>router.push('/')} className={styles.logoContainer}>
          <Image src='/Frame 1618868702.svg' alt="Logo" preview={false} />
        </div>

        <div className={styles.centerContent}>
          <div>
            <Image src='Stars.svg' alt="Stars" preview={false} />
          </div>

          <p className={styles.textFirst}>
            A New Way to Buy, Sell and Connect Across <br /> Borders!
          </p>

          <p className={styles.secondText}>
            Connecting you to a global network of buyers and sellers at your <br /> convenience.
          </p>
        </div>
      </section>

      <section className={styles.rightSide}>
        <Outlet />
      </section>
    </main>
  );
};

export default AuthLayout;
