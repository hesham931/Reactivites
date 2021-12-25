import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { activity } from "../models/activity";
import { User, UserFormValues } from "../models/user";
import { store } from "../stores/store";

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  })
}

axios.interceptors.request.use(config => {
  const token = store.commonStore.token;
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config;
})
axios.interceptors.response.use(async response => {
  await sleep(2000);
  return response;
}, (error: AxiosError) => {
  const { data, status, config } = error.response!;

  switch (status) {
    case 400:
      if (typeof data === 'string') {
        toast.error(data);
      }
      if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
        toast.error("Not allowed id !");
        history.push('/not-found');
      }
      if (data.errors) {
        if (config.method !== 'get') {
          const messagesError = [];

          for (const key in data.errors) {
            if (data.errors[key]) {
              messagesError.push(data.errors[key]);
            }
          }
          toast.error("Validation errors!");
          throw messagesError.flat();
        }
      }
      break;
    case 401:
      toast.error("Unauthorised !");
      break;
    case 404:
      toast.error("Not Found !");
      history.push('/error/not-found');
      break;
    case 500:
      toast.error("Server Error !");
      store.commonStore.setServerError(data);
      history.push('/server-error')
      break;
  }
  return Promise.reject(error);
})//after the comma function will excute if there is any error

axios.defaults.baseURL = "http://localhost:5000/api";



const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Activities = {
  list: () => requests.get<activity[]>("/activites"),
  details: (id: string) => requests.get<activity>(`/activites/${id}`),
  create: (Activity: activity) => requests.post<void>(`/activites`, Activity),
  update: (Activity: activity) => requests.put<void>(`/activites/${Activity.id}`, Activity),
  delete: (id: string) => requests.del<void>(`/activites/${id}`)
};

const Account = {
  current: () => requests.get<User>('/account'),
  login: (user: UserFormValues) => requests.post<User>('/account/login', user),
  register: (user: UserFormValues) => requests.post<User>('/account/register', user),
}

const agent = {
  Activities,
  Account
}
export default agent;