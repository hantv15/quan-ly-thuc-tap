import { axiosClient } from "./Link";
const SemestersAPI = {
  getSemesters() {
    const url = `/smester`;
    return axiosClient.get(url);
  },

  getDefaultSemester(){
    const url = `/smester/default`;
    return axiosClient.get(url);
  },

  insertSemester(data) {
    const url = `/add-mester`;
    return axiosClient.post(url, data);
  },

  updateSemester(data) {
    const url = `/update-mester/${data.id}`;
    return axiosClient.patch(url, data);
  },
};

export default SemestersAPI;
