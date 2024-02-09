import "./Home.css";
import { useContext } from "react";
import Header from "../../Header/Header";
import AppContext from "../../../AppContext/AppContext";
import Category from "../../Category/Category";

const Home = () => {
  const { user } = useContext(AppContext);

  return (
    <div className="home-content">
      <Header />
      {user && (
        <div id="categories-content">
          <Category
            name={"Art"}
            image={"/src/Images/art.jpg"}
            color={"#60AEBB"}
          />
          <Category
            name={"Gaming"}
            image={"/src/Images/gaming.png"}
            color={"#2B1A5A"}
          />
          <Category
            name={"Lego"}
            image={"/src/Images/lego.png"}
            color={"#328D67"}
          />
          <Category
            name={"Photography"}
            image={"/src/Images/photography.jpg"}
            color={"#AA81B4"}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
