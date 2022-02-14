import { mainAPIURL, appToken } from '@/settings';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

const injectToken = (config: AxiosRequestConfig): AxiosRequestConfig => {
	const token = localStorage.getItem('access_token');
	if (config?.headers && token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
}

abstract class HttpClient {
	protected readonly client: AxiosInstance;

	public constructor(
		baseURL: string = mainAPIURL
	) {
		const headers = {
			'content-type': 'application/json',
			'app-token': appToken
		}
		const config: AxiosRequestConfig = {
			baseURL: baseURL,
			headers: headers
		}
		this.client = axios.create(config)
		this.client.interceptors.request.use(
			injectToken,
			(error) => Promise.reject(error)
		)
		this.client.interceptors.response.use(
			(response) => response,
			(error: AxiosError) => {
				return this.handleError(error)
			}
		)
	}

	private handleError(error: AxiosError) {
		const errorMessage = 
			error?.response?.data?.detail ||
			"unknown error"
		throw new Error(errorMessage)
		// return error.response;
	}


}

export default HttpClient
