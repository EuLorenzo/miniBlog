import { Link } from "react-router-dom";
import PostDetail from "../../components/PostDetail/PostDetail";
import useFetchDocuments from "../../hooks/useFetchDocuments";
import useQuery from "../../hooks/useQuery";
import styles from "./Search.module.css";

const Search = () => {
  const query = useQuery();
  const search = query.get("q");

  const { documents: posts } = useFetchDocuments({
    docCollection: "posts",
    search: search,
  });

  return (
    <div className={styles.search_container}>
      <h1>Search</h1>
      <div>
        {posts && posts.length === 0 && (
          <div className={styles.noposts}>
            <p>Não foram encontrados posts a partir da sua busca ....</p>
            <Link to={"/"} className="btn btn-dark">
              Voltar
            </Link>
          </div>
        )}
        {posts &&
          posts.map((post) => {
            return <PostDetail key={post.id} post={post} />;
          })}
      </div>
    </div>
  );
};

export default Search;
