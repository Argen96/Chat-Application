import { db } from "../../db.js";

async function saveMessagesInDb(message) {
    await db("one_on_one_messages").insert(message);
    return 'Message is sent '
}

async function getMessageHistoryFromDb(senderId, recipientId) {
    const messages = await db("one_on_one_messages")
        .where({
            sender_id: senderId,
            recipient_id: recipientId,
        })
        .orderBy("timestamp", "asc").orWhere({
            sender_id: recipientId,
            recipient_id: senderId,
        });
    return messages
}

async function getMessagesFromDb(user_id) {

    const lastMessages = await db("one_on_one_messages")
        .where({
            sender_id: user_id,
        })
        .orWhere({
            recipient_id: user_id,
        })
        .orderBy("timestamp", "desc");
    const messageGroups = {}; 
    const recipientUserIds = lastMessages.map((message) =>
        message.sender_id === user_id ? message.recipient_id : message.sender_id
    );
    const recipientUsers = await db("users")
        .whereIn("user_id", recipientUserIds)
        .select("user_id", "first_name", "last_name");
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

export { saveMessagesInDb, getMessageHistoryFromDb, getMessagesFromDb }