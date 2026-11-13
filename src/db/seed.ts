import { db } from "./index";
import { users, posts, comments, likes, follows, messages, notifications } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await db.delete(notifications);
  await db.delete(messages);
  await db.delete(likes);
  await db.delete(comments);
  await db.delete(posts);
  await db.delete(follows);
  await db.delete(users);

  const passwordHash = await bcrypt.hash("password123", 10);

  // Create users
  const demoUsers = [
    {
      name: "Alex Johnson",
      email: "alex@kcc.edu",
      passwordHash,
      bio: "Computer Science major. Love coding and coffee ☕",
      avatarUrl: "",
      department: "Computer Science",
      year: "Junior",
      isOnline: true,
    },
    {
      name: "Maria Garcia",
      email: "maria@kcc.edu",
      passwordHash,
      bio: "Biology pre-med student. Aspiring doctor 🩺",
      avatarUrl: "",
      department: "Biology",
      year: "Senior",
      isOnline: true,
    },
    {
      name: "James Wilson",
      email: "james@kcc.edu",
      passwordHash,
      bio: "Business major & basketball team captain 🏀",
      avatarUrl: "",
      department: "Business Administration",
      year: "Sophomore",
      isOnline: false,
    },
    {
      name: "Priya Patel",
      email: "priya@kcc.edu",
      passwordHash,
      bio: "Mathematics & Data Science. Board game enthusiast 🎲",
      avatarUrl: "",
      department: "Mathematics",
      year: "Junior",
      isOnline: true,
    },
    {
      name: "David Kim",
      email: "david@kcc.edu",
      passwordHash,
      bio: "Music production & Audio Engineering 🎵",
      avatarUrl: "",
      department: "Music",
      year: "Freshman",
      isOnline: false,
    },
    {
      name: "Sarah Thompson",
      email: "sarah@kcc.edu",
      passwordHash,
      bio: "English Literature major. Avid reader and writer 📚",
      avatarUrl: "",
      department: "English",
      year: "Senior",
      isOnline: true,
    },
    {
      name: "Carlos Rodriguez",
      email: "carlos@kcc.edu",
      passwordHash,
      bio: "Graphic Design student. Freelance photographer 📷",
      avatarUrl: "",
      department: "Art & Design",
      year: "Junior",
      isOnline: false,
    },
    {
      name: "Emily Chen",
      email: "emily@kcc.edu",
      passwordHash,
      bio: "Psychology major. Mental health advocate 🧠",
      avatarUrl: "",
      department: "Psychology",
      year: "Sophomore",
      isOnline: true,
    },
  ];

  const insertedUsers = await db.insert(users).values(demoUsers).returning();
  console.log(`✅ Created ${insertedUsers.length} users`);

  const [alex, maria, james, priya, david, sarah, carlos, emily] = insertedUsers;

  // Create posts
  const demoPosts = [
    { authorId: alex.id, content: "Just finished my data structures assignment! Anyone else struggling with AVL trees? Let's form a study group 🌳💻" },
    { authorId: maria.id, content: "Lab results from today's bio experiment were amazing! The enzyme activity was off the charts. Science is so cool 🔬" },
    { authorId: james.id, content: "Basketball tryouts this Thursday at 3PM in the gym. All skill levels welcome! We need new players for this season 🏀🔥" },
    { authorId: priya.id, content: "Found a great resource for linear algebra on MIT OpenCourseWare. Highly recommend for anyone taking MATH 201 📐" },
    { authorId: david.id, content: "Just dropped a new beat on my SoundCloud. Produced it entirely in the campus studio. Link in bio if you want to check it out 🎶" },
    { authorId: sarah.id, content: "Book club meeting this Friday! We're discussing 'The Great Gatsby' by Fitzgerald. Bring your thoughts and snacks 📖✨" },
    { authorId: carlos.id, content: "Shot some incredible photos at sunset near the campus lake. The golden hour lighting was perfect. Nature is the best canvas 🌅" },
    { authorId: emily.id, content: "Reminder: Mental Health Awareness Week starts Monday! We have guest speakers, free therapy dog sessions, and mindfulness workshops 💚" },
    { authorId: alex.id, content: "The hackathon this weekend was incredible! Our team built a campus navigation app and won second place 🥈 Thank you everyone who participated!" },
    { authorId: maria.id, content: "Just got accepted into the summer research program at the medical center! Dreams are coming true 😭❤️" },
    { authorId: james.id, content: "Study tip: I've been using the Pomodoro technique (25 min study, 5 min break) and my focus has improved dramatically. Try it out! ⏱️" },
    { authorId: priya.id, content: "The campus café just added new boba tea flavors. The taro one is amazing 🧋" },
    { authorId: sarah.id, content: "Working on my thesis about the evolution of modern poetry. If anyone has interesting sources, please share! I'm in the library all week 📝" },
    { authorId: david.id, content: "Looking for band members! Need a bassist and a drummer for our indie rock group. Rehearsals twice a week in the music building 🎸🥁" },
    { authorId: carlos.id, content: "Art exhibition opening next Wednesday in the Student Gallery. Featuring works from 15 student artists. Free admission and refreshments! 🎨" },
    { authorId: emily.id, content: "Started a journaling challenge - write 3 things you're grateful for every day. Day 12 and I already feel a mindset shift. Join me! 📓" },
    { authorId: alex.id, content: "PSA: The computer lab on the 3rd floor now has updated GPUs. Perfect for anyone doing machine learning projects 🖥️🚀" },
    { authorId: maria.id, content: "Anyone interested in forming a study group for Organic Chemistry? That midterm is going to be tough 💀🧪" },
  ];

  const insertedPosts = await db.insert(posts).values(demoPosts).returning();
  console.log(`✅ Created ${insertedPosts.length} posts`);

  // Create comments
  const demoComments = [
    { postId: insertedPosts[0].id, authorId: priya.id, content: "AVL rotations are tricky! I can help. Let's meet at the library tomorrow?" },
    { postId: insertedPosts[0].id, authorId: alex.id, content: "That would be amazing! How about 2PM at the 2nd floor study room?" },
    { postId: insertedPosts[0].id, authorId: emily.id, content: "I'd love to join! Count me in for the study group 🙋‍♀️" },
    { postId: insertedPosts[1].id, authorId: emily.id, content: "That's incredible Maria! What enzyme were you testing?" },
    { postId: insertedPosts[1].id, authorId: maria.id, content: "Catalase! The reaction rate was 3x higher than predicted." },
    { postId: insertedPosts[2].id, authorId: alex.id, content: "I'll be there! Been practicing my three-pointers all summer 🎯" },
    { postId: insertedPosts[2].id, authorId: carlos.id, content: "Is there a volleyball tryout too? Asking for a friend 👀" },
    { postId: insertedPosts[3].id, authorId: alex.id, content: "MIT OCW is a lifesaver! Thanks for sharing Priya!" },
    { postId: insertedPosts[4].id, authorId: carlos.id, content: "Your beats are fire bro! 🔥🔥" },
    { postId: insertedPosts[5].id, authorId: emily.id, content: "I just finished reading it! Gatsby's story is so tragic but beautifully written." },
    { postId: insertedPosts[5].id, authorId: alex.id, content: "Can we add 1984 to the next reading list?" },
    { postId: insertedPosts[7].id, authorId: sarah.id, content: "This is such an important initiative! Mental health matters 💚" },
    { postId: insertedPosts[7].id, authorId: maria.id, content: "Therapy dogs!! I'm definitely coming 🐕" },
    { postId: insertedPosts[7].id, authorId: james.id, content: "Great work Emily! We all need this." },
    { postId: insertedPosts[8].id, authorId: priya.id, content: "The nav app sounds super useful! Is it on the App Store?" },
    { postId: insertedPosts[8].id, authorId: james.id, content: "Congrats to your team! 🎉" },
    { postId: insertedPosts[9].id, authorId: alex.id, content: "CONGRATULATIONS Maria!! You deserve it!! 🎊🎉" },
    { postId: insertedPosts[9].id, authorId: sarah.id, content: "So proud of you! This is amazing news!" },
    { postId: insertedPosts[10].id, authorId: emily.id, content: "Pomodoro changed my life too! I use the Forest app for it." },
    { postId: insertedPosts[11].id, authorId: david.id, content: "Boba run after class? 🧋" },
    { postId: insertedPosts[13].id, authorId: carlos.id, content: "I can play drums! Let's jam this weekend?" },
  ];

  const insertedComments = await db.insert(comments).values(demoComments).returning();
  console.log(`✅ Created ${insertedComments.length} comments`);

  // Create likes
  const likeData: Array<{ postId: string; userId: string }> = [];
  for (const post of insertedPosts) {
    const likers = insertedUsers.filter(() => Math.random() > 0.4);
    for (const liker of likers) {
      if (liker.id !== post.authorId) {
        likeData.push({ postId: post.id, userId: liker.id });
      }
    }
  }
  if (likeData.length) {
    await db.insert(likes).values(likeData);
  }
  console.log(`✅ Created ${likeData.length} likes`);

  // Create follows
  const followData = [
    { followerId: alex.id, followingId: maria.id },
    { followerId: alex.id, followingId: priya.id },
    { followerId: alex.id, followingId: emily.id },
    { followerId: alex.id, followingId: james.id },
    { followerId: maria.id, followingId: alex.id },
    { followerId: maria.id, followingId: sarah.id },
    { followerId: maria.id, followingId: emily.id },
    { followerId: james.id, followingId: alex.id },
    { followerId: james.id, followingId: carlos.id },
    { followerId: priya.id, followingId: alex.id },
    { followerId: priya.id, followingId: maria.id },
    { followerId: david.id, followingId: carlos.id },
    { followerId: david.id, followingId: alex.id },
    { followerId: sarah.id, followingId: emily.id },
    { followerId: sarah.id, followingId: maria.id },
    { followerId: carlos.id, followingId: david.id },
    { followerId: carlos.id, followingId: alex.id },
    { followerId: emily.id, followingId: alex.id },
    { followerId: emily.id, followingId: maria.id },
    { followerId: emily.id, followingId: sarah.id },
  ];
  await db.insert(follows).values(followData);
  console.log(`✅ Created ${followData.length} follows`);

  // Create messages (conversations)
  const messageData = [
    { senderId: alex.id, receiverId: maria.id, content: "Hey Maria! How did your bio exam go?", isRead: true },
    { senderId: maria.id, receiverId: alex.id, content: "It went really well! Thanks for asking 😊", isRead: true },
    { senderId: alex.id, receiverId: maria.id, content: "Awesome! Want to grab coffee later?", isRead: true },
    { senderId: maria.id, receiverId: alex.id, content: "Sure! Meet at the campus café at 4?", isRead: false },
    { senderId: alex.id, receiverId: priya.id, content: "Priya, can you help me with the calculus homework?", isRead: true },
    { senderId: priya.id, receiverId: alex.id, content: "Of course! Which problem are you stuck on?", isRead: true },
    { senderId: alex.id, receiverId: priya.id, content: "Problem 7 on integration by parts", isRead: true },
    { senderId: priya.id, receiverId: alex.id, content: "Ah that one's tricky. Let me send you my notes", isRead: false },
    { senderId: james.id, receiverId: alex.id, content: "Yo Alex! Are you coming to practice today?", isRead: true },
    { senderId: alex.id, receiverId: james.id, content: "Yeah I'll be there at 5!", isRead: true },
    { senderId: emily.id, receiverId: sarah.id, content: "Sarah, I love your thesis topic! Can I read a draft?", isRead: true },
    { senderId: sarah.id, receiverId: emily.id, content: "I'll send you what I have so far tonight!", isRead: false },
    { senderId: carlos.id, receiverId: david.id, content: "Hey, about the band - I found a bass player!", isRead: true },
    { senderId: david.id, receiverId: carlos.id, content: "No way! When can they rehearse?", isRead: false },
  ];
  await db.insert(messages).values(messageData);
  console.log(`✅ Created ${messageData.length} messages`);

  // Create notifications for Alex (demo user)
  const notificationData = [
    { userId: alex.id, type: "like", message: "Maria Garcia liked your post", link: `/post/${insertedPosts[0].id}`, isRead: false },
    { userId: alex.id, type: "comment", message: "Priya Patel commented on your post", link: `/post/${insertedPosts[0].id}`, isRead: false },
    { userId: alex.id, type: "follow", message: "Emily Chen started following you", link: `/profile/${emily.id}`, isRead: false },
    { userId: alex.id, type: "like", message: "James Wilson liked your post", link: `/post/${insertedPosts[8].id}`, isRead: true },
    { userId: alex.id, type: "comment", message: "Sarah Thompson commented on your post", link: `/post/${insertedPosts[5].id}`, isRead: true },
    { userId: alex.id, type: "message", message: "You have a new message from Maria Garcia", link: `/messages`, isRead: true },
    { userId: alex.id, type: "like", message: "David Kim liked your post", link: `/post/${insertedPosts[16].id}`, isRead: false },
    { userId: alex.id, type: "follow", message: "Carlos Rodriguez started following you", link: `/profile/${carlos.id}`, isRead: true },
  ];
  await db.insert(notifications).values(notificationData);
  console.log(`✅ Created ${notificationData.length} notifications`);

  console.log("\n🎉 Seeding complete!");
  console.log("📧 Demo login: alex@kcc.edu / password123");
}

seed()
  .catch(console.error)
  .finally(() => process.exit(0));
