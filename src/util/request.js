import fetch from "dva/fetch";
const codeMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
  2003: "授权码验证失败"
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

function checkJsonStatus(response) {
  //console.log('jsonresult', response);
  if (response?.result?.code === 2003) {
    const errortext = codeMessage[response.result.code] || response.statusText;
    notification.error({
      message: `请求错误 ${response.result.code}`,
      description: errortext
    });
    const error = new Error(errortext);
    error.name = response.result.code;
    error.response = response;
    throw error;
  }
  return response;
}
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

export default function request(url, args, platform = false, header = null) {
  // let sourceurl = baseurl + url;
  const Debug = true;
  let urlArray = cityUrls;
  if (Debug) {
    urlArray = cityUrlsDebug;
  }

  let source = urlArray[getCity()];
  if (platform) {
    source = urlArray[platform];
  }
  let sourceurl = source + url;
  const token = getToken();
  const defaultOptions = {
    credentials: "include",
    method: "GET",
    headers: { token }
  };

  const options = args;
  //console.log('options', options);
  const newOptions = {
    ...defaultOptions
  };
  let params = options.body;
  if (options.method === "POST") {
    if (header) {
      newOptions.headers = {
        ...newOptions.headers,
        ...header
      };
      newOptions.body = JSON.stringify(params);
    } else {
      params = { ...params, token };
      const formBody = new FormData();
      for (const i in params) {
        if (params[i] != null) {
          //console.log('params i', i, params[i]);
          formBody.append(i, params[i]);
        }
      }
      newOptions.body = formBody;
    }
    newOptions.method = options.method;
  } else {
    if (header) {
      newOptions.headers = {
        ...newOptions.headers,
        ...header
      };
    } else {
      newOptions.headers = {
        // 'Cookie': cookie ? cookie : null,
        token,
        "Content-Type": "application/x-www-form-urlencoded"
      };
      params = { ...params, token };
    }
    let formBody = [];
    for (const property in params) {
      if ({}.hasOwnProperty.call(params, property)) {
        // const encodedKey = encodeURIComponent(property);
        // const encodedValue = encodeURIComponent(params[property]);
        const encodedKey = property;
        const encodedValue = params[property];
        formBody.push(`${encodedKey}=${encodedValue}`);
      }
    }
    formBody = formBody.join("&");
    sourceurl = `${sourceurl}?${formBody}`;
  }

  return fetch(sourceurl, newOptions)
    .then(checkStatus)
    .then(response => {
      if (newOptions.method === "DELETE" || response.status === 204) {
        return response.text();
      }
      const result = response.json();
      return result;
    })
    .then(result => checkJsonStatus(result))

    .catch(e => {
      const { dispatch } = store;
      const status = e.name;
      if (status === 2003) {
        dispatch({
          type: "login/logout"
        });
        return;
      }
      if (status === 401) {
        dispatch({
          type: "login/logout"
        });
        return;
      }
      if (status === 403) {
        dispatch(routerRedux.push("/exception/403"));
        return;
      }
      if (status <= 504 && status >= 500) {
        dispatch(routerRedux.push("/exception/500"));
        return;
      }
      if (status >= 404 && status < 422) {
        dispatch(routerRedux.push("/exception/404"));
      }
    });
}
