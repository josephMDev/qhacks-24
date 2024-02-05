const API = "http://10.216.63.251:5001/";

export const getUser = async () => {
  return fetch(`${API}/get_info?user_id=af4f9124-d3c1-40dc-b6be-2bf142215cdc`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "get",
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      return json;
    })
    .catch((error) => {
      console.error(error);
    });
};

export const toggleStar = async (videoId) => {
  console.log(videoId);
  return fetch(
    `${API}/star?user_id=653dd4d9-b365-49d1-aab2-fc8207f41f44&video_id=${videoId}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "put",
    }
  )
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      return json;
    })
    .catch((error) => {
      console.error(error);
    });
};

export const deleteVideo = async (videoId) => {
  return fetch(`${API}/delete_video`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "put",
    body: JSON.stringify({
      video_id: videoId,
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      return json;
    })
    .catch((error) => {
      console.error(error);
    });
};
