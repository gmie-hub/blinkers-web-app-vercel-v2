import Access from "./access";
import Directory from "./directory";
import GetStarted from "./getStarted";
import PictureBg from "./landingImage/picture";
import MoreThanMarket from "./moreThanMarket";
import PromotedAds from "./promotedAds";
import RecommendedAds from "./recommendedAds";
import Trends from "./trend/newTrendDesign";

const HomePage = () => {
  return (
    <section>
      {" "}
      <PictureBg />
      <div className="wrapper">
        <Directory />
        <Trends />

        <PromotedAds />
        <RecommendedAds />
        <MoreThanMarket />
        <Access />
        <GetStarted />
      </div>
    </section>
  );
};
export default HomePage;
