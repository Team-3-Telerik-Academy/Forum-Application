import "./Home.css";
import { useContext, useEffect, useState } from "react";
import Header from "../../Header/Header";
import AppContext from "../../../AppContext/AppContext";
import Category from "../../Category/Category";
import Button from "../../Button/Button";
import { getAllPosts } from "../../../services/posts.service";
import HomePostsTemplate from "../../HomePostsTemplate/HomePostsTemplate";
import { useNavigate } from "react-router-dom";

/**
 * Renders the Home component.
 * 
 * @returns {JSX.Element} The rendered Home component.
 */
const Home = () => {
  const { user } = useContext(AppContext);
  const [trending, setTrending] = useState(null);
  const [recentlyCreated, setRecentlyCreated] = useState(null);
  const [fiveTrending, setFiveTrending] = useState(null);
  const [fiveRecentlyCreated, setFiveRecentlyCreated] = useState(null);
  const [activeButton, setActiveButton] = useState(1);
  const [activeSecondButton, setActiveSecondButton] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    getAllPosts().then((result) => {
      const mostLiked = result.sort((a, b) => b.likes - a.likes).slice(0, 10);
      const newest = result
        .sort((a, b) => b.createdOn - a.createdOn)
        .slice(0, 10);

      setTrending(mostLiked);
      setRecentlyCreated(newest);
      setFiveTrending(mostLiked.slice(0, 5));
      setFiveRecentlyCreated(newest.slice(0, 5));
    });
  }, []);

  const singlePostView = (postId) => {
    if (!user) {
      return;
    }

    navigate(`/post/${postId}`);
  }

  return (
    <div className="home-content">
      <Header inputColor={"#CD4D95"} />
      {user ? (
        <div className="categories-content">
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
        <div id="no-logged-in-title">
          <h1>
            Discover, Connect, and Share: Welcome to im Hobby Forum App! <br />{" "}
            Your Ultimate Forum Destination!
          </h1>
        </div>
      )}
      <img id="woman-home" src="/src/Images/woman-home.png" alt="woman" />
      <img id="man-home" src="/src/Images/man-home.png" alt="man" />
      <div id="posts-content">
        <div id="most-commented">
          <h2>Most popular</h2>
          {fiveTrending?.map((post) => (
            <HomePostsTemplate cursor={user && { cursor: 'pointer' }} goToSinglePost={singlePostView} key={post.id} post={post} />
          ))}
          <div id="see-more-trending">
            <Button
              id={activeButton === 1 ? "active" : ""}
              onClick={() => {
                setFiveTrending(trending.slice(0, 5));
                setActiveButton(1);
              }}
            >
              1
            </Button>
            <Button
              id={activeButton === 2 ? "active" : ""}
              onClick={() => {
                setFiveTrending(trending.slice(5));
                setActiveButton(2);
              }}
            >
              2
            </Button>
          </div>
        </div>
        <div id="recently-created">
          <h2>Recently created</h2>
          {fiveRecentlyCreated?.map((post) => (
            <HomePostsTemplate cursor={user && { cursor: 'pointer' }} goToSinglePost={singlePostView} key={post.id} post={post} />
          ))}
          <div id="see-more-recently">
            <Button
              id={activeSecondButton === 1 ? "active" : ""}
              onClick={() => {
                setFiveRecentlyCreated(recentlyCreated.slice(0, 5));
                setActiveSecondButton(1);
              }}
            >
              1
            </Button>
            <Button
              id={activeSecondButton === 2 ? "active" : ""}
              onClick={() => {
                setFiveRecentlyCreated(recentlyCreated.slice(5));
                setActiveSecondButton(2);
              }}
            >
              2
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
