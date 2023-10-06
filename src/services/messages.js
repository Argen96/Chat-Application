import { saveMessagesInDb, getMessageHistoryFromDb, getMessagesFromDb } from "../resposositories/message.table.js"

async function sendMessage(mssg) {
    const { message_content, sender_id, recipient_id } = mssg
    const message = {
        recipient_id: recipient_id,
        message_content: message_content,
        sender_id: sender_id
    }
    const response = await saveMessagesInDb(message)
    return response
}

async function showMessageHistory(request) {
    const { senderId, recipientId } = request.params;
    const messages = await getMessageHistoryFromDb(senderId, recipientId)
    return messages
}

async function showAllMessages(request) {
    const user_id = request.user.userId
    const { lastMessages, recipientUsers } = await getMessagesFromDb(user_id)
    const messageGroups = {};
    const recipientNamesMap = {};
    recipientUsers.forEach((recipient) => {
        recipientNamesMap[recipient.user_id] = `${recipient.first_name} ${recipient.last_name}`;
    });

    lastMessages.forEach((message) => {
        const otherUserId = message.sender_id === user_id ? message.recipient_id : message.sender_id;
        if (!messageGroups[otherUserId]) {
            messageGroups[otherUserId] = message;
        }
        messageGroups[otherUserId].recipient_name = recipientNamesMap[otherUserId];
    });
    const lastMessagesWithUsers = Object.values(messageGroups);
    return lastMessagesWithUsers;
}

export { sendMessage, showMessageHistory, showAllMessages }