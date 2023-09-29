import { Home } from "../resposositories/Home.js"

async function landingPage (request) {
 const user_id = request.user.userId 
  const response = await Home (user_id)
  return response
}

export { landingPage }

