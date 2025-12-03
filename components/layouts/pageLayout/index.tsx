import { Outlet } from "react-router-dom";


import styles from "./styles.module.scss";
import Foot from "../footer/foot";
import Footer from "../footer/footer";
import Header from "../header/header";

const Layout = () => {


  return (
    <main className={styles.container}>
      <Header />
      <section className={styles.content}>
        {/* <Header onOpen={showDrawer} /> */}

        <section className={styles.children}>
          <div>
            <Outlet />
          </div>
          <Footer />
        </section>
        <Foot />
      </section>
    </main>
  );
};

export default Layout;
