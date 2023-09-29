import { db } from "../../db.js"

async function Home(user_id) {
    const user_data = await db("users")
        .where({ user_id: user_id })
        .select("user_id", "first_name", "last_name");
    const random_users = await db("users").whereNot({ user_id: user_id })
        .select("user_id", "first_name", "last_name");
    return {
        original_user: user_data,
        other_users: random_users
    }

}

export { Home }