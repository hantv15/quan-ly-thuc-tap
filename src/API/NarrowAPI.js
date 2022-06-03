import { axiosClient } from "./Link";
const NarrowAPI = {
  getNarrow() {
    const url = `/narrows`;
    return axiosClient.get(url);
  },

  insertNarrow(data) {
    const url = `/add-narrows`;
    return axiosClient.post(url, data);
  },

  updateNarrow(data) {
    const url = `/update-narrow`;
    return axiosClient.patch(url, data);
  },
};

export default NarrowAPI;
