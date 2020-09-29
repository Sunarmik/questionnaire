import { FetchMoreDataType, RESPONSE_STATUS } from "../@types/common";
import { IQuestionsList } from "../@types/IQuestions";
import { API_CONFIG } from "../constants/config";
import { API_URLS } from "../constants/request";

export function fetchQuestions<T>(question: string, page = 1): Promise<T> {
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

export const fetchMoreData: FetchMoreDataType = async (searchTerm, setQuestions, setStatus, setHasMore, questions, setPage, enqueueSnackbar, page) => {
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
            (ques) => ques.question_id === item.question_id // need to handle duplicate questions
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
