import "./Home.css";
import { useContext } from "react";
import Header from "../../Header/Header";
import AppContext from "../../../AppContext/AppContext";
import Category from "../../Category/Category";
import Button from "../../Button/Button";

const Home = () => {
  const { user } = useContext(AppContext);

  return (
    <div className="home-content">
      <Header />
      {user ? (
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
      ) : (
        <h1 id="no-logged-in-title">
          Discover, Connect, and Share: Welcome to im Hobby Forum App! <br />{" "}
          Your Ultimate Forum Destination!
        </h1>
      )}
      <img id='woman-home' src="/src/Images/woman-home.png" alt="woman" />
      <img id='man-home' src="/src/Images/man-home.png" alt="man" />
      <div id="posts-content">
        <p id="posts-buttons">
          <Button color="#CD4D95">Most commented</Button>
          <Button color="#CD4D95">Recently created</Button>
        </p>
        <div>
          <h3>Title: post1</h3>
          <p>By Pickysaurus, Tuesday at 01:49 PM</p>
          <span>
            5 replies
            <br /> 100 views
          </span>
        </div>
        <div>
          <h3>Title: post1</h3>
          <p>By Pickysaurus, Tuesday at 01:49 PM</p>
          <span>
            5 replies
            <br /> 100 views
          </span>
        </div>
        <div>
          <h3>Title: post1</h3>
          <p>By Pickysaurus, Tuesday at 01:49 PM</p>
          <span>
            5 replies
            <br />
            100 views
          </span>
        </div>
        <div>
          <h3>Title: post1</h3>
          <p>By Pickysaurus, Tuesday at 01:49 PM</p>
          <span>
            5 replies
            <br />
            100 views
          </span>
        </div>
        <div>
          <h3>Title: post1</h3>
          <p>By Pickysaurus, Tuesday at 01:49 PM</p>
          <span>
            5 replies
            <br />
            100 views
          </span>
        </div>
        <div>
          <h3>Title: post1</h3>
          <p>By Pickysaurus, Tuesday at 01:49 PM</p>
          <span>
            5 replies
            <br />
            100 views
          </span>
        </div>
        <div>
          <h3>Title: post1</h3>
          <p>By Pickysaurus, Tuesday at 01:49 PM</p>
          <span>
            5 replies
            <br />
            100 views
          </span>
        </div>
        <div>
          <h3>Title: post1</h3>
          <p>By Pickysaurus, Tuesday at 01:49 PM</p>
          <span>
            5 replies
            <br />
            100 views
          </span>
        </div>
        <div>
          <h3>Title: post1</h3>
          <p>By Pickysaurus, Tuesday at 01:49 PM</p>
          <span>
            5 replies
            <br />
            100 views
          </span>
        </div>
        <div>
          <h3>Title: post1</h3>
          <p>By Pickysaurus, Tuesday at 01:49 PM</p>
          <span>
            5 replies
            <br />
            100 views
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;
