import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { RESPONSE_STATUS } from "../@types/common";
import { IQuestionsList, IQuestions } from "../@types/IQuestions";
import Search from "../components/Search";
import { API_CONFIG } from "../constants/config";
import { API_URLS } from "../constants/request";
import "../styles/home.css";

interface IHomeProps {}

const Home: React.FC<IHomeProps> = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [questions, setQuestions] = useState<IQuestions[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState(RESPONSE_STATUS.SUCCESS);
  function fetchQuestions<T>(question: string, page = 1): Promise<T> {
    return fetch(
      `${API_URLS.STACKOVERFLOW}&q=${question}&page=${page}&pagesize=${API_CONFIG.DEFAULT_PAGE_SIZE}`
    ).then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    });

    // const data = require("../sample.json");
    // return data;
  }

  const fetchMoreData = async () => {
    console.log("fetching...");
    try {
      if (!searchTerm) {
        setQuestions([]);
        setStatus(RESPONSE_STATUS.SUCCESS);
        setHasMore(false);
        return;
      }
      const data = await fetchQuestions<IQuestionsList>(searchTerm, page);
      setQuestions((prevQuestions) => prevQuestions.concat(data.items));
      setStatus(RESPONSE_STATUS.SUCCESS);
      setPage((prevPage) => prevPage + 1);
      setHasMore(data.has_more);
    } catch (error) {
      setQuestions([]);
      setStatus(RESPONSE_STATUS.ERROR);
    }
  };

  useEffect(() => {
    fetchMoreData();
  }, [searchTerm]);

  const handleQuestionSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="home">
      {status === "error" && <p>Failed to fetch data </p>}
      <Search
        defaultValue={""}
        status={status}
        onChange={handleQuestionSearch}
      />
      {status === "loading" && <p>Loading...</p>}
      {status === "success" && (
        <main>
          <section className="home__questions">
            {status === "success" && (
              <div
                id="scrollableDiv"
                style={{
                  height: 600,
                  overflow: "auto",
                }}
              >
                {!!questions.length && (
                  <div className="scrollablediv--header">
                    <span>Author</span>
                    <span>Question</span>
                    <span>Date</span>
                  </div>
                )}
                <InfiniteScroll
                  dataLength={questions.length}
                  next={fetchMoreData}
                  hasMore={hasMore}
                  loader={<h4>Loading...</h4>}
                  scrollableTarget="scrollableDiv"
                >
                  {questions.map((data) => (
                    <div
                      className="home__questions--list-item"
                      key={data.question_id}
                    >
                      <div className="field home__questions--author">
                        {data.owner?.display_name}
                      </div>
                      <div className="field home__questions--title">
                        {data.title}
                      </div>
                      <div className="field home__questions--created-at">
                        {data.creation_date &&
                          new Date(data.creation_date).toDateString()}
                      </div>
                    </div>
                  ))}
                </InfiniteScroll>
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  );
};

export default Home;
