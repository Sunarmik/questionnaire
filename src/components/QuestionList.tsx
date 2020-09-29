import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { RESPONSE_STATUS } from "../@types/common";
import { IQuestions, IQuestionsList } from "../@types/IQuestions";
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
  fetchQuestions,
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

  const fetchMoreData = async () => {
    try {
      if (!searchTerm) {
        setQuestions([]);
        setStatus(RESPONSE_STATUS.SUCCESS);
        setHasMore(false);
        return;
      }
      questions.length === 0 && setStatus(RESPONSE_STATUS.LOADING);
      const data = await fetchQuestions<IQuestionsList>(searchTerm, page);
      setQuestions((prevQuestions) => {
        const combinedArray = prevQuestions.concat(data.items);
        return combinedArray.filter(
          (item, index) =>
            combinedArray.findIndex(
              (ques) => ques.question_id === item.question_id
            ) === index
        );
      });
      setStatus(RESPONSE_STATUS.SUCCESS);
      setPage((prevPage) => prevPage + 1);
      setHasMore(data.has_more);
    } catch (error) {
      setQuestions([]);
      setStatus(RESPONSE_STATUS.ERROR);
      setHasMore(false);
      enqueueSnackbar(error.message, {
        variant: "error",
        preventDuplicate: true,
      });
    }
  };

  useEffect(() => {
    fetchMoreData();
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
            fetchMoreData={fetchMoreData}
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
