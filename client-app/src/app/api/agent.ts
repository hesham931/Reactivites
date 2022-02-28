import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { activity, ActivityFormValues } from "../models/activity";
import { PaginatedResult } from "../models/pagination";
import { Photo, Profile } from "../models/profile";
import { User, UserFormValues } from "../models/user";
import { store } from "../stores/store";
import { UserActivity } from "../models/UserActivity";

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
  if (process.env.NODE_ENV === 'development') await sleep(1000);
  const pagination = response.headers['pagination'];
  if (pagination) {
    response.data = new PaginatedResult(response.data, JSON.parse(pagination));

    return response as AxiosResponse<PaginatedResult<any>>
  }
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

// axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.baseURL = process.env.REACT_APP_API_URL;



const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Activities = {
  list: (params: URLSearchParams) => axios.get<PaginatedResult<activity[]>>("/activites", {params})
    .then(responseBody),
  details: (id: string) => requests.get<activity>(`/activites/${id}`),
  create: (Activity: ActivityFormValues) => requests.post<void>(`/activites`, Activity),
  update: (Activity: ActivityFormValues) => requests.put<void>(`/activites/${Activity.id}`, Activity),
  delete: (id: string) => requests.del<void>(`/activites/${id}`),
  attend: (id: string) => requests.post<void>(`/activites/${id}/attend`, {}),
};

const Account = {
  current: () => requests.get<User>('/account'),
  login: (user: UserFormValues) => requests.post<User>('/account/login', user),
  register: (user: UserFormValues) => requests.post<User>('/account/register', user),
}

const Profiles = {
  get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
  uploadPhoto: (file: Blob) => {
    let formData = new FormData();

    formData.append('File', file);
    return axios.post<Photo>('photos', formData, {
      headers: {'Content-type': 'multipart/form-data'}
    })
  },
  setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
  deletePhoto: (id: string) => requests.del(`/photos/${id}`),
  updateProfile: (profile: Partial<Profile>) => requests.put('/profiles', profile),
  updateFollowing: (username: string) => requests.post(`/follow/${username}`, {}),
  listFollowings: (username: string, predicate: string) =>
    requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
  listActivities: (username: string, predicate: string) =>
    requests.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`)
}

const agent = {
  Activities,
  Account,
  Profiles
}
export default agent;