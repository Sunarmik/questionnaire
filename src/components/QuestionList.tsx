import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { RESPONSE_STATUS } from "../@types/common";
import { IQuestions } from "../@types/IQuestions";
import { fetchMoreData } from "../utils/common";
import Questions from "./Questions";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    hideOnSmallDevices: {
      display: "flex",
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
    scrollDiv: {
      width: "100%",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  })
);

interface IQuestionListProps {
  searchTerm: string;
  fetchQuestions: <T>(searchTerm: string, page: number) => Promise<T>;
  setQuestions: React.Dispatch<React.SetStateAction<IQuestions[]>>;
  setStatus: React.Dispatch<React.SetStateAction<RESPONSE_STATUS>>;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  questions: IQuestions[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  status: RESPONSE_STATUS;
  handleListItemClick: (questionId: number) => void;
  hasMore: boolean;
  page: number;
}

const QuestionList: React.FC<IQuestionListProps> = ({
  searchTerm,
  setQuestions,
  setStatus,
  setHasMore,
  questions,
  setPage,
  status,
  handleListItemClick,
  hasMore,
  page,
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const loadMoreData = () => {
    fetchMoreData(
      searchTerm,
      setQuestions,
      setStatus,
      setHasMore,
      questions,
      setPage,
      enqueueSnackbar,
      page
    );
  };

  useEffect(() => {
    setQuestions([]);
    loadMoreData();
  }, [searchTerm]);

  return (
    <section className="home__questions">
      {status === "success" && (
        <div id="scrollableDiv" className={classes.scrollDiv}>
          {!!questions.length && (
            <div
              className={classes.hideOnSmallDevices + " scrollablediv--header"}
            >
              <span>Author</span>
              <span>Question</span>
              <span>Date</span>
            </div>
          )}
          <Questions
            fetchMoreData={loadMoreData}
            handleListItemClick={handleListItemClick}
            hasMore={hasMore}
            questions={questions}
          />
        </div>
      )}
    </section>
  );
};

export default QuestionList;
