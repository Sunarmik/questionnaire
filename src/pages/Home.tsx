import React, { useEffect, useState } from "react";
import Modal from "@material-ui/core/Modal";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import InfiniteScroll from "react-infinite-scroll-component";
import { RESPONSE_STATUS } from "../@types/common";
import { IQuestionsList, IQuestions } from "../@types/IQuestions";
import Search from "../components/Search";
import { API_CONFIG } from "../constants/config";
import { API_URLS } from "../constants/request";
import "../styles/home.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    listItem: {
      display: "flex",
      width: "100%",
      alignItems: "baseline",
      border: "1px solid #efefef",
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
    hideOnSmallDevices: {
      display: "flex",
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
    infiniteScroll: {
      width: "100%",
    },
  })
);

interface IHomeProps {}

const Home: React.FC<IHomeProps> = () => {
  const classes = useStyles();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [questions, setQuestions] = useState<IQuestions[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState(RESPONSE_STATUS.SUCCESS);
  const [open, setOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<
    IQuestions | undefined
  >(undefined);
  function fetchQuestions<T>(question: string, page = 1): Promise<T> {
    return fetch(
      `${API_URLS.STACKOVERFLOW}&q=${question}&page=${page}&pagesize=${API_CONFIG.DEFAULT_PAGE_SIZE}&filter=${API_CONFIG.DEFAULT_CONFIGURED_FILTER}`
    ).then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    });

    // const data = require("../sample.json");
    // return data;
  }

  const handleListItemClick = (questionId: number) => {
    setSelectedQuestion(
      questions.find((question) => question.question_id === questionId)
    );
    handleOpen();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

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
              <div id="scrollableDiv">
                {!!questions.length && (
                  <div
                    className={
                      classes.hideOnSmallDevices + " scrollablediv--header"
                    }
                  >
                    <span>Author</span>
                    <span>Question</span>
                    <span>Date</span>
                  </div>
                )}
                <InfiniteScroll
                  className={classes.infiniteScroll}
                  dataLength={questions.length}
                  next={fetchMoreData}
                  hasMore={hasMore}
                  loader={<h4>Loading...</h4>}
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
                        <span className={classes.smallDevices}>Title: </span>{" "}
                        {data.title}
                      </div>
                      <div className="field home__questions--created-at">
                        <span className={classes.smallDevices}>
                          Created At:{" "}
                        </span>{" "}
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
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">{selectedQuestion?.title}</h2>
            <div
              id="transition-modal-description"
              dangerouslySetInnerHTML={{ __html: selectedQuestion?.body || "" }}
            ></div>
            <a rel="noreferrer nofollow" href={selectedQuestion?.link}>
              Click here to see the question on stackoverflow.
            </a>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default Home;
