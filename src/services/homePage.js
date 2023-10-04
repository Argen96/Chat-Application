import { allUsers, selectiveUsers } from "../resposositories/users.table.js"

async function landingPage(request) {
  const user_id = request.user.userId
  const response = await allUsers(user_id)
  return response
}

async function searchUsers(request) {
  const { first_name, last_name } = request.query
  const response = await selectiveUsers(first_name, last_name)
  return response
}

export { landingPage, searchUsers }

