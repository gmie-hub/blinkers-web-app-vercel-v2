import { usePathname, useRouter } from "next/navigation";
import styles from "./index.module.scss";
import { useSetAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import classNames from "classnames";
import { routesArrayAtom } from "@/lib/utils/store";
import { routeParts } from "@/lib/routes";

interface RouteIndicatorProps {
  showBack?: boolean;
  show?: boolean;
}

export default function RouteIndicator({
  showBack = false,
  show = true,
}: Readonly<RouteIndicatorProps>) {
  const pathname = usePathname();
  const router = useRouter();

  const routeArray: Route[] = useAtomValue(routesArrayAtom) || ([] as Route[]);
  const setRouteArray = useSetAtom(routesArrayAtom);

  useEffect(() => {
    const resolvedPathname = routeParts[pathname]
      ? pathname
      : `${pathname?.substring(0, pathname?.lastIndexOf("/"))}/:id`;
    const resolvedRoutes = routeParts[resolvedPathname];
    const lastPart = routeParts[resolvedPathname]?.params
      ? pathname.split("/").pop()
      : "";

    const index = routeArray?.findIndex((item) => item.route === pathname);

    if (resolvedRoutes) {
      resolvedRoutes["params"] = lastPart || "";
      resolvedRoutes["route"] = pathname;
    }

    //handle forward navigation
    if (resolvedRoutes && index === -1) {
      setRouteArray([...routeArray, resolvedRoutes as Route]);
    }

    //handle backward navigation
    if (resolvedRoutes && index !== -1) {
      const result = routeArray?.slice(0, index + 1);
      setRouteArray([...result]);
    }

    //handle navigation to the root directory
    if (resolvedRoutes && resolvedRoutes.isRoot) {
      setRouteArray([resolvedRoutes as Route]);
    }
    // eslint-disable-next-line
  }, [pathname]);

  return (
    <div className={classNames(styles.wrapper, show ? "" : styles.hide)}>
      {showBack && (
        <div onClick={() => router.back()} className={styles.back}>
          <img
            src="/back.svg"
            alt="BackIcon"
            // onClick={() => router.back()}
            className={styles.arrow} 
          />
          <p className={styles.element}>Go Back</p>
        </div>
      )}

      {routeArray && routeArray.length > 0 && routeArray?.map((item, index) => {
        return (
          <div key={item?.route}>
            {index !== 0 &&
             <img
             src="/arrow-left.svg"
             alt="ArrowSide"
             onClick={() => router.back()}
             className={styles.arrow} 
           />
            }
            <p
              onClick={() => router.push(`${item?.route}`)}
              className={styles.element}
            >
              {item?.name}
            </p>
          </div>
        );
      })}
    </div>
  );
}
