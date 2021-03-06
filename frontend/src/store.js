import Vue from "vue";
import Vuex from "vuex";
import api from "./services/api";
import router from "./router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: null,
    status: "",
    statusType: "",
    user: null,
    usersTable: null,
    coursesTable: null,
    editedUserData: null,
    editedCourseData: null,
    accessedCourseData: null,
    createModule: null,
    createLecture: null,
    addContent: null,
    addLectureContent: null,
    modulesTable: null,
    courses: []
  },
  mutations: {
    authUser(state, userData) {
      state.token = userData.token;
      state.status = "success";
      //router.replace("/dashboard/courses");
    },
    authError(state, message) {
      state.statusType = message;
      state.status = "error";
    },
    clearAlert(state) {
      state.status = "";
      state.statusType = "";
    },
    registerUser(state, registerUser) {
      state.username = registerUser.username;
      state.email = registerUser.email;
      state.password = registerUser.password;
      state.admin = registerUser.admin;
      state.courses = registerUser.courses;
    },
    updateUser(state, registerUser) {
      state.username = registerUser.username;
      state.email = registerUser.email;
      state.admin = registerUser.admin;
      state.courses = registerUser.courses;
    },
    editedUserInfo(state, editedUserData) {
      state.editedUserData = editedUserData;
    },
    editedCourseInfo(state, editedCourseData) {
      state.editedCourseData = editedCourseData;
    },
    createCourse(state, courseData) {
      state.title = courseData.title;
      state.url = courseData.url;
      state.author = courseData.author;
      state.description = courseData.description;
    },
    updateCourse(state, courseData) {
      state.title = courseData.title;
      state.url = courseData.url;
      state.author = courseData.author;
      state.description = courseData.description;
    },
    fetchUsersMutation(state, usersData) {
      state.usersTable = usersData;
    },
    fetchCoursesMutation(state, coursesData) {
      state.coursesTable = coursesData;
    },
    fetchModules(state, modulesData) {
      state.modulesTable = modulesData;
    },
    currentUser(state, currentUserData) {
      state.user = currentUserData;
    },
    changePassword(state, changeData) {
      state.user.password = changeData.password;
    },
    logoutUser(state) {
      state.token = null;
      state.status = "";
      state.statusType = "";
      state.user = null;
      state.usersTable = null;
      state.coursesTable = null;
      state.courses = [];
    },
    accessedCourse(state, accessedCourseData) {
      state.accessedCourseData = accessedCourseData;
    },
    createModule(state, createModule) {
      state.createModule = createModule;
    },
    createLecture(state, createLecture) {
      state.createLecture = createLecture;
    },
    addContent(state, addContent) {
      state.addContent = addContent;
    },
    addLectureContent(state, addLectureContent) {
      state.addLectureContent = addLectureContent;
    }
  },
  actions: {
    async register({ commit }, registerData) {
      try {
        const { data } = await api.post("/dashboard/admin/users/create", {
          username: registerData.username,
          email: registerData.email,
          password: registerData.password,
          admin: registerData.admin,
          courses: registerData.courses
        });
        commit("registerUser", {
          username: data.username,
          email: data.email,
          password: data.password,
          admin: data.admin,
          courses: data.courses
        });
      } catch (error) {
        console.log(error);
      }
    },
    async updateUser({ commit }, registerData) {
      try {
        const { data } = await api.put(
          `/dashboard/admin/users/${registerData.id}`,
          {
            username: registerData.username,
            email: registerData.email,
            admin: registerData.admin,
            courses: registerData.courses
          }
        );
        commit("updateUser", {
          username: data.username,
          email: data.email,
          admin: data.admin,
          courses: data.courses
        });
      } catch (error) {
        console.log(error);
      }
    },
    async createCourse({ commit }, courseData) {
      try {
        const { data } = await api.post("/dashboard/admin/courses/create", {
          title: courseData.title,
          url: courseData.url,
          author: courseData.author,
          description: courseData.description
        });
        commit("createCourse", {
          title: data.title,
          url: data.url,
          author: data.author,
          description: data.description
        });
      } catch (error) {
        console.log(error);
      }
    },
    async updateCourse({ commit }, courseData) {
      try {
        const { data } = await api.put(
          `/dashboard/admin/courses/${courseData.id}`,
          {
            title: courseData.title,
            url: courseData.url,
            author: courseData.author,
            description: courseData.description
          }
        );
        commit("updateCourse", {
          title: data.title,
          url: data.url,
          author: data.author,
          description: data.description
        });
      } catch (error) {
        console.log(error);
      }
    },
    async createModule({ commit }, moduleContent) {
      try {
        const { data } = await api.post(
          `/dashboard/admin/courses/${this.state.addContent.id}/module/create`,
          {
            moduleTitle: moduleContent.moduleTitle
          }
        );
        commit("createModule", {
          moduleTitle: data.moduleTitle
        });
      } catch (error) {
        console.log(error);
      }
    },
    async createLecture({ commit }, lectureContent) {
      try {
        const { data } = await api.post(
          `/dashboard/admin/courses/${this.state.addLectureContent.id}/lecture/create`,
          {
            lectureTitle: lectureContent.lectureTitle,
            lectureURL: lectureContent.lectureURL,
          }
        );
        commit("createLecture", {
          lectureTitle: data.lectureTitle,
          lectureURL: data.lectureURL
        });
      } catch (error) {
        console.log(error);
      }
    },
    async login({ commit }, authData) {
      try {
        const { data } = await api.post("/login", {
          email: authData.email,
          password: authData.password
        });
        /*global localStorage*/ localStorage.setItem("token", data.token);
        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        await commit("authUser", {
          token: data.token,
          status: "success"
        });
      } catch (error) {
        commit("authError", error.response.data[0].field);
        /*global localStorage*/ localStorage.removeItem("token");
      }
    },
    async fetchUsersTable({ commit }) {
      try {
        const { data } = await api.get("/dashboard/admin/users");
        commit("fetchUsersMutation", data);
      } catch (error) {
        console.log(error);
      }
    },
    async fetchCoursesTable({ commit }) {
      try {
        const { data } = await api.get("/dashboard/admin/courses");
        commit("fetchCoursesMutation", data);
      } catch (error) {
        console.log(error);
      }
    },
    async fetchModules({ commit }) {
      try {
        const { data } = await api.get("/dashboard/admin/courses/modules");
        commit("fetchModules", data);
      } catch (error) {
        console.log(error);
      }
    },
    async fetchUser({ commit }) {
      try {
        const { data } = await api.get("/current");
        commit("currentUser", {
          user: data
        });
      } catch (error) {
        console.log(error);
      }
    },
    editedUserInfo({ commit }, editedUserData) {
      commit("editedUserInfo", editedUserData);
    },
    editedCourseInfo({ commit }, editedCourseData) {
      commit("editedCourseInfo", editedCourseData);
    },
    async removeUser({ commit }, userId) {
      try {
        await api.delete(`/dashboard/admin/users/${userId}`);
      } catch (err) {
        console.log(err);
      }
    },
    async removeCourse({ commit }, courseId) {
      try {
        await api.delete(`/dashboard/admin/courses/${courseId}`);
      } catch (err) {
        console.log(err);
      }
    },
    clearAlert({ commit }) {
      commit("clearAlert");
    },
    logoutUser({ commit }) {
      commit("logoutUser");
      delete api.defaults.headers.common["Authorization"];
      router.replace("/login");
    },
    async accessedCourse({ commit }, accessedCourse) {
      try {
        const { data } = await api.get(`/dashboard/courses/${accessedCourse.id}`);
        commit("accessedCourse", data);
        router.replace(`/dashboard/courses/${data.id}`);
      } catch(err) {
        console.log(err);
      }
    },
    addContent({ commit }, addContent) {
      commit("addContent", addContent);
    },
    addLectureContent({ commit }, addLectureContent) {
      commit("addLectureContent", addLectureContent);
    }
  },
  getters: {
    statusType: state => {
      return state.statusType;
    },
    status: state => {
      return state.status;
    },
    token: state => {
      return state.token;
    },
    user: state => {
      return state.user;
    },
    usersTable: state => {
      return state.usersTable;
    },
    coursesTable: state => {
      return state.coursesTable;
    },
    courses: state => {
      return state.courses;
    },
    editedUserData: state => {
      return state.editedUserData;
    },
    editedCourseData: state => {
      return state.editedCourseData;
    },
    accessedCourseData: state => {
      return state.accessedCourseData;
    },
    modulesTable: state => {
      return state.modulesTable;
    },
    addLectureContent: state => {
      return state.addLectureContent;
    },
  }
});
