const serverUrl = "http://localhost:4000";

export const get = async (url) => {
  const options = {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
  };

  const res = await fetch(`${serverUrl}/${url}`, options);
  return await res.json();
};
export const post = async (data, url) => {
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  };
  const res = await fetch(`${serverUrl}/${url}`, options);
  console.log("response", res);
  return await res.json();
};
