import { saveMessagesInDb, getMessagesFromDb } from "../resposositories/message.table.js"

async function sendMessage(request) {
    const { text, recipient_id } = request.body
    const user_id = request.user.userId
    const message = {
        recipient_id : recipient_id,
        message_content : text,
        sender_id : user_id
    }
    const response = await saveMessagesInDb(message)
    return response
}

async function showMessages (request) {
  const { senderId, recipientId } = request.params;
  const messages = await getMessagesFromDb(senderId, recipientId)
  return messages     
}

export { sendMessage,  showMessages }