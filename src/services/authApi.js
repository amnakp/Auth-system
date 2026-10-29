import axios from "axios";

const API_URL = "http://localhost:3001/users";

const DEFAULT_AVATAR =
"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJcAAACUCAMAAACp1UvlAAAAM1BMVEXl5uivtLissbXX29zo6euyt7vIy87T1tjAxMersrje4OLLztG5vcGprrLDx8q7wMSstLVraFmoAAADeklEQVR4nO2b25KkIAxABQPIRdn//9oFe6qnu1pbiCZYu5yHmXmbUzEmXOIwdDqdTqfT6XQ6nU6n0+n8EwB8/tUcAGf8EmMIcVr86G6hBoPTSggppVh/pt/Bu6GxGgwmrEZvSDuZtkEzSnxYrWYyjM3EwIV5S+phNi+ujRnoXamHmTBNvKbNJ/hmpvkj5tSRVRabbqklhI3cWocP8SdivGKhUCs/Sr4cg1islcQ8lxj4Cq3EyOTlqqxSHeMJGChbKcZSxsDsN58dlGPwGsoq1ys20gcMTF3Sr8z0AYP6cCXIixiM1dmVIc8wOF5FbCE9sVdhv/4gED9ITNZnZlotWLBetMt93NuYWWi9UG9jhnYd5tBepJUCWb3ovSpXXq9QrsJA470oN5OwoLUkqdd0Uy9sWf1fvfB5T+t11zpx07p6og8FUq+79m1Qf3Baknidg30hZ0O7kEavo4nX98h9h6TecWP3adRH04CrFPQnJ6idB/HbuII6NyG3GjDnTCxnv4geyXMuB+GW55j1NUwxHZRXnrBKrnPyuuIqiTvjGxX3MAyl6xcovrdi1UrtqEyMvF9/iEHJo2xwYQvDdPhWtrhHzps28a3AWqtaDQS4+G1OQTfSyowb0yY5VlLEhlbrHEzcmIMRS7tpk181H5WVT4SKpvXY0AMANxq9TDFOizbjjUbA4I3WNpmskaJlvPc64b0xzg0t7dI/dqOfglqn0cRPcuWsTykWJm8c/1Bf+n+rktysEg85KVVcDKNaenAmplpw3B+zddCOxQ2cD2I3TJtySo/kZibIyl1HVrNKE45CgtMKey6XGhNN0FJWxYKU+mImA0EfADfVJNWOWrh4D5IWgV/XWqVYoS7ctAH40m3GMXK6agEEY/murAArLpqlOHHHsc18QcjAYQrWd6wVZ/Mfxusy65WTczFn7qkOxM5M3J65zj4UC/giizsTLwS/vSTVShHDiSFvECqwCqNFmFtPsVCvhb2gqhOrfitHDi3E8HRg0cqHwjVi9Dn/pCb3wXBZ5QPYmqd4davex5Y/SbquuEn5CCmnVYpY4aKHOVzl38ygZ0GRzGWX3yyV/pWyywfgKqkvlNybVn5VcgUl3Qh8A6+S9s3Xgn4paUYN0qvk+48G6VWUYPiJuDNexwMW7NVr5bBHgp5lA44/YXNjE460Op1Op9PpDMNfkwYrlHHRqgQAAAAASUVORK5CYII=";

// Login: GET /users?email=<email>
export async function getUserByEmail(email) {
  const { data } = await axios.get(API_URL, {
    params: { email: email.trim().toLowerCase() },
  });
  return data[0] || null;
}

// Profile: GET /users/:id
export async function getUserById(id) {
  const { data } = await axios.get(`${API_URL}/${id}`);
  return data;
}

// Duplicate check: GET /users?username=<username>
export async function checkUsernameExists(username) {
  const { data } = await axios.get(API_URL, {
    params: { username: username.trim() },
  });
  return data.length > 0;
}

// Register: POST /users
export async function createUser(userData) {
  const newUser = {
    username: userData.username.trim(),
    email: userData.email.trim().toLowerCase(),
    password: userData.password,
    fullName: userData.fullName.trim(),
    avatar: userData.avatar || DEFAULT_AVATAR,
    createdAt: new Date().toISOString(),
  };

  const { data } = await axios.post(API_URL, newUser);
  return data;
}