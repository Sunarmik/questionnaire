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
