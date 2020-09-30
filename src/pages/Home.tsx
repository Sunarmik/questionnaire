import React, { useState } from "react";
import { RESPONSE_STATUS } from "../@types/common";
import { IQuestions } from "../@types/IQuestions";
import Search from "../components/Search";
import "../styles/home.css";
import QuestionDetails from "../components/QuestionDetails";
import QuestionList from "../components/QuestionList";
import { fetchQuestions } from "../utils/common";
import { createStyles, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    home: {
      width: "100vw",
      height: "auto",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
  })
);

interface IHomeProps {}

const Home: React.FC<IHomeProps> = () => {
  const classes = useStyles();
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

  const handleClose = () => {
    setOpen(false);
  };

  const handleQuestionSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className={classes.home}>
      <Search
        defaultValue={""}
        status={status}
        onChange={handleQuestionSearch}
      />
      {status === "loading" && <p>Loading...</p>}
      {status === "success" && (
        <main style={{ width: "100%" }}>
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
