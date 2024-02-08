import "./Home.css";
import Header from "../Header/Header";
import { useContext } from "react";
import AppContext from "../../AppContext/AppContext";
import Category from "../Category/Category";

const Home = () => {
  const { isLogged } = useContext(AppContext);

  return (
    <div className="home-content">
      <Header />
      {isLogged && (
        <div id="categories-content">
          <Category
            name={"Art"}
            posts={5}
            image={"/src/Images/art.jpg"}
            color={"#9DCEC9"}
          />
          <Category
            name={"Gaming"}
            posts={5}
            image={"/src/Images/gaming.png"}
            color={"#2B1A5A"}
          />
          <Category
            name={"Lego"}
            posts={5}
            image={"/src/Images/lego.png"}
            color={"#328D67"}
          />
          <Category
            name={"Photography"}
            posts={5}
            image={"/src/Images/photography.jpg"}
            color={"#AA81B4"}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
