import { OptionsObject } from "notistack";
import { IQuestions } from "./IQuestions";

export enum RESPONSE_STATUS {
  LOADING = 'loading',
  ERROR = 'error',
  SUCCESS = 'success'
}

export type FetchMoreDataType = (
  searchTerm: string,
  setQuestions: (value: React.SetStateAction<IQuestions[]>) => void,
  setStatus: (value: React.SetStateAction<RESPONSE_STATUS>) => void,
  setHasMore: (value: React.SetStateAction<boolean>) => void,
  questions: IQuestions[],
  setPage: React.Dispatch<React.SetStateAction<number>>,
  enqueueSnackbar: (message: React.ReactNode, options?: OptionsObject | undefined) => React.ReactText,
  page: number
) => void;

interface IntersectionArguments {
  parentElement?: React.RefObject<HTMLDivElement>,
  targetElement: React.RefObject<HTMLDivElement>,
  onIntersectHandler: () => void,
  intersectionThreshold?: number,
  parentMargin?: string,
  enabled: boolean;
}

export type UseIntersectionObserverType = (data: IntersectionArguments) => void;
