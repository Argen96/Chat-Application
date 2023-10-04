import { saveMessagesInDb, getMessageHistoryFromDb, getMessagesFromDb } from "../resposositories/message.table.js"

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

async function showMessageHistory (request) {
  const { senderId, recipientId } = request.params;
  const messages = await getMessageHistoryFromDb(senderId, recipientId)
  return messages     
}

async function showAllMessages(request){
    const user_id = request.user.userId
    const messages = await getMessagesFromDb(user_id)
    return messages
}

export { sendMessage,  showMessageHistory, showAllMessages}