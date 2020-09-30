import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React, { useRef } from "react";
import { IQuestions } from "../@types/IQuestions";
import { useIntersectionObserver } from "../hook/useIntersectionObserver";

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
    questionTitle: {
      display: "flex",
      flex: 3,
      marginRight: "1em",
      justifyContent: "space-between",
      width: "100%",
    },
    questionCreatedAt: {
      display: "flex",
      flex: 1,
      justifyContent: "space-between",
      width: "100%",
      textAlign: "center",
    },
    questionAuthor: {
      display: "flex",
      flex: 1,
      marginRight: "1em",
      justifyContent: "space-between",
      width: "100%",
      textTransform: "capitalize",
    },
    questionField: {
      minWidth: "15%",
      textAlign: "end",
      lineHeight: 2,
      borderBottom: "1px solid #efefef",
      cursor: "pointer",
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

  const elementToBeObserved = useRef<HTMLDivElement>(null);

  useIntersectionObserver({
    targetElement: elementToBeObserved,
    enabled: hasMore,
    onIntersectHandler: fetchMoreData,
  });
  return (
    <>
      {questions.map((data, i, arr) => {
        /*
        setting the 70th element as the observed element and trigger point to fetch more data. this gives better ux experience.
        */
        const targetElementPosition = Math.abs(Math.floor(arr.length * 0.7));
        return (
          <div
            ref={i === targetElementPosition ? elementToBeObserved : null}
            onClick={(e) => handleListItemClick(data.question_id!)}
            className={classes.listItem}
            key={data.question_id}
          >
            <div
              className={`${classes.questionField} ${classes.questionAuthor}`}
            >
              <span className={classes.smallDevices}>Author: </span>
              {data.owner?.display_name}
            </div>
            <div
              className={`${classes.questionField} ${classes.questionTitle}`}
            >
              <span className={classes.smallDevices}>Title: </span> {data.title}
            </div>
            <div
              className={`${classes.questionField} ${classes.questionCreatedAt}`}
            >
              <span className={classes.smallDevices}>Created At: </span>{" "}
              {data.creation_date &&
                new Date(data.creation_date * 1000).toDateString()}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Questions;
