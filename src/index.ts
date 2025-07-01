// async function test() {
//   const user: typeof userTable.$inferInsert = {
//     name: "blabla",
//     password: "bla",
//     email: "bla@bla.com",
//   }

//   await db.insert(userTable).values(user);
//   console.log('New user created!')

//   const users = await db.select().from(userTable);
//   console.log('Getting all users from the database: ', users)

//   await db
//     .update(userTable)
//     .set({
//       email: "bla1@bla.fr"
//     })
//     .where(eq(userTable.email, user.email));
//   console.log('User info updated!')

//   await db.delete(userTable).where(eq(userTable.name, user.name));
//   console.log('User deleted!')

// }
