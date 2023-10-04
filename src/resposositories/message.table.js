import { db } from "../../db.js";
import { getAllPeopleUserHaveChattedFromDb } from "./users.table.js";

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

    const recipientUserIds = lastMessages.map((message) =>
        message.sender_id === user_id ? message.recipient_id : message.sender_id
    );
    const recipientUsers = await getAllPeopleUserHaveChattedFromDb(recipientUserIds)
    return {
        lastMessages: lastMessages,
        recipientUsers: recipientUsers
    }
}

export { saveMessagesInDb, getMessageHistoryFromDb, getMessagesFromDb }