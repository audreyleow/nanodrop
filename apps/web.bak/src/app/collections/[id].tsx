export default function Page({ params }) {
  return <div>My Post</div>;
}

// export async function generateStaticParams() {
//   const collections = await fetch("https://.../posts").then((res) =>
//     res.json()
//   );

//   return collections.map((collection) => ({
//     id: collection.id,
//   }));
// }
