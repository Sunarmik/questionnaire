import { Backdrop, Fade, Modal } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import { IQuestions } from "../@types/IQuestions";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      width: "90%",
      margin: "20px auto",
      overflowY: "scroll",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);

interface IQuestionDetailsProps {
  open: boolean;
  handleClose: () => void;
  selectedQuestion: IQuestions | undefined;
}

const QuestionDetails: React.FC<IQuestionDetailsProps> = ({
  open,
  handleClose,
  selectedQuestion,
}) => {
  const classes = useStyles();
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop} // Backdrop may show some warning as it is using old findDomNode api.
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
            <br />
            <hr />
            <br />
            <br />
            <a rel="noreferrer nofollow" href={selectedQuestion?.link}>
              Click here to see the question on stackoverflow.
            </a>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default QuestionDetails;
