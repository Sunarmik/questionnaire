import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { IQuestions } from "../@types/IQuestions";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      display: "flex",
      width: "100%",
      alignItems: "baseline",
      border: "1px solid #8b8989",
      padding: "10px",
      overflow: "hidden",
      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
      },
    },
    smallDevices: {
      display: "none",
      [theme.breakpoints.down("sm")]: {
        display: "inline",
      },
    },
    infiniteScroll: {
      width: "100%",
    },
  })
);

interface IQuestionsProps {
  questions: IQuestions[];
  fetchMoreData: () => void;
  hasMore: boolean;
  handleListItemClick: (questionId: number) => void;
}

const Questions: React.FC<IQuestionsProps> = ({
  questions,
  fetchMoreData,
  hasMore,
  handleListItemClick,
}) => {
  const classes = useStyles();
  return (
    <InfiniteScroll
      className={classes.infiniteScroll}
      dataLength={questions.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      endMessage={
        questions.length ? (
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        ) : null
      }
    >
      {questions.map((data) => (
        <div
          onClick={(e) => handleListItemClick(data.question_id!)}
          className={classes.listItem}
          key={data.question_id}
        >
          <div className="field home__questions--author">
            <span className={classes.smallDevices}>Author: </span>
            {data.owner?.display_name}
          </div>
          <div className="field home__questions--title">
            <span className={classes.smallDevices}>Title: </span> {data.title}
          </div>
          <div className="field home__questions--created-at">
            <span className={classes.smallDevices}>Created At: </span>{" "}
            {data.creation_date && new Date(data.creation_date).toDateString()}
          </div>
        </div>
      ))}
    </InfiniteScroll>
  );
};

export default Questions;
