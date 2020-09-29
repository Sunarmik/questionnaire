import React, { useState } from "react";
import { RESPONSE_STATUS } from "../@types/common";
import { IQuestions } from "../@types/IQuestions";
import Search from "../components/Search";
import { API_CONFIG } from "../constants/config";
import { API_URLS } from "../constants/request";
import "../styles/home.css";
import QuestionDetails from "../components/QuestionDetails";
import QuestionList from "../components/QuestionList";

interface IHomeProps {}

const Home: React.FC<IHomeProps> = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<
    IQuestions | undefined
  >(undefined);
  const [questions, setQuestions] = useState<IQuestions[]>([]);
  const [status, setStatus] = useState(RESPONSE_STATUS.SUCCESS);

  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleListItemClick = (questionId: number) => {
    setSelectedQuestion(
      questions.find((question) => question.question_id === questionId)
    );
    handleOpen();
  };

  function fetchQuestions<T>(question: string, page = 1): Promise<T> {
    return fetch(
      `${API_URLS.STACKOVERFLOW}&q=${question}&page=${page}&pagesize=${API_CONFIG.DEFAULT_PAGE_SIZE}&filter=${API_CONFIG.DEFAULT_CONFIGURED_FILTER}`
    )
      .then((response) => {
        if (!response.ok) {
          response.json().then((error) => {
            throw new Error(error.error_message);
          });
        }
        return response.json();
      })
      .catch((error) => {
        console.log("error", error);
        throw new Error(error);
      });
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleQuestionSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="home">
      <Search
        defaultValue={""}
        status={status}
        onChange={handleQuestionSearch}
      />
      {status === "loading" && <p>Loading...</p>}
      {status === "success" && (
        <main>
          <QuestionList
            fetchQuestions={fetchQuestions}
            handleListItemClick={handleListItemClick}
            hasMore={hasMore}
            page={page}
            questions={questions}
            searchTerm={searchTerm}
            setHasMore={setHasMore}
            setPage={setPage}
            setQuestions={setQuestions}
            setStatus={setStatus}
            status={status}
          />
        </main>
      )}
      <QuestionDetails
        handleClose={handleClose}
        open={open}
        selectedQuestion={selectedQuestion}
      />
    </div>
  );
};

export default Home;
