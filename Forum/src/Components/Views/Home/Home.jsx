import "./Home.css";
import { useContext, useEffect, useState } from "react";
import Header from "../../Header/Header";
import AppContext from "../../../AppContext/AppContext";
import Category from "../../Category/Category";
import Button from "../../Button/Button";

const Home = () => {
  const { user } = useContext(AppContext);
  const [ trending, setTrending ] = useState(null);
  const [ recentlyCreated, setRecentlyCreated ] = useState(null);

  useEffect(() => {
    setTrending(array.slice(0, 5));
    setRecentlyCreated(array.slice(0, 5));
  }, []);

  const array = [
    {
      title: "test1",
      author: "author",
      createdOn: new Date().toLocaleDateString("BG-bg"),
      replies: "5",
      views: "100",
    },
    {
      title: "test2",
      author: "author",
      createdOn: new Date().toLocaleDateString("BG-bg"),
      replies: "5",
      views: "100",
    },
    {
      title: "test3",
      author: "author",
      createdOn: new Date().toLocaleDateString("BG-bg"),
      replies: "5",
      views: "100",
    },
    {
      title: "test4",
      author: "author",
      createdOn: new Date().toLocaleDateString("BG-bg"),
      replies: "5",
      views: "100",
    },
    {
      title: "test5",
      author: "author",
      createdOn: new Date().toLocaleDateString("BG-bg"),
      replies: "5",
      views: "100",
    },
    {
      title: "test6",
      author: "author",
      createdOn: new Date().toLocaleDateString("BG-bg"),
      replies: "5",
      views: "100",
    },
    {
      title: "test7",
      author: "author",
      createdOn: new Date().toLocaleDateString("BG-bg"),
      replies: "5",
      views: "100",
    },
    {
      title: "test8",
      author: "author",
      createdOn: new Date().toLocaleDateString("BG-bg"),
      replies: "5",
      views: "100",
    },
    {
      title: "test9",
      author: "author",
      createdOn: new Date().toLocaleDateString("BG-bg"),
      replies: "5",
      views: "100",
    },
    {
      title: "test10",
      author: "author",
      createdOn: new Date().toLocaleDateString("BG-bg"),
      replies: "5",
      views: "100",
    },
  ];

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
          <h2>Most commented</h2>
          {trending?.map((post) => {
            return (
              <div key={post.title} className="single-post">
                <h3>Title: {post.title}</h3>
                <p>
                  By {post.author}, {post.createdOn}
                </p>
                <span>
                  {post.replies} replies
                  <br />
                  {post.views} views
                </span>
              </div>
            );
          })}
          <div id="see-more-trending">
            <Button className='active' onClick={() => setTrending(array.slice(0, 5))}>1</Button>
            <Button onClick={() => setTrending(array.slice(5))}>2</Button>
          </div>
        </div>
        <div id="recently-created">
          <h2>Recently created</h2>
          {recentlyCreated?.map((post) => {
            return (
              <div key={post.title} className="single-post">
                <h3>Title: {post.title}</h3>
                <p>
                  By {post.author}, {post.createdOn}
                </p>
                <span>
                  {post.replies} replies
                  <br />
                  {post.views} views
                </span>
              </div>
            );
          })}
          <div id="see-more-recently">
            <Button className={'active'} onClick={() => setRecentlyCreated(array.slice(0, 5))}>1</Button>
            <Button onClick={() => setRecentlyCreated(array.slice(5))}>2</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
