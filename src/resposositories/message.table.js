import { db } from "../../db.js";

async function saveMessagesInDb(message) {
    await db("one_on_one_messages").insert(message);
    return 'Message is sent '
}

async function getMessagesFromDb(senderId, recipientId) {
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
export { saveMessagesInDb, getMessagesFromDb }