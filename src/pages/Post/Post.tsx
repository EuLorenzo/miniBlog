import { useParams } from "react-router-dom";
import useFetchDocument from "../../hooks/useFetchDocument";
import styles from "./Post.module.css";

const Post = () => {
  const { id } = useParams();
  const documentObj = {
    docCollection: "posts",
    id: typeof id === "string" ? id : "Um erro ocorreu!",
  };

  const { document: post, loading } = useFetchDocument(documentObj);

  return (
    <div>
      {loading && <p>Carregando post ....</p>}

      {post && (
        <div className={styles.post_container}>
          <h1>{post.title}</h1>
          <img src={post.image} alt={post.title} />
          <p>{post.body}</p>
          <h3>Este post trata sobre: </h3>
          <div className={styles.tags}>
            {post.tags.map((tag) => (
              <p key={tag}>
                <span>#</span>
                {tag}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
