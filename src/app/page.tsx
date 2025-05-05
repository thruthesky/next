export default async function Home() {
  const dt = new Date().getTime();
  console.log("Server-side rendering at: ", dt);

  // 1. Fetch first 10 posts
  const postResponse = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=100&_time=" + dt
  );
  const posts = await postResponse.json();

  // 2. Extract unique user IDs from posts
  const userIds = [...new Set(posts.map((post: any) => post.userId))];

  // 3. Create fetch promises for each unique user
  const userPromises = userIds.map((userId) =>
    fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}?_time=${dt}`
    ).then((res) => res.json())
  );

  // 4. Fetch required users concurrently
  const users = await Promise.all(userPromises);

  // 5. Create a map of users by their ID for quick lookup
  const userMap = users.reduce((acc: any, user: any) => {
    acc[user.id] = user;
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Latest Posts</h1>
      <small>
        Server-side rendering at: {new Date().toLocaleString()}: {dt}
      </small>
      <div className="divide-y divide-gray-200">
        {posts.map((post: any) => {
          const user = userMap[post.userId]; // Find the user for the post
          return (
            <div key={post.id} className="py-4 px-2">
              <h2 className="text-lg font-semibold mb-1">{post.title}</h2>
              <p className="text-sm text-gray-600">
                By: {user ? user.name : "Unknown User"}
              </p>
              <p>{post.body}</p>
              {/* Optionally display post body:
              <p className="mt-2 text-gray-800">{post.body}</p>
              */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
